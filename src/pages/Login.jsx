import Header from "./Header";
import loginPng from "../assets/images/auth_img.png";
import "../assets/css/login.css";
import LoginForm from "./login pages/LoginForm";
import RegisterForm from "./login pages/RegisterForm";
import { useState } from "react";

export default function Login() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <Header />
      <div className="main_login">
        <div>
          <img className="login_png" src={loginPng} />
        </div>
        <div className="auth_div">
          {showLogin ? (
            <LoginForm onSwitch={() => setShowLogin(false)} />
          ) : (
            <RegisterForm onSwitch={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </>
  );
}
