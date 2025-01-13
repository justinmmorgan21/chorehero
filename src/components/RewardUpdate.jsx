import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function RewardUpdate( { reward, onClose } ) {
  console.log(reward);
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    params.forEach((value,key)=>console.log(key, ":", value));
    axios.patch(`${apiConfig.backendBaseUrl}/rewards/${reward.id}.json`, params).then(() => {
      onClose();
      navigate('/rewards');
    })
  }

  return (
    <div>
      <h1>Update Reward</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="points_cost">New Points Cost: </label>
        <input name="points_cost" type="text" size="4" defaultValue={reward.points_cost}/><br />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}