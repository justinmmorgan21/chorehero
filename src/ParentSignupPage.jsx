import axios from "axios";
import { useState } from "react";
import apiConfig from "./apiConfig";
export function ParentSignupPage() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios
      .post(`${apiConfig.backendBaseUrl}/parents.json`, params)
      .then(() => {
        event.target.reset();
        window.location.href = "/";
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      });
  };

  return (
    <div id="parent_signup">
      <h1>Parent Signup</h1>
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
          Email: <input name="email" type="email" />
        </div>
        <div style={{marginBottom:"8px"}}>
          Password: <input name="password" type="password" />
        </div>
        <div style={{marginBottom:"8px"}}>
          Password confirmation: <input name="password_confirmation" type="password" />
        </div>
        <div>
          <button type="submit">Signup</button>
          <span>&nbsp;&nbsp;&nbsp;already have an account? <a href="/login">Log in</a></span>
        </div>
      </form>
    </div>
  );
}