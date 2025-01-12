import { FaCheck } from "react-icons/fa";

export function RewardsIndex( { rewards, onEdit } ) {

  return (
    <div>
      <br />
      <div className="cards">
        { rewards.map( reward => (
          <div key={reward.id} className="card">
            <h2 style={{marginBottom:"8px"}}>{reward.title}</h2>
            <br />
            <div>cost: {reward.points_cost} points</div>
            <br />
            <button onClick={() => onEdit(reward)}>Edit Reward</button>
          </div>
        ))}
      </div>
    </div>
  );
}