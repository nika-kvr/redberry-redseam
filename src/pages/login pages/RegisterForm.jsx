import passSvg from "../../assets/images/password.png";
import { useRef, useState } from "react";
import cameraSvg from "../../assets/images/camera.png";

import "../../assets/css/register.css";

export default function RegisterForm({ onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConf, setPasswordconf] = useState(null);
  const [error, setError] = useState([]);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      file.preview = URL.createObjectURL(file);
      setImage(file);
    }
  };
  const handleDelete = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConf);
      if (image) {
        formData.append("avatar", image);
      }

      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat();
          setError(allErrors);
        } else if (data.message) {
          setError([data.message]);
        }
        return;
      }

      console.log("Logged in:", data.user);
    } catch (err) {
      setError([err.message]);
    }
  };

  return (
    <>
      <div className="auth_card">
        <h1 className="auth_h">Registration</h1>
        <form>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            ref={inputRef}
            hidden
          />
          <div>
            {!image ? (
              <div onClick={handleButtonClick} className="beforeUpload">
                <div className="beforeUpldImg">
                  <img className="cameraSvg" src={cameraSvg} />
                </div>
                <p>Upload images</p>
              </div>
            ) : (
              <div className="afterUpload">
                <img className="imgPreview" src={image.preview} />
                <p onClick={handleButtonClick} style={{ cursor: "pointer" }}>
                  Upload new
                </p>
                <p onClick={handleDelete} style={{ cursor: "pointer" }}>
                  Remove
                </p>
              </div>
            )}
          </div>
          <div className="input_div">
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="txt_input"
              type="text"
              placeholder="Username *"
            />
          </div>
          <div className="input_div">
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="txt_input"
              type="text"
              placeholder="Email *"
            />
          </div>
          <div className="input_div" id="pass_div">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="txt_input"
              type={showPass ? "text" : "password"}
              placeholder="Password *"
            />
            <img onClick={() => setShowPass(!showPass)} src={passSvg} />
          </div>
          <div className="input_div" id="pass_div">
            <input
              onChange={(e) => setPasswordconf(e.target.value)}
              className="txt_input"
              type={showPassConf ? "text" : "password"}
              placeholder="Confirm password *"
            />
            <img onClick={() => setShowPassConf(!showPassConf)} src={passSvg} />
          </div>
          {error.length > 0 &&
            error.map((err, index) => (
              <span key={index} style={{ color: "red" }}>
                {err}
              </span>
            ))}
          <div
            onClick={handleSubmit}
            style={{ marginTop: "22px" }}
            className="button"
          >
            Register
          </div>
          <div className="login_span_div">
            <span>Already member?</span>
            <span
              onClick={onSwitch}
              style={{ color: "#FF4000", cursor: "pointer" }}
            >
              Log in
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
