import passSvg from "../../assets/images/password.png";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [emailPlc, setEmailplc] = useState(true);
  const [passPlc, setPassplc] = useState(true);

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
      navigate("/products");
      window.location.reload();
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.length !== 0) {
                  setEmailplc(false);
                } else {
                  setEmailplc(true);
                }
              }}
            />
            {emailPlc && (
              <div className="input_plc">
                <p style={{ color: "#3e424a" }}>
                  Email <span style={{ color: "#FF4000" }}>*</span>
                </p>
              </div>
            )}
          </div>
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPass ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length !== 0) {
                  setPassplc(false);
                } else {
                  setPassplc(true);
                }
              }}
            />
            {passPlc && (
              <div className="input_plc">
                <p style={{ color: "#3e424a" }}>
                  Password <span style={{ color: "#FF4000" }}>*</span>
                </p>
              </div>
            )}
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
