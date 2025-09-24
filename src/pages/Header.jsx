import "../assets/css/header.css";
import redseamLogo from "../assets/images/logo.svg";
import loginSvg from "../assets/images/login.svg";
import cartLogo from "../assets/images/cart_logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import closePng from "../assets/images/close.png";
import emptyCart from "../assets/images/emptyCart.svg";

export default function Header() {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="header_main">
        <div onClick={() => navigate("/products")}>
          <img src={redseamLogo} />
          <h3>RedSeam Clothing</h3>
        </div>

        {user ? (
          <div
            onClick={() => setShowSidebar(true)}
            className="cart_btn_div"
            style={{ cursor: "pointer" }}
          >
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
      {showSidebar && (
        <div onClick={() => setShowSidebar(false)} className="sidebar-overlay">
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart_header">
              <p className="header_p">Shopping cart (0)</p>
              <img onClick={() => setShowSidebar(false)} src={closePng} />
            </div>
            <div className="empty_cart_div">
              <img src={emptyCart} />
              <h2>Ooops!</h2>
              <p>You've got nothing in your cart just yet...</p>
              <div
                onClick={() => setShowSidebar(false)}
                className="button cart_btn_s"
              >
                Start shopping
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
