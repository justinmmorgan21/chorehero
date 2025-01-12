
export function RewardsIndex( { rewardsData, onEdit } ) {
  const rewards = rewardsData.rewards;
  return (
    <div>
      <br />
      <div >
        { rewards.map( reward => (
          <div key={reward.id} className="reward" style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}} >
            <div style={{border:"0px solid blue", marginRight:"24px"}}>
              <h3 style={{padding:"8px 0", border:"0px solid red"}}>{reward.title}</h3>
              <div>cost: {reward.points_cost} points</div>
            </div>  
            <button style={{height:"fit-content", padding:"4px 12px"}} onClick={() => onEdit(reward)}>Edit Reward</button>
          </div>
        ))}
      </div>
    </div>
  );
}