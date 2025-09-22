import Header from "./Header";
import "../assets/css/products.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import filterPng from "../assets/images/filter.png";
import ReactPaginate from "react-paginate";

export default function Products() {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagArray, setPagArray] = useState([]);
  const [prodsQnty, setProdsQnty] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fromPgn, setFromPgn] = useState(1);
  const [toPgn, setToPgn] = useState(10);
  const [fltrErr, setFltrErr] = useState(false);

  const [showFltr, setShowFltr] = useState(false);
  const [fromFltr, setFromFltr] = useState("");
  const [toFltr, setToFltr] = useState("");

  const [showSort, setShowSort] = useState(false);

  const fltrRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fltrRef.current && !fltrRef.current.contains(event.target)) {
        setShowFltr(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      let url = `${apiUrl}/products?page=${page}&filter[price_from]=${fromFltr}`;

      if (toFltr) {
        url += `&filter[price_to]=${toFltr}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      if (data.data.length == 0) {
        setFromFltr("");
        setToFltr("");
        setPage(1);
        return;
      }

      setProducts(data.data);
      setTotalPages(Math.ceil(data.meta.total / data.meta.per_page));
      setProdsQnty(data.meta.total);
      setFromPgn((page - 1) * 10 + 1);
      setToPgn(data.meta.to);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
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
            <span>{`showing ${fromPgn} -${toPgn} of ${prodsQnty} results `}</span>
            <span>|</span>
            <div
              ref={fltrRef}
              className="filter_div"
              onClick={() => {
                setShowFltr(!showFltr);
              }}
            >
              <img style={{ width: "24px" }} src={filterPng} />
              <p>Filter</p>
              {showFltr && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="filter_card"
                >
                  <h3>Select price</h3>
                  <div className="filter_inpt_div">
                    <input
                      style={{
                        borderColor: fltrErr ? "red" : "#e1dfe1",
                      }}
                      type="number"
                      className="txt_input filter_input"
                      placeholder="From"
                      onChange={(e) => {
                        setFromFltr(e.target.value);
                      }}
                      value={fromFltr}
                    />
                    <input
                      style={{
                        borderColor: fltrErr ? "red" : "#e1dfe1",
                      }}
                      type="number"
                      className="txt_input filter_input"
                      placeholder="To"
                      onChange={(e) => {
                        setToFltr(e.target.value);
                      }}
                      value={toFltr}
                    />
                  </div>
                  <div className="filter_btn_div">
                    <div
                      className="button filter_btn"
                      onClick={() => {
                        if (fromFltr <= toFltr || !toFltr) {
                          setShowFltr(false);
                          setFltrErr(false);
                          setPage(1);
                          fetchData();
                        } else {
                          setFltrErr(true);
                        }
                      }}
                    >
                      Apply
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              ref={sortRef}
              className="sort_div"
              onClick={() => {
                setShowSort(!showSort);
                setShowFltr(false);
              }}
            >
              <p>Sort by</p>
              <div
                className="dropdown_img"
                style={{ transform: "rotate(-90deg)" }}
              ></div>
              {showSort && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="filter_card sort_card"
                >
                  <h3>Sorty by</h3>
                  <p>New products first</p>
                  <p>Price, low to high</p>
                  <p>Price, high to low</p>
                </div>
              )}
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
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            previousLabel="<"
            pageCount={totalPages}
            pageRangeDisplayed={2}
            onPageChange={(e) => {
              setPage(e.selected + 1);
            }}
            forcePage={page - 1}
            containerClassName="pagination"
            activeClassName="pag_active"
            marginPagesDisplayed={2}
          />
        </div>
      </div>
    </>
  );
}
