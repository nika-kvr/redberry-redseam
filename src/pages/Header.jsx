import "../assets/css/header.css";
import redseamLogo from "../assets/images/logo.svg";
import loginSvg from "../assets/images/login.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const goToProducts = () => {
    navigate("/products");
  };

  return (
    <>
      <div className="header_main">
        <div onClick={goToProducts}>
          <img src={redseamLogo} />
          <h3>RedSeam Clothing</h3>
        </div>
        <div>
          <img src={loginSvg} />
          <h3>Log in </h3>
        </div>
      </div>
    </>
  );
}
