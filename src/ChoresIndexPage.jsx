import { useLoaderData } from "react-router-dom";
import { ChoresIndex } from "./components/ChoresIndex";

export function ChoresIndexPage() {
  const chores = useLoaderData();

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
        <ChildrenCreate onCreate={handleCreate} onClose={handleCreateClose}/>
      </Modal>
    </div>
  );
}