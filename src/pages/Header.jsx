import "../assets/css/header.css";
import redseamLogo from "../assets/images/logo.svg";
import loginSvg from "../assets/images/login.svg";
import cartLogo from "../assets/images/cart_logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  return (
    <>
      <div className="header_main">
        <div onClick={() => navigate("/products")}>
          <img src={redseamLogo} />
          <h3>RedSeam Clothing</h3>
        </div>

        {user ? (
          <div className="cart_btn_div" style={{ cursor: "pointer" }}>
            <img src={cartLogo} style={{ width: "24px" }} />
            <img className="user_img" src={user.avatar} />
            <div
              className="dropdown_img"
              style={{ transform: "rotate(-90deg)" }}
            ></div>
          </div>
        ) : (
          <div onClick={() => navigate("/login")}>
            <img src={loginSvg} />
            <h3>Log in </h3>
          </div>
        )}
      </div>
    </>
  );
}
