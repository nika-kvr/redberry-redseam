import { useEffect, useState, useMemo } from "react";
import "../assets/css/checkout.css";
import emailSvg from "../assets/images/email.svg";
import checkSvg from "../assets/images/check.svg";
import closeBtn from "../assets/images/close.png";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const userEmail = JSON.parse(localStorage.getItem("user")).email;
  const [emailPlc, setEmailplc] = useState(false);

  const [cart, setCart] = useState([]);
  const userToken = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const [itemsPrice, setItemsPrice] = useState(0);

  const [email, setEmail] = useState(userEmail);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [zip_code, setZipcode] = useState("");

  const [nameErr, setNameErr] = useState(false);
  const [surnameErr, setSurnameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [addressErr, setAddressErr] = useState(false);
  const [zipcodeErr, setZipcodeErr] = useState(false);

  const nameValid = (value, max) => value.length < max || /\s/.test(value);
  const emailValid = (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken} `,
        },
      });
      const data = await res.json();
      if (data.length === 0) {
        navigate("/products");
        window.location.reload();
      }
      setCart(data);
      console.log(data);
    } catch (err) {
      navigate("/products");
      console.log(err);
    }
  };
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

  useEffect(() => {
    if (userToken) fetchData();
  }, []);

  const handlePay = async () => {
    if (
      !nameValid(name, 1) &&
      !nameValid(surname, 1) &&
      !emailValid(email) &&
      !nameValid(address, 3) &&
      !nameValid(zip_code, 2)
    ) {
      try {
        const res = await fetch(`${apiUrl}/cart/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken} `,
          },
          body: JSON.stringify({
            name,
            surname,
            email,
            zip_code,
            address,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setShowModal(true);
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      setNameErr(nameValid(name, 1));
      setSurnameErr(nameValid(surname, 1));
      setEmailErr(emailValid(email));
      setAddressErr(nameValid(address, 3));
      setZipcodeErr(nameValid(zip_code, 2));
    }
  };
  const closeSucc = () => {
    navigate("/products");
    window.location.reload();
  };

  return (
    <>
      {showModal && (
        <div class="full_screen_overlay">
          <img onClick={closeSucc} src={closeBtn} />
          <div class="centered_content">
            <div className="succ_div">
              <img src={checkSvg} />
            </div>
            <h1>Congrats!</h1>
            <p>Your order is placed successfully!</p>
            <div onClick={closeSucc} className="button">
              Continue shopping
            </div>
          </div>
        </div>
      )}
      <div className="checkout_main">
        <h1>Checkout</h1>
        <div className="checkout_main_cont">
          <div className="check_form">
            <p>Order details</p>
            <div className="checkout_form">
              <div className="row">
                <input
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameErr(nameValid(e.target.value, 1));
                  }}
                  type="text"
                  className={`check_txt_input ${nameErr ? "input_err" : ""}`}
                  placeholder="Name"
                />
                <input
                  onChange={(e) => {
                    setSurname(e.target.value);
                    setSurnameErr(nameValid(e.target.value, 1));
                  }}
                  className={`check_txt_input ${surnameErr ? "input_err" : ""}`}
                  type="text"
                  placeholder="Surname"
                />
              </div>

              <div className="input_div">
                <input
                  value={email}
                  className={`check_txt_input ${emailErr ? "input_err" : ""}`}
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailErr(emailValid(e.target.value));
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
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressErr(nameValid(e.target.value, 3));
                  }}
                  className={`check_txt_input ${addressErr ? "input_err" : ""}`}
                  type="text"
                  placeholder="Address"
                />
                <input
                  onChange={(e) => {
                    setZipcode(e.target.value);
                    setZipcodeErr(nameValid(e.target.value, 2));
                  }}
                  className={`check_txt_input ${zipcodeErr ? "input_err" : ""}`}
                  type="number"
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
                              prod.quantity + 1,
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
              <div onClick={handlePay} className="button">
                Pay
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
