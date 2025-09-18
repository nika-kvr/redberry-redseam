import passSvg from "../../assets/images/password.png";
import { use, useState } from "react";

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <div className="auth_card">
        <h1>Log in</h1>
        <form>
          <div className="input_div">
            <input
              className="txt_input"
              type="text"
              placeholder="Email or username *"
            />
          </div>
          <div className="input_div" id="pass_div">
            <input
              className="txt_input"
              type={showPass ? "text" : "password"}
              placeholder="Password *"
            />
            <img onClick={() => setShowPass(!showPass)} src={passSvg} />
          </div>
          <div style={{ marginTop: "22px" }} className="button">
            Log in
          </div>
        </form>
      </div>
    </>
  );
}
