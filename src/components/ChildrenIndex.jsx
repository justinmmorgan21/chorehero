import axios from "axios";
import { useEffect, useState, useRef } from "react";
import apiConfig from "../apiConfig";
import { FaUserEdit } from "react-icons/fa";

export function ChildrenIndex({ children_data: initialChildrenData, onChildChoresModify, onChildChoresHistoryView, used_rewards: initialRewardData, onRewardsHistoryView, onChildEdit }) {
  const inputRefs = useRef({});

  const [childrenData, setChildrenData] = useState(initialChildrenData);
  const [usedRewards, setUsedRewards] = useState(initialRewardData);
  useEffect(() => setChildrenData(initialChildrenData), [initialChildrenData]);
  useEffect(() => setUsedRewards(initialRewardData), [initialRewardData]);

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
  const [useMoneyAmounts, setUseMoneyAmounts] = useState([]);

  useEffect(() => {
    const initialBonusPoints = {};
    const initialUseMoneyAmounts = {};
    childrenData.forEach( child => {
      initialBonusPoints[child.id] = 0;
      initialUseMoneyAmounts[child.id] = 0;
    });
    setBonusPoints(initialBonusPoints);
    setUseMoneyAmounts(initialUseMoneyAmounts);
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

  const handleBonusChange = (childId, bonusPoints) => {
    setBonusPoints((prevBonusPoints) => ({
      ...prevBonusPoints,
      [childId]: bonusPoints || 0
    }));
  };

  const handleUseMoneyChange = (childId, useMoneyAmount) => {
    setUseMoneyAmounts((prevUseMoneyAmounts) => ({
      ...prevUseMoneyAmounts,
      [childId]: useMoneyAmount.replace("$", "") || 0
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
            if (inputRefs.current[child.name])
              inputRefs.current[child.name].value = "";
            if (bonusPoints[child.id])
              bonusPoints[child.id] = 0;
          });
        }
      })
    })
  }

  const handleRewardApprove = (child, usedReward, approvingKidRequest) => {
    const params = new FormData();
    params.append("points_available", child.points_available - usedReward.reward.points_cost);
    if (usedReward.reward.title.includes("$")) { 
      const money = usedReward.reward.title.slice(1);
      params.append("money_banked", parseInt(child.money_banked) + parseInt(money));
    }
    axios.patch(`${apiConfig.backendBaseUrl}/children/${child.id}.json`, params).then((response) => {
      setChildrenData(childrenData.map(prevChild => prevChild.id === child.id ? response.data : prevChild));
      params.append("date_approved", new Date());
      axios.patch(`${apiConfig.backendBaseUrl}/used_rewards/${usedReward.id}.json`, params).then((response) => {
        setUsedRewards(usedRewards.map(prevUsedReward => prevUsedReward.id === usedReward.id ? response.data : prevUsedReward));
        if (approvingKidRequest) {
          params.append("active", true);
          params.append("kid_requested", false);
          axios.patch(`${apiConfig.backendBaseUrl}/rewards/${usedReward.reward.id}.json`, params);
        }
      })
    })
  }

  const handleUseMoneyClick = (child) => {
    if (child.money_banked < useMoneyAmounts[child.id]) {
      window.alert(`${child.name} has only $${child.money_banked} available`);
    } else {
      const params = new FormData();
      params.append("money_banked", child.money_banked - parseInt(useMoneyAmounts[child.id]));
      axios.patch(`${apiConfig.backendBaseUrl}/children/${child.id}.json`, params).then((response) => {
        setChildrenData(childrenData.map(prevChild => prevChild.id === child.id ? response.data : prevChild));
        if (inputRefs.current[child.id])
          inputRefs.current[child.id].value = "$";
      })
    }
  }

  const handleRewardDeny = (child, usedReward) => {
    axios.delete(`${apiConfig.backendBaseUrl}/rewards/${usedReward.reward.id}.json`).then(()=>{
      axios.delete(`${apiConfig.backendBaseUrl}/used_rewards/${usedReward.id}.json`).then((response)=>{
        setUsedRewards(response.data);
      });
    })

    // also send email to child announcing denial
  }
  
  // const handleChildEdit = (child) => {
  //   console.log(child.name);
  // }

  return (
    <div>
      {childrenData.map( child => (
      <div key={child.id} className="card">
        <div className="child-info">
          {/* <img src="" alt="" /> */}
          <div style={{display:"flex", alignItems:"center"}}>
          <FaUserEdit style={{border:"1px solid black", borderRadius:"50%", padding:"4px"}} onClick={()=>onChildEdit(child)}/>
          <h2>{child.name}</h2>
          </div>
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
                <input type="text" size="3" onChange={e=>handleBonusChange(child.id, e.target.value)} ref={(e)=> (inputRefs.current[child.name]) = e} style={{ textAlign:'right' }}/><p style={{ marginRight:'8px' }}>bonus points</p>
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
            <button onClick={() => onRewardsHistoryView(child)}>Rewards History</button>
          </div>
          <hr />
          <div style={{display:"flex", justifyContent:'space-between', width:"50%", margin:"16px 0"}}>
            <div>
              {usedRewards.length > 0 ?
              usedRewards.filter(usedReward => usedReward.child_id === child.id && usedReward.date_approved === null && !usedReward.reward.kid_requested).map(usedReward => (
                  <div key={usedReward.id} style={{display:"flex", width:"100%", justifyContent:"space-between", border:"1px solid black", padding:"12px", marginBottom:"6px", borderRadius:"5px"}}>
                    <div>
                      {usedReward.reward.title} {" "}
                      ({usedReward.reward.points_cost} points)
                    </div>
                    <button onClick={()=>handleRewardApprove(child, usedReward, false)}>Approve</button>
                  </div>
                ))
                :null
              }
              <br />
              {usedRewards.length > 0 && usedRewards.filter(usedReward => usedReward.child_id === child.id && usedReward.date_approved === null && usedReward.reward.kid_requested).length > 0 ?
                  <div>
                    <p>Child Requested</p>
                    {(usedRewards.filter(usedReward => usedReward.child_id === child.id && usedReward.date_approved === null && usedReward.reward.kid_requested).map(usedReward => (
                      <div key={usedReward.id} style={{display:"flex", width:"100%", justifyContent:"space-between", border:"1px solid black", padding:"12px", marginBottom:"6px", borderRadius:"5px"}}>
                        <div>
                          {usedReward.reward.title} {" "}
                          ({usedReward.reward.points_cost} points)
                        </div>
                        <button onClick={()=>handleRewardApprove(child, usedReward, true)}>Approve</button>
                        <button onClick={()=>handleRewardDeny(child, usedReward)}>Deny</button>
                      </div>
                    )))}
                  </div>
                :
                  null
              }
              
            </div>
            <div style={{display:'flex', height:"fit-content"}}>
              <span >Use Money</span>
              <input id="money-input" type="text" size="4" style={{margin:"0px 12px 0px 4px"}} defaultValue={"$"} onChange={e=>handleUseMoneyChange(child.id, e.target.value)} ref={(e)=> (inputRefs.current[child.id]) = e}/>
              <button onClick={() => handleUseMoneyClick(child)}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}