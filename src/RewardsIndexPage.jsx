import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { RewardCreate } from "./components/RewardCreate";
import { Modal } from "./components/Modal";
import { RewardsIndex } from "./components/RewardsIndex";

export function RewardsIndexPage() {
  const rewards = useLoaderData();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  // const [editModalVisible, setEditModalVisible] = useState(false);

  // const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  // const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  // const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  // const [currentChild, setCurrentChild] = useState(null);
  // const [currentChore, setCurrentChore] = useState(null);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }
  // const handleEditClose = () => {
  //   setEditModalVisible(false);
  // }

  const handleRewardEdit = (reward) => {
    // setEditModalVisible(true);
    // setCurrentChore(chore);
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All rewards</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add reward</button>
        </div>
      </div>
      <RewardsIndex rewards={rewards} onEdit={handleRewardEdit} />
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <RewardCreate onClose={handleCreateClose} />
      </Modal>
      {/* <Modal onClose={handleEditClose} show={editModalVisible}>
        <ChoreEdit onClose={handleEditClose} currentParent={currentParent} chore={currentChore}/>
      </Modal> */}
    </div>
  );
}