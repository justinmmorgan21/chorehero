import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ChoreCreate( { onClose, currentParent } ) {
  const navigate = useNavigate();

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    
    // make new Chore
    axios.post("http://localhost:3000/chores.json", params).then((response) => {
      // make new ChildChore for each checked child
      params.forEach((value, key) => {
        if (key.slice(0,4)==="name") {
          params = new FormData();
          params.append("child_id", value);
          params.append("chore_id", response.data.id)
          axios.post(`http://localhost:3000/child_chores.json`, params);
        }
      })
      onClose();
      navigate('/chores');
    })
  }

  return (
    <div>
      <h1>New Chore</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title: </label><br />
        <input name="title" type="text" /><br />
        <br />
        <label htmlFor="description">Description: </label><br />
        <textarea name="description" id="description" rows="4"/><br />
        <br />
        {days.map( day => (
          <div key={day}>
            <input type="checkbox" name={day}/> <label htmlFor={day}>{day}</label>
          </div>
        ))}
        <br />
        <input type="checkbox" name="one_timer"/> <label htmlFor="one_timer">{"one-timer* (to be done on any of the assigned days)"}</label><br />
        <br />
        <label htmlFor="points_awarded">Points this chore earns for the week: </label>
        <input name="points_awarded" type="text" size="4"/><br />
        <br />
        <div>
          <p style={{marginBottom:"4px"}}>Select children for this chore:</p>
          <div style={{display:"flex", flexDirection:"row"}}>
          {currentParent.children.map( (child, i) => (
            <div key={child.id} style={{marginRight:"12px"}}>
              <input type="checkbox" name={`name${i}`} value={child.id}/> <label htmlFor={child}>{child.name}</label>
            </div>
          ))}
          </div>
        </div>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}