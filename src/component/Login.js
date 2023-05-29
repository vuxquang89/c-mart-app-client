import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [jwt, setJwt] = useLocalState("jwt", "jwt");
  const navigate = useNavigate();

  const sendLoginRequest = () => {
    console.log("send login");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8080/api/customer/login", requestOptions)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        }
        throw Error(response.status);
      })
      .then((result) => {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("username", result.username);
        console.log(result);
        navigate("/chat");
      })
      .catch((error) => {
        console.log("error", error);
        alert("Email, password are wrong");
      });
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <h2>Login</h2>
          <hr />
        </div>

        <div className="row">
          <div className="col-sm-6">
            <form>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter Name"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label>password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter Fee"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => sendLoginRequest()}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
