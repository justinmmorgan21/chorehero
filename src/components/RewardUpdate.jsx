import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function RewardUpdate( { reward, onClose } ) {
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    axios.patch(`${apiConfig.backendBaseUrl}/rewards/${reward.id}.json`, params).then(() => {
      onClose();
      navigate('/rewards');
    })
  }

  return (
    <div>
      <h1>Update Reward</h1>
      <br />
      <h3>{reward.title}</h3>
      <hr style={{margin:"8px 0"}}/>
      <form onSubmit={handleSubmit}>
        <label htmlFor="points_cost">New Points Cost: </label>
        <input name="points_cost" type="text" size="4" defaultValue={reward.points_cost}/><br />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}