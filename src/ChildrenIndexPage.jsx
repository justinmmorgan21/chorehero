import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react"
import { ChildrenIndex } from "./components/ChildrenIndex";
import { Modal } from "./components/Modal";
import { ChildrenCreate } from "./components/ChildrenCreate";
import { ChildChoresListModify } from "./components/ChildChoresListModify";
import { ChildChoresHistory } from "./components/ChildChoresHistory";
import { ChildChoreUpdate } from "./components/ChildChoreUpdate";
import axios from "axios";
import apiConfig from "./apiConfig";
import { ChildRewardsHistory } from "./components/ChildRewardsHistory";
import { ChildEdit } from "./components/ChildEdit";

export function ChildrenIndexPage() {
  const childrenData = useLoaderData();

  const [usedRewards, setUsedRewards] = useState({});
  const getUsedRewards = () => {
    axios.get(`${apiConfig.backendBaseUrl}/used_rewards.json`).then(response => {
      setUsedRewards(response.data);
    })
  }
  useEffect(getUsedRewards, []);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  const [rewardsHistoryModalVisible, setRewardsHistoryModalVisible] = useState(false);
  const [childEditModalVisible, setChildEditModalVisible] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);
  const [currentChore, setCurrentChore] = useState(null);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }
  const handleModifyClose = () => {
    setModifyModalListVisible(false);
  }
  const handleChoresViewClose = () => {
    setChoreHistoryModalVisible(false);
  }
  const handleChildChoreEditClose = () => {
    setChoreEditModalVisible(false);
  }
  const handleRewardsHistoryViewClose = () => {
    setRewardsHistoryModalVisible(false);
  }
  const handleChildEditClose = () => {
    setChildEditModalVisible(false);
  }

  const handleChildChoresModify = (child) => {
    setCurrentChild(child);
    setModifyModalListVisible(true);
  }
  const handleChildChoresHistoryView = (child) => {
    setCurrentChild(child);
    setChoreHistoryModalVisible(true);
  }
  const handleChoreUpdate = (child, chore) => {
    setChoreEditModalVisible(true);
    setCurrentChild(child);
    setCurrentChore(chore);
  }
  const handleRewardsHistoryView = (child) => {
    setCurrentChild(child);
    setRewardsHistoryModalVisible(true);
  }
  const handleChildEdit = (child) => {
    setCurrentChild(child);
    setChildEditModalVisible(true);
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1 style={{width:"100%", textAlign:"center"}}>Children</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ width:"100px", fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add child</button>
        </div>
      </div>
      <ChildrenIndex children_data={childrenData} onChildChoresModify={handleChildChoresModify} onChildChoresHistoryView={handleChildChoresHistoryView} used_rewards={usedRewards} onRewardsHistoryView={handleRewardsHistoryView} onChildEdit={handleChildEdit}/>
      <Modal onClose={handleChildEditClose} show={childEditModalVisible}>
        <ChildEdit child={currentChild} onClose={handleChildEditClose} />
      </Modal>
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <ChildrenCreate onClose={handleCreateClose}/>
      </Modal>
      <Modal onClose={handleModifyClose} show={modifyListModalVisible}>
        <ChildChoresListModify child={currentChild} onClose={handleModifyClose} onUpdate={handleChoreUpdate}/>
      </Modal>
      <Modal onClose={handleChoresViewClose} show={choreHistoryModalVisible}>
        <ChildChoresHistory child={currentChild} onClose={handleChoresViewClose}/>
      </Modal>
      <Modal onClose={handleChildChoreEditClose} show={choreEditModalVisible}>
        <ChildChoreUpdate child={currentChild} chore={currentChore} onClose={handleChildChoreEditClose}/>
      </Modal>
      <Modal onClose={handleRewardsHistoryViewClose} show={rewardsHistoryModalVisible}>
        <ChildRewardsHistory child={currentChild} />
      </Modal>
    </div>
  );
}