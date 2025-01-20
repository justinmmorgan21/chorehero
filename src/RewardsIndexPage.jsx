import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import { RewardCreate } from "./components/RewardCreate";
import { Modal } from "./components/Modal";
import { RewardsIndex } from "./components/RewardsIndex";
import { RewardUpdate } from "./components/RewardUpdate";
import axios from "axios";
import apiConfig from "./apiConfig";

export function RewardsIndexPage() {
  const rewards = useLoaderData();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  const [currentParent, setCurrentParent] = useState({});
  const [currentChild, setCurrentChild] = useState({});
  const getParent = () => {
    axios.get(`${apiConfig.backendBaseUrl}/parents/current.json`).then(response => {
      setCurrentParent(response.data);
    })
  }
  const getChild = () => {
    axios.get(`${apiConfig.backendBaseUrl}/children/current.json`).then(response => {
      setCurrentChild(response.data);
    })
  }
  useEffect(getParent, []);
  useEffect(getChild, []);

  const [usedRewards, setUsedRewards] = useState({});
  const getUsedRewards = () => {
    axios.get(`${apiConfig.backendBaseUrl}/used_rewards.json`).then(response => {
      setUsedRewards(response.data.filter(usedReward => usedReward.child_id === currentChild.id));
    })
  }
  useEffect(getUsedRewards, [currentChild]);

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
        {currentParent.username ?
          <>
            <h1 style={{width:"100%", textAlign:"center"}}>Rewards</h1>
            <div>
              <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add reward</button>
            </div>
          </>
          :
          <div style={{display:"flex", margin:"24px 0", fontSize:"1.2em", gap:"32px"}}>
            <p>Points Available: {currentChild.points_available}</p> |
            <p>Money Banked: ${currentChild.money_banked}</p>
          </div>
        }
      </div>
      <div style={{display:"flex", flexDirection:"row", gap:"100px"}}>
        <RewardsIndex rewardsData={rewards} onEdit={handleRewardEdit} currentParent={currentParent} currentChild={currentChild}/>
        <div style={{border:"1px solid black", padding:"40px", marginTop:"16px", boxShadow:"2px 2px 2px gray", height:"fit-content", backgroundColor:"white"}}>
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
        {currentChild.username ?
        <div>
          <p style={{fontWeight:"bold"}}>Waiting for Parent Approval</p>
          <hr />
          {usedRewards.length > 0?
            usedRewards.map(usedReward => (
              <div key={usedReward.id} style={{display:"flex", justifyContent:"space-between", gap:"12px", margin:"6px 0"}}>
                <div>{usedReward.reward.title}</div>
                <div>({usedReward.reward.points_cost} points)</div>
              </div>
            ))
            :null
          }
        </div>
        :
        null
        }
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