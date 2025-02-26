import { useLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RewardCreate } from "./components/RewardCreate";
import { Modal } from "./components/Modal";
import { RewardsIndex } from "./components/RewardsIndex";
import { RewardUpdate } from "./components/RewardUpdate";
import axios from "axios";
import apiConfig from "./apiConfig";
import { ChildRewardsHistory } from "./components/ChildRewardsHistory";

export function RewardsIndexPage() {
  const rewards = useLoaderData();
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
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
      setUsedRewards(response.data);
    })
  }
  useEffect(getUsedRewards, [currentChild]);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }
  const handleEditClose = () => {
    setEditModalVisible(false);
  }
  const handleRequestClose = () => {
    setRequestModalVisible(false);
  }

  const handleRewardEdit = (reward) => {
    setEditModalVisible(true);
    setCurrentReward(reward);
  }

  const handleRedeem = (reward) => {
    const totalPointsPending = usedRewards.filter(usedReward=>!usedReward.date_approved).reduce((acc, usedReward) => acc + usedReward.reward.points_cost, 0);
    if (currentChild.points_available - totalPointsPending < reward.points_cost) {
      window.alert(`You do not have enough points to redeem ${reward.title}`);
    } else {
      const params = new FormData();
      params.append("child_id", currentChild.id);
      params.append("reward_id", reward.id);
      axios.post(`${apiConfig.backendBaseUrl}/used_rewards.json`, params).then((response) => {
        window.alert(`${reward.title} redeemed... awaiting Parent Approval`);
        setUsedRewards([...usedRewards, response.data]);
      })
    }
  }

  const handleParentCreate = (params) => {
    params.append("active", true);
    params.append("kid_requested", false);
    axios.post(`${apiConfig.backendBaseUrl}/rewards.json`, params).then(() => {
      handleCreateClose();
      navigate('/rewards');
    })
  }

  const handleChildRequest = (params) => {
    params.append("active", false);
    params.append("kid_requested", true);
    axios.post(`${apiConfig.backendBaseUrl}/rewards.json`, params).then((response) => {
      params.append("child_id", currentChild.id);
      params.append("reward_id", response.data.id);
      axios.post(`${apiConfig.backendBaseUrl}/used_rewards.json`, params).then((response) => {
        // also send email to parent announcing request
        handleRequestClose();
        setUsedRewards([...usedRewards, response.data]);
      })
    })
  }

  const handleRewardRedeemDelete = (usedReward) => {
    axios.delete(`${apiConfig.backendBaseUrl}/used_rewards/${usedReward.id}.json`).then((response) => {
      setUsedRewards(response.data);
    })
  }

  const handleRequestApproval = (reward) => {
    const params = new FormData();
    params.append("active", true);
    params.append("kid_requested", false);
    axios.patch(`${apiConfig.backendBaseUrl}/rewards/${reward.id}.json`, params).then((response) => {
      setUsedRewards((usedRewards) =>
        usedRewards.map((usedReward) =>
          reward.id === usedReward.reward.id ? {...usedReward, reward: response.data} : usedReward
        )
      );
    })
  }

  const handleRequestDeny = (usedReward) => {
    axios.delete(`${apiConfig.backendBaseUrl}/rewards/${usedReward.reward.id}.json`).then(()=>{
      axios.delete(`${apiConfig.backendBaseUrl}/used_rewards/${usedReward.id}.json`).then((response)=>{
        setUsedRewards(response.data);
      });
    })

    // also send email to child announcing denial
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
            <button onClick={()=>setRequestModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ request new custom reward</button>
          </div>
        }
      </div>
      <div style={{display:"flex", flexDirection:"row", gap:"100px"}}>
        <RewardsIndex rewardsData={rewards} onEdit={handleRewardEdit} currentParent={currentParent} onRedeem={handleRedeem}/>
        <div style={{border:"1px solid black", padding:"40px", marginTop:"16px", boxShadow:"2px 2px 2px gray", height:"fit-content", backgroundColor:"white"}}>
          <div>
            <h2>Reward-Points Chart:</h2>
            <br />
            {Object.keys(rewards.reward_groups).map(score => (
              <div key={score}>
                {rewards.reward_groups[score].filter(reward=>reward.active).length > 0 ?
                <div>
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
                :
                null
                }
              </div>
            ))}
          </div>
        </div>
        {currentChild.username ?
        <div>
          <p style={{fontWeight:"bold"}}>Waiting for Parent Approval</p>
          <hr style={{width:"75%"}}/>
          {usedRewards.length > 0 ?
          usedRewards.filter(usedReward => usedReward.date_approved === null && !usedReward.reward.kid_requested).map(usedReward => (
            <div key={usedReward.id} style={{display:"flex", justifyContent:"space-between", gap:"12px", margin:"6px 0", width:"75%"}}>
              <div>{usedReward.reward.title}</div>
              <div style={{display:"flex"}}>
                <div>({usedReward.reward.points_cost} points)</div>
                <button style={{backgroundColor:"#F0CD0D", padding:"1px 2px", marginLeft:"4px", border:"1px solid gray"}} onClick={()=>handleRewardRedeemDelete(usedReward)}>X</button>
              </div>
            </div>
          )):null
          }
          {usedRewards.length > 0 ? 
          usedRewards.filter(usedReward => usedReward.reward.kid_requested === true && usedReward.child_id === currentChild.id).map(usedReward => (
            <p key={usedReward.id} style={{margin:"3px 2px 2px 0"}}>
              {usedReward.reward.title} / {usedReward.reward.points_cost} points (custom request pending)
            </p>
          )):null
          }
          <br />
          <br />
          <br />
          <ChildRewardsHistory child={currentChild}/>
        </div>
        :
        <div>
        <h3 style={{margin:"24px 0 16px 0"}}>Custom Reward Requests</h3>
        <hr />
        <ul>
          {usedRewards.length > 0 ?
            usedRewards.filter(usedReward => !usedReward.reward.active && usedReward.reward.kid_requested).map(usedReward => (
              <li key={usedReward.id} style={{margin:"6px 0"}}>
                {usedReward.reward.title} / {usedReward.reward.points_cost} points
                <button style={{padding:"3px 6px", marginLeft:"8px"}} onClick={()=>handleRequestApproval(usedReward.reward)}>Add to Reward List</button>
                <button style={{padding:"3px 6px", marginLeft:"8px"}} onClick={()=>handleRequestDeny(usedReward)}>Deny</button>
              </li>
            ))
            :
            null
          }
        </ul>
        </div>
        }
      </div>
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <RewardCreate onClose={handleCreateClose} onCreate={handleParentCreate}/>
      </Modal>
      <Modal onClose={handleEditClose} show={editModalVisible}>
        <RewardUpdate onClose={handleEditClose} reward={currentReward}/>
      </Modal>
      <Modal onClose={handleRequestClose} show={requestModalVisible}>
        <RewardCreate onClose={handleRequestClose} onCreate={handleChildRequest}/>
      </Modal>
    </div>
  );
}