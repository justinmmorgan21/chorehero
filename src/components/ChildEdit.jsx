import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function ChildEdit( { child, onClose } ) {

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.set("money_banked", params.get("money_banked").replace("$",""))
    axios.patch(`${apiConfig.backendBaseUrl}/children/${child.id}.json`, params).then(() => {
        onClose();
        navigate('/children');
      }
    )
  }

  return (
    <div>
      <h1>Update Child</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" defaultValue={child.name}/>
        </div>
        <div>
          Username: <input name="username" type="text" defaultValue={child.username}/>
        </div>
        <div>
          Points: <input name="points_available" type="text" defaultValue={child.points_available}/>
        </div>
        <div>
          Money: <input name="money_banked" type="text" defaultValue={`$${child.money_banked}`}/>
        </div>
        <div>
          <label htmlFor="birthday">Birthdate: </label>
          <input type="date" id="birthday" name="birthdate" defaultValue={child.birthdate}/>
        </div>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}