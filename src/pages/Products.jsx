import Header from "./Header";
import "../assets/css/products.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import filterPng from "../assets/images/filter.png";

export default function Products() {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagArray, setPagArray] = useState([1, 2]);
  const [totalPages, setTotalPages] = useState(0);
  const [fromPgn, setFromPgn] = useState(1);
  const [toPgn, setToPgn] = useState(10);

  const handleBtnChange = () => {
    switch (page) {
      case 1:
        setPagArray([1, 2]);
        break;
      case 2:
        setPagArray([2, 3]);
        break;
      case 3:
        setPagArray([3, 4]);
        break;
      case 4:
        setPagArray([4, 5]);
        break;
      case 5:
        setPagArray([5, 6]);
        break;
      case 6:
        setPagArray([6, 7]);
        break;
      case 7:
        setPagArray([7, 8]);
        break;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/products?page=${page}`);
        const data = await res.json();
        setProducts(data.data);
        setTotalPages(data.meta.total);
        setFromPgn((page - 1) * 10 + 1);
        setToPgn(data.meta.to);
        console.log(data.meta);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    handleBtnChange();
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
            <span>{`showing ${fromPgn} -${toPgn} of ${totalPages} results `}</span>
            <span>|</span>
            <div>
              <img style={{ width: "24px" }} src={filterPng} />
              <p>Filter</p>
            </div>
            <div>
              <p>Sort by</p>
              <div
                className="dropdown_img"
                style={{ transform: "rotate(-90deg)" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="products_div">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              className="product_card"
            >
              <img src={p.cover_image} />
              <p>{p.name}</p>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
        <div className="pag_div">
          <div
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            className="pag_arrow"
          ></div>
          <div
            className={`pag_btn ${page < 8 && "pag_active"}`}
            onClick={() => {
              if (page > 7) {
                setPage(7);
              }
            }}
          >
            {pagArray[0]}
          </div>
          <div
            className={`pag_btn ${page === 8 && "pag_active"}`}
            onClick={() => {
              let currPage = pagArray[1];
              setPage(currPage);
            }}
          >
            {pagArray[1]}
          </div>
          {page < 7 && <div className="pag_btn ">...</div>}
          <div
            className={`pag_btn ${page === 9 && "pag_active"}`}
            onClick={() => {
              setPage(9);
            }}
          >
            9
          </div>
          <div
            className={`pag_btn ${page === 10 && "pag_active"}`}
            onClick={() => {
              setPage(10);
            }}
          >
            10
          </div>
          <div
            onClick={() => {
              if (page < 10) {
                setPage(page + 1);
              }
            }}
            style={{ transform: "rotate(180deg)" }}
            className="pag_arrow"
          ></div>
        </div>
      </div>
    </>
  );
}
