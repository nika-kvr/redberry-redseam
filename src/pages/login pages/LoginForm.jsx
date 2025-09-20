import passSvg from "../../assets/images/password.png";
import { use, useState } from "react";

export default function LoginForm({ onSwitch }) {
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Logged in:", data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="auth_card">
        <h1 className="auth_h">Log in</h1>
        <form>
          <div className="input_div">
            <input
              className="txt_input"
              type="text"
              placeholder="Email or username *"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPass ? "text" : "password"}
              placeholder="Password *"
              onChange={(e) => setPassword(e.target.value)}
            />
            <img onClick={() => setShowPass(!showPass)} src={passSvg} />
          </div>
          {error && <span style={{ color: "red" }}>{error}</span>}
          <div
            style={{ marginTop: "22px" }}
            className="button"
            onClick={handleSubmit}
          >
            Log in
          </div>
          <div className="login_span_div">
            <span>Not a member?</span>
            <span
              onClick={onSwitch}
              style={{ color: "#FF4000", cursor: "pointer" }}
            >
              Register
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
