import axios from "axios";
import { useState } from "react";
import apiConfig from "./apiConfig";

const jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export function LoginPage() {
  const [errors, setErrors] = useState([]);
  const [toggle, setToggle] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post(`${apiConfig.backendBaseUrl}/sessions.json`, params)
      .then((response) => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        window.location.href = response.data.role === "parent" ? "/children" : `/children/${response.data.user_id}`; // Change this to hide a modal, redirect to a specific page, etc.
        event.target.reset();
      })
      .catch(() => {
        setErrors(["Invalid email or password"]);
      });
  };

  return (
    <div id="login">
      <h1>Login</h1>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:"8px"}}>
          Username: <input name="username" type="text" />
        </div>
        <div style={{marginBottom:"8px"}}>
          Password: <input name="password" type="password" />
        </div>
        <div style={{marginBottom:"8px"}}>
          <input type="checkbox"  onChange={()=>setToggle(!toggle)}/> I am a child
        </div>        
        <div hidden={toggle} style={{marginBottom:"8px"}}>
          Parent Username: <input name="parent_username" type="text" />
        </div>
        <div>
          <button type="submit">Login</button>
          <span>&nbsp;&nbsp;&nbsp;<a href="/signup">or create account?</a></span>
        </div>
      </form>
    </div>
  );
}