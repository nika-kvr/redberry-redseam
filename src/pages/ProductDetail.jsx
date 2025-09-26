import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/product.css";
import { useNavigate } from "react-router-dom";
import softenColor from "./components/Colors";
import cartPng from "../assets/images/cart_logo.svg";

export default function ProductsDetail() {
  const userString = localStorage.getItem("user");
  const userToken = localStorage.getItem("token");
  const user = userString ? JSON.parse(userString) : null;
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDrop, setShowdrop] = useState(false);

  const [product, setProduct] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSize, setActivesize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [prodAvailable, setProdAvailable] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowdrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setProdAvailable(
          data.quantity && data.available_sizes && data.available_colors
        );
        data.quantity ? setQuantity(1) : setQuantity(0);
        if (data.available_sizes) {
          setActivesize(data.available_sizes[0]);
        } else {
          setQuantity(0);
          setActivesize("");
        }
      } catch (err) {
        console.log("eroria");
        navigate("/products");
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleColorChng = (color) => {
    const index = product.available_colors.indexOf(color);
    if (index !== -1) {
      setActiveIndex(index);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      console.log("user not found");
      navigate("/login");
      return;
    }
    const color = product.available_colors[activeIndex];
    const size = activeSize;

    try {
      const response = await fetch(`${apiUrl}/cart/products/${id}`, {
        method: "POST",
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

      window.dispatchEvent(new Event("cartUpdated"));
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="products_main">
        <div>
          <p>Listing / Product</p>
        </div>
        <div className="prod_div">
          <div className="imgs_div">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product ${index}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <div className="image_div">
            <img src={product?.images[activeIndex]} />
          </div>
          <div className="prodDetial_div">
            <h1 style={{ marginBottom: "21px" }}>{product?.name}</h1>
            <h1 style={{ marginBottom: "56px" }}>$ {product?.price}</h1>
            <p style={{ marginBottom: "16px" }}>
              Color: {product?.available_colors[activeIndex]}
            </p>
            <div style={{ marginBottom: "48px" }} className="colors_div">
              {product?.available_colors.map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: softenColor(color, index) }}
                  className={`color_btn ${
                    activeIndex === index && "active_color"
                  }`}
                  onClick={() => handleColorChng(color)}
                ></div>
              ))}
            </div>
            <p style={{ marginBottom: "16px" }}>Size: {activeSize}</p>
            <div style={{ marginBottom: "48px" }} className="sizes_div">
              {!product?.available_sizes && (
                <div>
                  <p>sizes not available</p>
                </div>
              )}
              {product?.available_sizes?.map((size, index) => (
                <div
                  className={`prod_size ${
                    activeSize === size && "active_size"
                  }`}
                  key={index}
                  onClick={() => setActivesize(size)}
                >
                  <p>{size}</p>
                </div>
              ))}
            </div>
            <p style={{ marginBottom: "16px" }}>Quantity</p>
            <div
              ref={dropdownRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowdrop(!showDrop);
              }}
              className={`qnty_div ${!quantity && "inactive"}`}
              style={{ padding: "7px 0", position: "relative" }}
            >
              <p>{quantity}</p>
              {quantity > 0 && (
                <div
                  style={{ transform: "rotate(-90deg)" }}
                  className="dropdown_img"
                ></div>
              )}
              {showDrop && quantity > 0 && (
                <div
                  className="dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowdrop(!showDrop);
                  }}
                >
                  {Array.from({ length: product?.quantity }).map((_, index) => (
                    <div
                      key={index}
                      className="dropdown_cont"
                      onClick={() => {
                        setQuantity(index + 1);
                        setShowdrop(false);
                      }}
                    >
                      <p style={{ color: "#40444c" }}>{index + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {prodAvailable ? (
              <div>
                <div onClick={handleAddToCart} className="button cart_btn">
                  <img src={cartPng} />
                  Add to cart
                </div>
              </div>
            ) : (
              <div className="cart_btn">
                <h1>Out of stock</h1>
              </div>
            )}
            <div className="line"></div>
            <div>
              <div className="details_div">
                <p className="details_p">Details</p>
                <img src={product?.brand.image} />
              </div>
              <p style={{ marginTop: "7px" }}>Brand: {product?.brand.name}</p>
              <p style={{ marginTop: "19px" }}>{product?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
