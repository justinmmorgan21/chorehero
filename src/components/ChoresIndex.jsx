import { FaCheck } from "react-icons/fa";

export function ChoresIndex( { chores, onEdit } ) {

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div>
      <br />
      <div className="cards">
        { chores.map( chore => (
          <div key={chore.id} className="card">
            <h2 style={{marginBottom:"8px"}}>{chore.title}</h2>
            <br />
            <p>description: {chore.description || "-"}</p>
            <br />
            <div style={{display:"flex", flexDirection:"row", margin:"8px 2px 8px 8px"}}>
              {days.map( day => (
                (chore[day] ? 
                  <div key={day} style={{display:"flex", flexDirection:"row", marginRight:"12px"}}>
                    <FaCheck style={{marginRight:"3px"}}/><div>{day}</div>
                  </div>
                  : null
                )
              ))}
            </div>
            <br />
            {chore.one_timer ?
            <div>
              <p>*one-timer (chore to be done once on any assigned day)</p>
              <br />
            </div>
              :
            null
            }
            <div>points: {chore.points_awarded}</div>
            <br />
            Assigned to:
            {chore.children.map( child => (
              <ul key={child.id}>
                { child.active_chores.find(oneChore => oneChore.id === chore.id) ? <li>{child.name}</li> : null }
              </ul>
            ))}
            <br />
            Inactive for:
            {chore.children.map( child => (
              <ul key={child.id}>
                { !child.active_chores.find(oneChore => oneChore.id === chore.id) ? <li>{child.name}</li> : null }
              </ul>
            ))}
            <br />
            <button onClick={() => onEdit(chore)}>Edit Chore</button>
          </div>
        ))}
      </div>
    </div>
  );
}