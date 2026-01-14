import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import ChatRoomList from "./components/ChatRoomList";
import ChatRoom from "./components/ChatRoom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/rooms" element={<ChatRoomList />} />
                <Route path="/rooms/:id" element={<ChatRoom />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
