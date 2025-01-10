import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChoresIndex } from "./components/ChoresIndex";
import { ChoreCreate } from "./components/ChoreCreate";
import { Modal } from "./components/Modal";

export function ChoresIndexPage() {
  const chores = useLoaderData();

  const [currentParent, setCurrentParent] = useState({});
  const getParent = () => {
    axios.get("http://localhost:3000/parents/current.json").then(response => {
      setCurrentParent(response.data);
    })
  }
  useEffect(getParent, []);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  // const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  // const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  // const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  // const [currentChild, setCurrentChild] = useState(null);
  // const [currentChore, setCurrentChore] = useState(null);

  const handleCreateClose = () => {
    setCreateModalVisible(false);
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All chores</h1>
        <div>
          <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add chore</button>
        </div>
      </div>
      <ChoresIndex chores={chores} />
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <ChoreCreate onClose={handleCreateClose} currentParent={currentParent}/>
      </Modal>
    </div>
  );
}