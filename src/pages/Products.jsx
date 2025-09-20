import Header from "./Header";

export default function Products() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Header />
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
    </>
  );
}
