import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react"
import axios from "axios";
import { ChildrenIndex } from "./components/ChildrenIndex";
import { Modal } from "./components/Modal";
import { ChildrenCreate } from "./components/ChildrenCreate";
import { ChildChoresListModify } from "./components/ChildChoresListModify";
import { ChildChoresHistory } from "./components/ChildChoresHistory";
import { ChildChoreUpdate } from "./components/ChildChoreUpdate";

export function ChildrenIndexPage() {
  const childrenData = useLoaderData();

  const navigate = useNavigate();

  const handleShow = (child) => {
    console.log("handleShow", child);
    navigate(`/children/${child.id}`);
  };

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [modifyListModalVisible, setModifyModalListVisible] = useState(false);
  const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  const [choreEditModalVisible, setChoreEditModalVisible] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);
  const [currentChore, setCurrentChore] = useState(null);

  const handleCreate = (params, successCallback) => {
    axios.post("http://localhost:3000/children.json", params).then(
      response => console.log(response.data)
      // setProducts([...products, response.data])
    )
    successCallback();

  }

  // const handleUpdate = (params, id, successCallback) => {

  //   axios.patch(`http://localhost:3000/products/${id}.json`, params).then(
  //     response => setProducts(products.map(product => product.id === id ? response.data : product))
  //   )
  //   successCallback();
  //   handleClose();
  // }

  // const handleDestroy = (id) => {
  //   console.log("destroy: " + id);
  //   axios.delete(`http://localhost:3000/products/${id}.json`).then( 
  //     response => setProducts(products.filter(product => product.id !== id))
  //   )
  // }

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


  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All children</h1>
        <div>
        <button onClick={()=>setCreateModalVisible(true)} style={{ fontSize:'1em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add child</button>
        </div>
      </div>
      <ChildrenIndex children_data={childrenData} onShow={handleShow} onChildChoresModify={handleChildChoresModify} onChildChoresHistoryView={handleChildChoresHistoryView}/>
      <Modal onClose={handleCreateClose} show={createModalVisible}>
        <ChildrenCreate onCreate={handleCreate} onClose={handleCreateClose}/>
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
    </div>
  );
}