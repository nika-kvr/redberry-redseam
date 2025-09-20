import Header from "./Header";
import "../assets/css/products.css";
import { useEffect, useState } from "react";

export default function Products() {
  const user = JSON.parse(localStorage.getItem("user"));

  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/products`);
        const data = await res.json();
        setProducts(data.data);
        console.log(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [page]);

  return (
    <>
      <Header />
      <div className="products_main">
        <div className="products_header">
          <div>
            <h1>Products</h1>
          </div>
          <div className="filter_main">
            <h1>filters</h1>
          </div>
        </div>
        <div className="products_div">
          {products.map((p) => (
            <div key={p.id} className="product_card">
              <img src={p.cover_image} />
              <p>{p.name}</p>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
        <div className="pag_div">
          <div className="pag_arrow"></div>
          <div className="pag_btn pag_active"> 1</div>
          <div
            style={{ transform: "rotate(180deg)" }}
            className="pag_arrow"
          ></div>
        </div>
      </div>
    </>
  );
}
