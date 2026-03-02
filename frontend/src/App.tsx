import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ChatRoomList from "./components/ChatRoomList";
import ChatRoom from "./components/ChatRoom";
import RequireAuth from "./components/RequireAuth";
import CreateChatRoom from "./components/CreateChatRoom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<RequireAuth />}>
                    <Route path="/rooms" element={<ChatRoomList />} />
                    <Route path="/rooms/create" element={<CreateChatRoom />} />
                    <Route path="/rooms/:id" element={<ChatRoom />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
