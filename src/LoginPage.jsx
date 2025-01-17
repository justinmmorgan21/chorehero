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
        console.log(response.data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        console.log(response.data.role === "parent" ? "parent" : "child");
        event.target.reset();
        window.location.href = response.data.role === "parent" ? "/" : "/rewards"; // Change this to hide a modal, redirect to a specific page, etc.
      })
      .catch((error) => {
        console.log(error.response);
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}