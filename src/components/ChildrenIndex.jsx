import axios from "axios";
import { useEffect, useState } from "react";

export function ChildrenIndex({ children_results: initialChildrenResults }) {

  const [childrenResults, setChildrenResults] = useState(initialChildrenResults);

  useEffect(() => setChildrenResults(initialChildrenResults), [initialChildrenResults]);

  const days = [
    "monday_chores",
    "tuesday_chores",
    "wednesday_chores",
    "thursday_chores",
    "friday_chores",
    "saturday_chores",
    "sunday_chores",
  ];
  
  const [choreStates, setChoreStates] = useState([]);
  const [dayStates, setDayStates] = useState([]);
  const [bonusPoints, setBonusPoints] = useState([]);
  const [doneWeekly, setDoneWeekly] = useState([]);

  useEffect(() => {
    const initialBonusPoints = {};
    childrenResults.forEach( child => {
      initialBonusPoints[child.id] = 0;
    });
    setBonusPoints(initialBonusPoints);
  }, []);
  
  useEffect(() => {
    const initialChoreStates = {};
    const initialDayStates = {};
    const initialDoneWeekly = {};
    childrenResults.forEach( child => {
      initialChoreStates[child.id] = {};
      initialDayStates[child.id] = {};
      initialDoneWeekly[child.id] = {};
      days.forEach( day => {
        let allChoresDone = true;
        if (child[day]) {
          initialChoreStates[child.id][day] = {};
          child[day].forEach( chore => {
            const matching_child_chore = child.child_chores.find( child_chore =>
              child_chore.chore_id === chore.id
            );
            const choreDone = matching_child_chore[`done_${day.slice(0,3)}`];
            initialChoreStates[child.id][day][chore.id] = choreDone;
            if (!choreDone) {
              allChoresDone = false;
            }
          });
        }
        initialDayStates[child.id][day] = allChoresDone;
      });
      initialDoneWeekly[child.id] = child.chores_done_weekly;
    });
    setChoreStates(initialChoreStates);
    setDayStates(initialDayStates);
    setDoneWeekly(initialDoneWeekly);
  }, [childrenResults]);

  const handleCheckboxChange = (childId, day, choreId, isChecked) => {
    const params = new FormData();
    params.append(`done_${day.slice(0,3)}`, isChecked);
    axios.patch(`http://localhost:3000/child_chores/${childId}/${choreId}.json`, params).then(() => {
      axios.get("http://localhost:3000/children.json").then((response) => {
        setChildrenResults(response.data);
      });
    });
  };

  const chorePoints = (child) => {
    return doneWeekly[child?.id] ? doneWeekly[child.id].reduce((acc, chore) => acc + chore.points_awarded, 0) : 0;
  };

  const totalPoints = (child) => {
    return parseInt(chorePoints(child)) + parseInt(bonusPoints[child.id]);
  };

  const handleChange = (childId, bonusPoints) => {
    setBonusPoints((prevBonusPoints) => ({
      ...prevBonusPoints,
      [childId]: bonusPoints || 0
    }));
  };

  const addPoints = (child) => {
    const params = new FormData();
    params.append("points_available", child.points_available + totalPoints(child));
    axios.patch(`http://localhost:3000/children/${child.id}.json`, params).then((response) => {
      setChildrenResults((prevChildrenResults) => ({
        ...prevChildrenResults,
        [child.id]: response.data
      }));
    });
  };
  
  return (
    <div>
      {childrenResults.map( child => (
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
              <p style={{ textAlign:'right', fontWeight:'bold', marginBottom:'6px'}}>{chorePoints(child)}</p>
              <div style={{ display:'flex', flexDirection:'row-reverse', marginBottom:'12px' }}>
                <input type="text" size="3" onChange={e=>handleChange(child.id, e.target.value)} style={{ textAlign:'right' }}/><p style={{ marginRight:'8px' }}>bonus points</p>
              </div>
              <div style={{ display:'flex', flexDirection:'row-reverse', marginBottom:'12px' }}>
                <p style={{  }}>total points: {totalPoints(child)}</p>
              </div>
              <button style={{alignSelf:'end'}} onClick={() => addPoints(child)}>Approve</button>
            </div>
          </div>
          <br />
        </div>
      </div>
      ))}
    </div>
  );
}