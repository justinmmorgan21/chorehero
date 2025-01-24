import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function RewardsIndex( { rewardsData, onEdit, currentParent, onRedeem } ) {
  
  const rewards = rewardsData.rewards;
  const navigate = useNavigate();

  const handleRemove = (reward) => {
    if (reward.used_rewards.every(used_reward => used_reward.date_approved == null)) {
      let axiosPromises = reward.used_rewards.map((usedReward) => {
        return axios.delete(`${apiConfig.backendBaseUrl}/used_rewards/${usedReward.id}.json`);
      });
      Promise.all(axiosPromises).then(() => {
        axios.delete(`${apiConfig.backendBaseUrl}/rewards/${reward.id}.json`).then(() => {
          navigate('/rewards');
        })
      })
    } else {
      const params = new FormData();
      params.append("active", false);
      axios.patch(`${apiConfig.backendBaseUrl}/rewards/${reward.id}.json`, params).then(() => navigate('/rewards'))
    }
  }

  return (
    <div>
      <br />
      <div >
        { rewards.filter(reward=>reward.active).map( reward => (
          <div key={reward.id} className="reward" style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:"white"}} >
            <div style={{border:"0px solid blue", marginRight:"24px"}}>
              <h3 style={{padding:"8px 0", border:"0px solid red"}}>{reward.title}</h3>
              <div>cost: {reward.points_cost} points</div>
            </div>  
            { currentParent.username ?
            <div>
              <button style={{height:"fit-content", padding:"4px 12px", marginRight:"3px"}} onClick={() => onEdit(reward)}>Change Points Cost</button>
              <button style={{height:"fit-content", padding:"4px 12px"}} onClick={() => handleRemove(reward)}>Remove</button>
            </div>
            :
            <div>
              <button style={{height:"fit-content", padding:"4px 12px"}} onClick={() => onRedeem(reward)}>Redeem</button>
            </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}