import axios from "axios";
import { useNavigate } from "react-router-dom";

export function RewardUpdate( { reward, onClose } ) {
  console.log(reward);
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    params.forEach((value,key)=>console.log(key, ":", value));
    axios.patch(`http://localhost:3000/rewards/${reward.id}.json`, params).then(() => {
      onClose();
      navigate('/rewards');
    })
  }

  return (
    <div>
      <h1>Update Reward</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Reward: </label><br />
        <input name="title" type="text" defaultValue={reward.title}/><br />
        <br />
        <label htmlFor="points_cost">Points cost: </label>
        <input name="points_cost" type="text" size="4" defaultValue={reward.points_cost}/><br />
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}