import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./pages/auth/Index.js";
import Chat from "./pages/Chat/Index";

function App() {
  // const [isLogin, setIsLogin] = useState();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const getLoginInfo = localStorage.getItem("auth");
  //   navigate("/login");
  // });
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Chat />} />
          <Route path="login" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
