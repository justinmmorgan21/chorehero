import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function ChildrenCreate( { onClose } ) {

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    const params = new FormData(event.target);
    axios.post(`${apiConfig.backendBaseUrl}/children.json`, params).then(() => {
        onClose();
        navigate('/children');
      }
    )
  }

  return (
    <div>
      <h1>New Child</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" />
        </div>
        <div>
          Username: <input name="username" type="text" />
        </div>
        <div>
          Password: <input name="password" type="password" />
        </div>
        <div>
          Password confirmation: <input name="password_confirmation" type="password" />
        </div>
        <div>
          <label htmlFor="birthday">Birthdate: </label>
          <input type="date" id="birthday" name="birthdate" />
        </div>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}