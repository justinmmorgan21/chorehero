import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function RewardCreate( { onClose } ) {
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    
    // make new Chore
    axios.post(`${apiConfig.backendBaseUrl}/rewards.json`, params).then(() => {
      onClose();
      navigate('/rewards');
    })
  }

  return (
    <div>
      <h1>New Reward</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Reward: </label><br />
        <input name="title" type="text" /><br />
        <br />
        <label htmlFor="points_cost">Points cost: </label>
        <input name="points_cost" type="text" size="4"/><br />
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}