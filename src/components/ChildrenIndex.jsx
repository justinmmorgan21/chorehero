import axios from "axios";
import { useEffect, useState } from "react";

export function ChildrenIndex( { children_results }) {

  const days = [
    "monday_chores",
    "tuesday_chores",
    "wednesday_chores",
    "thursday_chores",
    "friday_chores",
    "saturday_chores",
    "sunday_chores",
  ]
  
  const [choreStates, setChoreStates] = useState([]);
  const [dayStates, setDayStates] = useState([]);
  
  useEffect(() => {
    const initialChoreStates = {};
    const initialDayStates = {};
    children_results.forEach( child => {
      initialChoreStates[child.id] = {};
      initialDayStates[child.id] = {};
      days.forEach( day => {
        let allChoresDone = true;
        if (child[day]) {
          initialChoreStates[child.id][day] = {};
          child[day].forEach( chore => {
            const matching_child_chore = child.child_chores.find( child_chore =>
              child_chore.chore_id === chore.id
            )
            const choreDone = matching_child_chore[`done_${day.slice(0,3)}`];
            initialChoreStates[child.id][day][chore.id] = choreDone;
            if (!choreDone) {
              allChoresDone = false;
            }
          })
        }
        initialDayStates[child.id][day] = allChoresDone;
      })
    })
    setChoreStates(initialChoreStates);
    setDayStates(initialDayStates);
  }, [children_results]);

  const handleCheckboxChange = (childId, day, choreId, isChecked) => {
    const daysToUpdate = [day];
    setChoreStates((prevChoreStates) => {
      const updatedChoreStates = {
        ...prevChoreStates,
        [childId]: {
          ...prevChoreStates[childId],
          [day]: {
            ...prevChoreStates[childId][day],
            [choreId]: isChecked,
          },
        },
      }

      const child = children_results.find(child => child.id === childId);
      if (child[day].find(chore => chore.id === choreId).one_timer) {
        days.forEach(oneDay => {
            if (choreId in updatedChoreStates[childId][oneDay]) {
              updatedChoreStates[childId][oneDay][choreId] = isChecked;
              daysToUpdate.push(oneDay);
            }
        })
      }
    
      setDayStates((prevDayStates) => ({
        ...prevDayStates,
        [childId]: {
          ...prevDayStates[childId],
          [day]: Object.values(updatedChoreStates[childId][day]).every(value => value === true)
        }
      }));

      const params = new FormData();
      daysToUpdate.forEach(oneDay => {
        params.append(`done_${oneDay.slice(0,3)}`, isChecked)
      })
      axios.patch(`http://localhost:3000/child_chores/${childId}/${choreId}.json`, params);

      return updatedChoreStates;
    });
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
                      <input type="checkbox"  checked={choreStates[child.id]?.[day]?.[chore.id] || false} onChange={e => handleCheckboxChange(child.id, day, chore.id, e.target.checked)}/> {chore.title}{chore.one_timer ? "*" : ""}
                    </div>
                  ))}
                  <div style={{ color: 'green', margin: '12px'}}>{dayStates[child.id]?.[day] ? "COMPLETED" : ""}</div>
                </div>
              ))}
              <div>
                Weekly Chores

              </div>
              <br />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}