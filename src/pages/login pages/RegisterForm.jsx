import passSvg from "../../assets/images/password.png";
import { useRef, useState } from "react";
import cameraSvg from "../../assets/images/camera.png";
import "../../assets/css/register.css";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onSwitch }) {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConf, setPasswordconf] = useState(null);
  const [error, setError] = useState([]);

  const [emailPlc, setEmailplc] = useState(true);
  const [usernamePlc, setUsernameplc] = useState(true);
  const [passPlc, setPassplc] = useState(true);
  const [passConfplc, setPassConfplc] = useState(true);

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/products");
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
              onChange={(e) => {
                setUsername(e.target.value);
                if (e.target.value.length !== 0) {
                  setUsernameplc(false);
                } else {
                  setUsernameplc(true);
                }
              }}
              className="txt_input"
              type="text"
            />
            {usernamePlc && (
              <div className="input_plc">
                <p style={{ color: "#3e424a" }}>
                  Username <span style={{ color: "#FF4000" }}>*</span>
                </p>
              </div>
            )}
          </div>
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
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPassConf ? "text" : "password"}
              onChange={(e) => {
                setPasswordconf(e.target.value);
                if (e.target.value.length !== 0) {
                  setPassConfplc(false);
                } else {
                  setPassConfplc(true);
                }
              }}
            />
            {passConfplc && (
              <div className="input_plc">
                <p style={{ color: "#3e424a" }}>
                  Confirm password <span style={{ color: "#FF4000" }}>*</span>
                </p>
              </div>
            )}
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
