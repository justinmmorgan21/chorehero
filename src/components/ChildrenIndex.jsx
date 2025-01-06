import axios from "axios";
import { useEffect, useState } from "react";

export function ChildrenIndex( { children_results }) {

  // console.log("children_results: ", children_results);

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
  const [bonusPoints, setBonusPoints] = useState([])
  const [doneWeekly, setDoneWeekly] = useState([]);
  
  useEffect(() => {
    const initialChoreStates = {};
    const initialDayStates = {};
    const initialBonusPoints = {};
    const initialDoneWeekly = {};
    children_results.forEach( child => {
      initialChoreStates[child.id] = {};
      initialDayStates[child.id] = {};
      initialBonusPoints[child.id] = 0;
      initialDoneWeekly[child.id] = {};
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
      initialDoneWeekly[child.id] = child.chores_done_weekly;
    })
    setChoreStates(initialChoreStates);
    setDayStates(initialDayStates);
    setBonusPoints(initialBonusPoints);
    setDoneWeekly(initialDoneWeekly);
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
      axios.patch(`http://localhost:3000/child_chores/${childId}/${choreId}.json`, params).then(() => {
        axios.get( `http://localhost:3000/children/${childId}.json`).then(response => {
          setDoneWeekly((prevDoneWeekly) => ({
            ...prevDoneWeekly,
            [childId]: response.data.chores_done_weekly
          }))
        })
      });

      return updatedChoreStates;
    });
  };

  const totalPoints = chores => {
    return chores ? chores.reduce((acc, chore) => acc + chore.points_awarded, 0) : 0;
  }

  const handleChange = (childId, bonusPoints) => {
    setBonusPoints((prevBonusPoints) => ({
      ...prevBonusPoints,
      [childId]: bonusPoints || 0
    }))
  }
  
  return (
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
        <div style={{ display:"flex", flexDirection:"row", boxShadow:'2px 2px 2px gray' }}>
          {days.map( day => (
          <div key={day} style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h4 style={{ textAlign:'center' }}>{day.split("_")[0].slice(0,1).toUpperCase() + day.split("_")[0].slice(1)}</h4>
            <div>
              {child[day].map( chore => (
              <div key={chore.id} >
                <input type="checkbox"  checked={choreStates[child.id]?.[day]?.[chore.id] || false} onChange={e => handleCheckboxChange(child.id, day, chore.id, e.target.checked)}/> {chore.title}{chore.one_timer ? "*" : ""}
              </div>
              ))}
            </div>
            <p style={{ color: 'green', fontWeight:'bold', marginTop:'12px'}}>{child[day].length > 0 ? (dayStates[child.id]?.[day] ? "COMPLETED" : "") : ""}</p>
          </div>
          ))}
          <div>
            <h3 style={{marginBottom: '12px'}}>Weekly Chores</h3>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:'6px', textDecoration: 'underline'}}>
                <div>Chore</div>
                <div>Points</div>
              </div>
              {doneWeekly[child.id]?.map(chore => (
              <div key={chore.id} style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:'6px'}}>
                <div>{chore.title}</div>
                <div>{chore.points_awarded}</div>
              </div>
              ))}
              <hr />
              <p style={{ textAlign:'right', fontWeight:'bold', marginBottom:'6px'}}>{totalPoints(doneWeekly[child.id])}</p>
              <div style={{ display:'flex', flexDirection:'row-reverse', marginBottom:'12px' }}>
                <input type="text" size="3" onChange={e=>handleChange(child.id, e.target.value)} style={{ textAlign:'right' }}/><p style={{ marginRight:'8px' }}>bonus points</p>
              </div>
              <div style={{ display:'flex', flexDirection:'row-reverse', marginBottom:'12px' }}>
                <p style={{  }}>total points: {parseInt(totalPoints(doneWeekly[child.id])) + parseInt(bonusPoints[child.id])}</p>
              </div>
              <button style={{alignSelf:'end'}}>Approve</button>
            </div>
          </div>
          <br />
        </div>
      </div>
      ))}
    </div>
  );
}