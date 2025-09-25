import { useEffect, useState } from "react";
import "../assets/css/checkout.css";
import emailSvg from "../assets/images/email.svg";

export default function Checkout() {
  const userEmail = JSON.parse(localStorage.getItem("user")).email;
  const [emailPlc, setEmailplc] = useState(false);
  const [email, setEmail] = useState(userEmail);

  const [cart, setCart] = useState([]);
  const userToken = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;
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

  return (
    <>
      <div className="checkout_main">
        <h1>Checkout</h1>
        <div className="checkout_main_cont">
          <div className="check_form">
            <p>Order details</p>
            <div className="checkout_form">
              <div className="row">
                <input type="text" className="txt_input" placeholder="Name" />
                <input
                  type="text"
                  className="txt_input"
                  placeholder="Surname"
                />
              </div>

              <div className="input_div">
                <input
                  value={email}
                  className="txt_input"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value.length !== 0) {
                      setEmailplc(false);
                    } else {
                      setEmailplc(true);
                    }
                  }}
                />
                {emailPlc && (
                  <div className="check_input_plc">
                    <p style={{ color: "#3e424a" }}>
                      <img src={emailSvg} style={{ marginRight: "5px" }} />
                      Email
                    </p>
                  </div>
                )}
              </div>

              <div className="row">
                <input
                  type="text"
                  className="txt_input"
                  placeholder="Address"
                />
                <input
                  type="text"
                  className="txt_input"
                  placeholder="Zip code"
                />
              </div>
            </div>
          </div>

          <div className="check_cart">
            <div className="check_cart_div">
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
                              addQnty(prod.quantity - 1, prod.id);
                          }}
                        >
                          -
                        </p>
                        <p className="qnty_p">{prod.quantity}</p>
                        <p
                          className="qnty_add_btn"
                          onClick={() => {
                            addQnty(prod.quantity + 1, prod.id);
                          }}
                        >
                          +
                        </p>
                      </div>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(`${prod.id}`)}
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="check_cart_check">
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
        </div>
      </div>
    </>
  );
}
