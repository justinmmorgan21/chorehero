import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react"
import axios from "axios";
import { ChildrenIndex } from "./components/ChildrenIndex";
import { Modal } from "./components/Modal";
import { ChildrenCreate } from "./components/ChildrenCreate";

export function ChildrenIndexPage() {
  const children_results = useLoaderData();
  const navigate = useNavigate();

  const handleShow = (child) => {
    console.log("handleShow", child);
    navigate(`/children/${child.id}`);
  };

  const [modalVisible, setModalVisible] = useState(false);
  // const [currentProduct, setCurrentProduct] = useState({});

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

  const handleClose = () => {
    console.log("Close");
    setModalVisible(false);
  }


  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1>All children</h1>
        <div>
          <button onClick={()=>setModalVisible(true)} style={{ fontSize:'1.2em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add child</button>
        </div>
      </div>
      <ChildrenIndex children_results={children_results} onShow={handleShow} />
      <button onClick={()=>setModalVisible(true)} style={{ fontSize:'1.2em', padding:'4px 8px', borderRadius:'4px', boxShadow:'1px 1px'}}>+ add child</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <ChildrenCreate onCreate={handleCreate} />
      </Modal>
    </div>
  );
}