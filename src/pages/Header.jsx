import "../assets/css/header.css";
import redseamLogo from "../assets/images/logo.svg";
import loginSvg from "../assets/images/login.svg";
import cartLogo from "../assets/images/cart_logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import closePng from "../assets/images/close.png";
import emptyCart from "../assets/images/emptyCart.svg";
import { useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  const userString = localStorage.getItem("user");

  const [user, setUser] = useState(userString ? JSON.parse(userString) : null);
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));

  const apiUrl = import.meta.env.VITE_API_URL;
  const [cart, setCart] = useState([]);

  const [showSidebar, setShowSidebar] = useState(false);

  const [itemsPrice, setItemsPrice] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken} `,
        },
      });
      const data = await res.json();
      setCart(data);
      console.log(data);
    } catch (err) {
      console.log(`tokeni`, userToken);
      navigate("/products");
      console.log(err);
    }
  };

  useEffect(() => {
    if (userToken) fetchData();
  }, []);

  useEffect(() => {
    const handleUpdate = () => fetchData();
    window.addEventListener("cartUpdated", handleUpdate);

    return () => window.removeEventListener("cartUpdated", handleUpdate);
  }, []);

  const handleDelete = async (id, color, size) => {
    try {
      const response = await fetch(`${apiUrl}/cart/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken} `,
        },
        body: JSON.stringify({
          color,
          size,
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addQnty = async (quantity, id, color, size) => {
    try {
      const response = await fetch(`${apiUrl}/cart/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken} `,
        },
        body: JSON.stringify({
          quantity,
          color,
          size,
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    setItemsPrice(totalPrice);
  }, [totalPrice]);

  return (
    <>
      <div className="header_main">
        <div onClick={() => navigate("/products")}>
          <img src={redseamLogo} />
          <h3>RedSeam Clothing</h3>
        </div>

        {user ? (
          <div
            onClick={() => {
              if (!isCheckout) setShowSidebar(true);
            }}
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
      {showSidebar && !isCheckout && (
        <div onClick={() => setShowSidebar(false)} className="sidebar-overlay">
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart_header">
              <p className="header_p">Shopping cart ({cart?.length})</p>
              <img onClick={() => setShowSidebar(false)} src={closePng} />
            </div>
            {cart?.length !== 0 ? (
              <div className="cart_div">
                {cart?.map((prod, index) => (
                  <div key={index} className="cart_item">
                    <img src={prod.cover_image} />
                    <div className="cart_detail_main">
                      <div className="cart_detail_1">
                        <h2 style={{ fontSize: "18px" }}>{prod.name}</h2>
                        <h1>$ {prod.price}</h1>
                      </div>
                      <div className="cart_detail_2">
                        <p>{prod.color}</p>
                        <p>{prod.size}</p>
                      </div>
                      <div className="cart_detail_3">
                        <div className="qnty_div_btn">
                          <p
                            className={`qnty_add_btn ${
                              prod.quantity === 1 ? "inactive_btn" : ""
                            }`}
                            onClick={() => {
                              if (prod.quantity !== 1)
                                addQnty(
                                  prod.quantity - 1,
                                  prod.id,
                                  prod.color,
                                  prod.size
                                );
                            }}
                          >
                            -
                          </p>
                          <p className="qnty_p">{prod.quantity}</p>
                          <p
                            className="qnty_add_btn"
                            onClick={() => {
                              addQnty(
                                prod.quantity - 1,
                                prod.id,
                                prod.color,
                                prod.size
                              );
                            }}
                          >
                            +
                          </p>
                        </div>
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleDelete(prod.id, prod.color, prod.size)
                          }
                        >
                          Remove
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="cart_check">
                  <div className="cart_check_detail">
                    <div>
                      <p>Items subtotal</p>
                      <p>$ {itemsPrice}</p>
                    </div>
                    <div>
                      <p>Delivery</p>
                      <p>$ 5</p>
                    </div>
                    <div>
                      <h2>Total</h2>
                      <h2>$ {itemsPrice + 5}</h2>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setShowSidebar(false);
                      navigate("/checkout");
                    }}
                    className="button"
                  >
                    Go to checkout
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
