import Header from "./Header";
import "../assets/css/products.css";
import leftArr from "../assets/images/left-arrow.png";

export default function Products() {
  const user = JSON.parse(localStorage.getItem("user"));

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
        <div className="pag_div">
          <div className="pag_arrow"></div>
          <div className="pag_btn pag_active"> 1</div>
          <div className="pag_btn"> 2</div>
          <div className="pag_btn"> ...</div>
          <div className="pag_btn"> 9</div>
          <div className="pag_btn"> 10</div>
          <div
            style={{ transform: "rotate(180deg)" }}
            className="pag_arrow"
          ></div>
        </div>
      </div>
    </>
  );
}
