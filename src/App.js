import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./pages/auth/Index.js";
import Chat from "./pages/Chat/Index";
import { Login } from "./pages/auth/Login.js";
import { Signup } from "./pages/auth/Signup.js";
import { Guest } from "./pages/auth/Guest.js";

function App() {
  const [accessMode, setAccessMode] = useState("login");
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
          <Route path="/" element={<Chat />} />
          <Route path="/mode" element={<Auth />}>
            {/* nested Routing */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="guest" element={<Guest />} />
            <Route />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
