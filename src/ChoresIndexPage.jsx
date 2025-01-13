import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChoresIndex } from "./components/ChoresIndex";
import { ChoreCreate } from "./components/ChoreCreate";
import { Modal } from "./components/Modal";
import { ChoreEdit } from "./components/ChoreEdit";
import apiConfig from "./apiConfig";

export function ChoresIndexPage() {
  const chores = useLoaderData();

  const [currentChore, setCurrentChore] = useState(null);

  const [currentParent, setCurrentParent] = useState({});
  const getParent = () => {
    axios.get(`${apiConfig.backendBaseUrl}/parents/current.json`).then(response => {
      setCurrentParent(response.data);
    })
  }
  useEffect(getParent, []);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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
        <h1 style={{color:"white", width:"100%", textAlign:"center"}}>Chores</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ width:"110px", fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add chore</button>
        </div>
      </div>
      <ChoresIndex chores={chores} onEdit={handleChoreEdit} />
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <ChoreCreate onClose={handleCreateClose} currentParent={currentParent}/>
      </Modal>
      <Modal onClose={handleEditClose} show={editModalVisible}>
        <ChoreEdit onClose={handleEditClose} currentParent={currentParent} chore={currentChore}/>
      </Modal>
    </div>
  );
}