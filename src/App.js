import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./component/Login";
import Chat from "./component/Chat";
import ChatAdmin from "./component/ChatAdmin";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/chatadmin" element={<ChatAdmin />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
  //return (<Login />), (<ChatRoom />);
};

export default App;
