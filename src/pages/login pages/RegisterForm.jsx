import passSvg from "../../assets/images/password.png";
import { useRef, useState } from "react";
import cameraSvg from "../../assets/images/camera.png";

import "../../assets/css/register.css";

export default function RegisterForm({ onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);

  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const handleDelete = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  return (
    <>
      <div className="auth_card">
        <h1>Registration</h1>
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
                <img className="imgPreview" src={image} />
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
            <input className="txt_input" type="text" placeholder="Username *" />
          </div>
          <div className="input_div">
            <input className="txt_input" type="text" placeholder="Email *" />
          </div>
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPass ? "text" : "password"}
              placeholder="Password *"
            />
            <img onClick={() => setShowPass(!showPass)} src={passSvg} />
          </div>
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPassConf ? "text" : "password"}
              placeholder="Confirm password *"
            />
            <img onClick={() => setShowPassConf(!showPassConf)} src={passSvg} />
          </div>
          <div style={{ marginTop: "22px" }} className="button">
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
