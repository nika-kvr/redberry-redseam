import { useState, useEffect } from "react";
import Header from "./Header";
import { useParams } from "react-router-dom";
import "../assets/css/product.css";
import { useNavigate } from "react-router-dom";
import softenColor from "./components/Colors";

export default function ProductsDetail() {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showDrop, setShowdrop] = useState(false);

  const [product, setProduct] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSize, setActivesize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setActivesize(data.available_sizes[0]);
        console.log(data);
      } catch (err) {
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

  return (
    <>
      <Header />
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
            <p style={{ marginBottom: "16px" }}>Color: {product?.color}</p>
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
            <p style={{ marginBottom: "16px" }}>Size: {product?.size}</p>
            <div style={{ marginBottom: "48px" }} className="sizes_div">
              {product?.available_sizes.map((size, index) => (
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
              onClick={(e) => {
                e.stopPropagation();
                setShowdrop(!showDrop);
              }}
              className="qnty_div"
              style={{ padding: "7px 0", position: "relative" }}
            >
              <p>{quantity}</p>
              <div
                style={{ transform: "rotate(-90deg)" }}
                className="dropdown_img"
              ></div>
              {showDrop && (
                <div
                  className="dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowdrop(!showDrop);
                  }}
                >
                  {Array.from({ length: product?.quantity }).map((_, index) => (
                    <div
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
          </div>
        </div>
      </div>
    </>
  );
}
