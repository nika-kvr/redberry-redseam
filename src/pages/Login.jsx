import Header from "./Header";
import loginPng from "../assets/images/auth_img.png";
import "../assets/css/login.css";
import LoginForm from "./login pages/LoginForm";
import RegisterForm from "./login pages/RegisterForm";

export default function Login() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Header />
      <div className="main_login">
        <div>
          <img className="login_png" src={loginPng} />
        </div>
        <div className="auth_div">
          {/* <LoginForm /> */}
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
