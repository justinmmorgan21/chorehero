
import { useEffect, useState } from "react";

export function ChildrenIndex( { children_results }) {
  console.log(children_results);

  const days = [
    "monday_chores",
    "tuesday_chores",
    "wednesday_chores",
    "thursday_chores",
    "friday_chores",
    "saturday_chores",
    "sunday_chores",
  ]
  
  const [choreStates, setChoreStates] = useState(false);
  
  useEffect(() => {
    const initialChoreStates = {}
    children_results.forEach( child => {
      initialChoreStates[child.id] = {};


      days.forEach( day => {
        if (child[day]) {
          initialChoreStates[child.id][day] = {};
          child[day].forEach( chore => {
            const matching_child_chore = child.child_chores.find( child_chore =>
              child_chore.chore_id === chore.id
            )
            initialChoreStates[child.id][day][chore.id] = matching_child_chore[`done_${day.slice(0,3)}`]
            console.log(initialChoreStates);
          })
        }
      })
    })

    setChoreStates(initialChoreStates);
  }, [children_results]);

  const handleCheckboxChange = (childId, day, choreId, isChecked) => {
    setChoreStates((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [day]: {
          ...prev[childId][day],
          [choreId]: isChecked,
        },
      },
    }));
  };
  
  return (
    <div>
      <h1>All children</h1>
      <div>
        {children_results.map( child => (
          <div key={child.id} className="card">
            <div className="child-info">
              <h2>{child.name}</h2>
              <p>username: {child.username}</p>
              <p>age: {child.age}</p>
              <p>points: {child.points_available}</p>
              <p>money banked: ${child.money_banked}</p>
            </div>
            <br />
            <div style={{ display:"flex", flexDirection:"row"}}>
              {days.map( day => (
                <div key={day}>
                  <h4>{day.split("_")[0].slice(0,1).toUpperCase() + day.split("_")[0].slice(1)}</h4>
                  {child[day].map( chore => (
                    <div key={chore.id}>
                      <input type="checkbox"  checked={choreStates[child.id]?.[day]?.[chore.id] || false} onChange={e => handleCheckboxChange(child.id, day, chore.id, e.target.checked)}/> {chore.title}
                    </div>
                  ))}
                </div>
              ))}
              <br />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}