import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChoresIndex } from "./components/ChoresIndex";
import { ChoreCreate } from "./components/ChoreCreate";
import { Modal } from "./components/Modal";
import { ChoreEdit } from "./components/ChoreEdit";
import { RewardsIndex } from "./components/RewardsIndex";

export function RewardsIndexPage() {
  const rewards = useLoaderData();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  // const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  // const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  // const [currentChild, setCurrentChild] = useState(null);
  // const [currentChore, setCurrentChore] = useState(null);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }
  const handleEditClose = () => {
    setEditModalVisible(false);
  }

  const handleChoreEdit = (chore) => {
    setEditModalVisible(true);
    setCurrentChore(chore);
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All rewards</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add reward</button>
        </div>
      </div>
      <RewardsIndex rewards={rewards} onEdit={handleChoreEdit} />
      {/* <Modal onClose={handleCreateClose} show={createModalVisible}>
        <ChoreCreate onClose={handleCreateClose} currentParent={currentParent}/>
      </Modal>
      <Modal onClose={handleEditClose} show={editModalVisible}>
        <ChoreEdit onClose={handleEditClose} currentParent={currentParent} chore={currentChore}/>
      </Modal> */}
    </div>
  );
}