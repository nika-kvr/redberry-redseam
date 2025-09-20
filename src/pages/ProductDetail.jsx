import Header from "./Header";
import { useParams } from "react-router-dom";

export default function ProductsDetail() {
  const { id } = useParams();

  return (
    <>
      <Header />
      <div>
        <p>ID from URL: {id}</p>
      </div>
    </>
  );
}
