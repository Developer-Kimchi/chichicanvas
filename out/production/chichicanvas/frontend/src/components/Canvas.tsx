import React, { useRef, useEffect, useState } from "react";

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // 마우스를 누르고 있는지 여부
    const [drawing, setDrawing] = useState(false);

    // ✨ 현재 모드: "draw" | "erase"
    const [mode, setMode] = useState<"draw" | "erase">("draw");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ratio = window.devicePixelRatio || 1;

        canvas.width = 600 * ratio;
        canvas.height = 400 * ratio;
        canvas.style.width = "600px";
        canvas.style.height = "400px";

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.scale(ratio, ratio);
        ctx.lineCap = "round";
    }, []);

    // 마우스 좌표를 캔버스 기준 좌표로 변환
    const getPos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    // 마우스 누르면 그리기 시작
    const startDraw = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getPos(e);

        ctx.beginPath();
        ctx.moveTo(x, y);

        setDrawing(true);
    };

    // 마우스 이동 시 그리기 / 지우기
    const draw = (e: React.MouseEvent) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getPos(e);

        /**
         * ✨ 모드에 따라 캔버스 동작 변경
         */
        if (mode === "draw") {
            ctx.globalCompositeOperation = "source-over"; // 기본 그리기
            ctx.strokeStyle = "#2d3436";
            ctx.lineWidth = 2;
        } else {
            ctx.globalCompositeOperation = "destination-out"; // 지우개
            ctx.lineWidth = 14; // 지우개 크기
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    // 마우스 놓으면 종료
    const endDraw = () => setDrawing(false);

    return (
        <div>
            {/* 🎨 툴바 */}
            <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
                <button
                    onClick={() => setMode("draw")}
                    style={{
                        padding: "6px 12px",
                        background: mode === "draw" ? "#4f46e5" : "#ddd",
                        color: mode === "draw" ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    펜 ✏️
                </button>

                <button
                    onClick={() => setMode("erase")}
                    style={{
                        padding: "6px 12px",
                        background: mode === "erase" ? "#ef4444" : "#ddd",
                        color: mode === "erase" ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    지우개 🧽
                </button>
            </div>

            {/* 캔버스 */}
            <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                style={{
                    background: "#fff",
                    borderRadius: "8px",
                    border: "2px solid #dfe6e9",
                }}
            />
        </div>
    );
}

export default Canvas;
