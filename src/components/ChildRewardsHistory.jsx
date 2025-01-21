import axios from "axios";
import apiConfig from "../apiConfig";
import { useState, useEffect} from "react"

export function ChildRewardsHistory( { child } ) {
  console.log("CH: ", child);
  const [currentParent, setCurrentParent] = useState({});
  const getParent = () => {
    axios.get(`${apiConfig.backendBaseUrl}/parents/current.json`).then(response => {
      setCurrentParent(response.data);
    })
  }
  useEffect(getParent, []);

  return (
    <div>
      <h1>Reward History - {child.name}</h1>
      <br />
      <div>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <p>Reward</p>
          <p>Approved</p>
        </div>
        <hr />
        <ul style={{paddingLeft:"0"}}>
          {child.used_rewards.map( used_reward => (
            <li key={used_reward.id} style={{display:"flex", justifyContent:"space-between", gap:"12px"}}>
              <p>{used_reward.reward.title}</p>
              {used_reward.date_approved ?
              <p>{used_reward.date_approved?.slice(5,7)}/{used_reward.date_approved?.slice(8,10)}/{used_reward.date_approved?.slice(0,4)}</p>
              :
              <p>(pending)</p>
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}