import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { RewardCreate } from "./components/RewardCreate";
import { Modal } from "./components/Modal";
import { RewardsIndex } from "./components/RewardsIndex";
import { RewardUpdate } from "./components/RewardUpdate";

export function RewardsIndexPage() {
  const rewards = useLoaderData();
  console.log(rewards);
  console.log(rewards.reward_groups);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  // const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  // const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  // const [currentChild, setCurrentChild] = useState(null);
  const [currentReward, setCurrentReward] = useState(null);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }
  const handleEditClose = () => {
    setEditModalVisible(false);
  }

  const handleRewardEdit = (reward) => {
    setEditModalVisible(true);
    setCurrentReward(reward);
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All rewards</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add reward</button>
        </div>
      </div>
      <div style={{display:"flex", flexDirection:"row", gap:"100px"}}>
        <RewardsIndex rewardsData={rewards} onEdit={handleRewardEdit} />
        <div style={{border:"1px solid black", padding:"40px", marginTop:"16px", boxShadow:"2px 2px 2px gray", height:"fit-content"}}>
          <div>
            <h2>Reward-Points Chart:</h2>
            <br />
            {Object.keys(rewards.reward_groups).map(score => (
              <div key={score}>
                <p style={{fontWeight:"bold", fontSize:"1.1em"}}>{score} points</p>
                <hr />
                <div>
                {rewards.reward_groups[score].filter(reward=>reward.active).map(reward => (
                  <p key={reward.id} style={{margin:"3px 2px 2px 8px"}}>
                    {reward.title}
                  </p>
                ))}
                </div>
                <br />
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <RewardCreate onClose={handleCreateClose} />
      </Modal>
      <Modal onClose={handleEditClose} show={editModalVisible}>
        <RewardUpdate onClose={handleEditClose} reward={currentReward}/>
      </Modal>
    </div>
  );
}