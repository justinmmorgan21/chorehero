import axios from "axios";
import { useEffect, useState } from "react";
import apiConfig from "../apiConfig";

export function ChildrenIndex({ children_data: initialChildrenData, onChildChoresModify, onChildChoresHistoryView, used_rewards: initialRewardData }) {
  const [childrenData, setChildrenData] = useState(initialChildrenData);
  const [usedRewards, setUsedRewards] = useState(initialRewardData);
  useEffect(() => setChildrenData(initialChildrenData), [initialChildrenData]);
  useEffect(() => {
    setUsedRewards(initialRewardData)},
  [initialRewardData]);

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
    childrenData.forEach( child => {
      initialBonusPoints[child.id] = 0;
    });
    setBonusPoints(initialBonusPoints);
  }, []);
  
  useEffect(() => {
    const initialChoreStates = {};
    const initialDayStates = {};
    const initialDoneWeekly = {};
    childrenData.forEach( child => {
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
  }, [childrenData]);

  const handleCheckboxChange = (childId, day, choreId, isChecked) => {
    const params = new FormData();
    const child = childrenData.find(child => child.id === childId);
    const chore = child.chores.find(chore => chore.id == choreId);
    {chore.one_timer ? 
    (
      days.map( day => {
        if (chore[day.split("_")[0]]) {
          params.append(`done_${day.slice(0,3)}`, isChecked)
        }
      })
    ) 
      : 
    (
      params.append(`done_${day.slice(0,3)}`, isChecked)
    )
    }
    axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${childId}/${choreId}.json`, params).then(() => {
      axios.get(`${apiConfig.backendBaseUrl}/children.json`).then((response) => {
        setChildrenData(response.data);
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
    axios.patch(`${apiConfig.backendBaseUrl}/children/${child.id}.json`, params).then((response) => {
      setChildrenData((prevChildrenData) =>
        prevChildrenData.map((childData) =>
          childData.id === child.id ? response.data : childData
        )
      );
    });
  };

  const clearFields = (child) => {
    child.chores.forEach( (chore, i) => {
      const params = new FormData();
      days.forEach( (day) => {
        params.append(`done_${day.slice(0,3)}`, false);
      })
      axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${child.id}/${chore.id}.json`, params).then( () => {
        if (i == child.chores.length - 1) {
          axios.get(`${apiConfig.backendBaseUrl}/children.json`).then((response) => {
            setChildrenData(response.data);
          });
        }
      })
    })
  }
  
  return (
    <div>
      {childrenData.map( child => (
      <div key={child.id} className="card">
        <div className="child-info">
          <h2>{child.name}</h2>
          <p>username: {child.username}</p>
          <p>age: {child.age}</p>
          <p>points: {child.points_available}</p>
          <p>money banked: ${child.money_banked}</p>
          <button style={{padding:'3px 2px'}} onClick={()=>onChildChoresModify(child)}>Edit {child.name}{child.name.slice(-1) === "s" ? `'` : `'s`} Chores</button>
          <button style={{padding:'3px 2px'}} onClick={()=>onChildChoresHistoryView(child)}>View {child.name}{child.name.slice(-1) === "s" ? `'` : `'s`} Chore History</button>
        </div>
        <br />
        <div style={{ display:"flex", flexDirection:"row", boxShadow:'2px 2px 2px gray' }}>
          {days.map( day => (
          <div key={day} id="day" style={{ display:'flex', flexDirection:'column', alignItems:'center', border:`${day === days[new Date().getDay() - (new Date().getDay() === 0 ? -6 : 1)] ? 'solid 3px red':'solid 1px black'}`}}>
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
          <div id="day">
            <h3 style={{marginBottom: '12px'}}>Finished Chores</h3>
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
              <button style={{alignSelf:'end'}} onClick={() => {addPoints(child); clearFields(child);}}>Approve</button>
            </div>
          </div>
          <br />
        </div>
        <div className="card" style={{padding:'32px 64px 12px 64px'}}>
          <div style={{display:"flex", width:"50%", marginBottom:'8px', justifyContent:"space-between"}}>
            <p style={{fontWeight:"bold", marginRight:"48px"}}>Rewards</p>
            <p>Points Available: {child.points_available}</p>
            <p>Money Banked: ${child.money_banked}</p>
          </div>
          <hr />
          <div style={{display:"flex", justifyContent:'space-between', width:"50%", margin:"16px 0"}}>
            <div>
            {usedRewards.length > 0 ?
            usedRewards.filter(usedReward => usedReward.child_id === child.id).map(usedReward => (
                <div key={usedReward.id} style={{display:"flex", width:"100%", justifyContent:"space-between", border:"1px solid black", padding:"12px", marginBottom:"6px", borderRadius:"5px"}}>
                  <div>
                    {usedReward.reward.title} 
                    ({usedReward.reward.points_cost})
                  </div>
                  <button>Approve</button>
                </div>
              ))
              :null
            }
            </div>
            <div style={{display:'flex', height:"fit-content"}}>
              <span >Use Money</span>
              <input type="text" size="4" style={{margin:"0px 12px 0px 4px"}} defaultValue={"$"}/>
              <button>Confirm</button>
            </div>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}