import axios from "axios";
import { useNavigate } from "react-router-dom";


export function ChildChoresListModify( { child, onClose, onUpdate } ) {

  const navigate = useNavigate();

  const handleRemove = (choreId) => {
    const params = new FormData();
    params.append("active", false);
    params.append("date_inactivated", new Date());
    axios.patch(`http://localhost:3000/child_chores/${child.id}/${choreId}.json`, params).then( () => {
      onClose();
      navigate(`/children`);
    })
  }

  return (
    <div>
      <h1>Active Chores - {child.name}</h1>
      <br />
      {child.active_chores.map( chore => (
        <div key={chore.id} >
          <div style={{ display:'flex', flexDirection:'row', gap:'6px'}}>
          <button onClick={() => {onUpdate(child, chore); onClose();}}>Edit</button>
          <button onClick={() => handleRemove(chore.id)}>Remove</button>
          {chore.title}
          </div>
          <br />
        </div>
      ))}
    </div>
  );
}