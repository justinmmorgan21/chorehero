import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ChildChoresHistory( { child, onClose } ) {

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const formatDate = (child, chore, activated) => {
    const date = activated ? new Date(child.child_chores.find(child_chore => (child_chore.chore_id === chore.id)).date_activated) :
      new Date(child.child_chores.find(child_chore => (child_chore.chore_id === chore.id)).date_inactivated);
    const dateString = date.toISOString().split("T")[0];
    return `${dateString.slice(5,7)}/${dateString.slice(8,10)}/${dateString.slice(0,4)}`;
  }

  const navigate = useNavigate();

  const handleReactivate = (choreId) => {
    const params = new FormData();
    params.append("active", true);
    params.append("date_activated", new Date());
    axios.patch(`http://localhost:3000/child_chores/${child.id}/${choreId}.json`, params).then( () => {
      onClose();
      navigate(`/children`);
    })
  }

  return (
    <div>
      <h1>Chore History - {child.name}</h1>
      <br />
      <h3 style={{ marginBottom: '8px'}}>Current</h3>
      <ul>

      {child.active_chores.map( chore => (
        <li key={chore.id} >
          <div style={{ display:'flex', flexDirection:'row', gap:'6px'}}>
            <div style={{fontWeight:'bold'}}> {chore.title} </div> ,
            {days.map( day => ( 
              chore[`${day}`] ?
              (<div key={day}>&lt;{day}&gt;</div>) : (null)
            ))} ,
            <div> points: {chore.points_awarded} , </div>
            <div>{formatDate(child, chore, true)} - </div>
          </div>
          <br />
        </li>
      ))}
      </ul>
      <hr />
      <br />
      <h3 style={{ marginBottom: '8px'}}>Previous</h3>
      {child.inactive_chores.map( chore => (
        <div key={chore.id} >
          <div style={{ display:'flex', flexDirection:'row', gap:'6px'}}>
            <button >Edit</button>
            <button onClick={() => handleReactivate(chore.id)}>Reactivate</button>
            <div style={{fontWeight:'bold', marginLeft:'6px'}}> {chore.title} </div> ,
            {days.map( day => ( 
              chore[`${day}`] ?
              (<div key={day}>&lt;{day}&gt;</div>) : (null)
              ))} ,
            <div> points: {chore.points_awarded} , </div>
            <div>{formatDate(child, chore, true)} - {formatDate(child, chore, false)}</div>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
}