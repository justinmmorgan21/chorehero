import { FaCheck } from "react-icons/fa";

export function ChoresIndex( { chores } ) {
  console.log("chores: ", chores);

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
            <h3 style={{marginBottom:"8px"}}>{chore.title}</h3>
            <p>description: {chore.description || "-"}</p>
            <div style={{display:"flex", flexDirection:"row", margin:"8px 2px 8px 8px"}}>
              {days.map( day => (
                (chore[day] ? 
                  <div key={day} style={{display:"flex", flexDirection:"row", marginRight:"12px"}}>
                    <FaCheck style={{marginRight:"3px"}}/><div>{day}</div>
                    {/* <input type="checkbox" checked={chore[day]} style={{margin:"8px 2px 8px 8px"}}/>{day} */}
                  </div>
                  : null
                )
              ))}
            </div>
            <div>points: {chore.points_awarded}</div>
            <br />
            <button>Edit Chore</button>
          </div>
        ))}
      </div>
    </div>
  );
}