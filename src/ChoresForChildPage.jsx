import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./components/Modal";
import { ChildChoresHistory } from "./components/ChildChoresHistory";
import apiConfig from "./apiConfig";

export function ChoresForChildPage() {
  const [child, setChild] = useState(useLoaderData());
  console.log("child: ", child);

  const [choreHistoryModalVisible, setChoreHistoryModalVisible] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);
  // const [currentChore, setCurrentChore] = useState(null);


  const handleChoresViewClose = () => {
    setChoreHistoryModalVisible(false);
  }

  const handleChildChoresHistoryView = (child) => {
    setCurrentChild(child);
    setChoreHistoryModalVisible(true);
  }




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
  const [bonusPoints, setBonusPoints] = useState(0);
  const [doneWeekly, setDoneWeekly] = useState([]);
  
  useEffect(() => {
    const initialChoreStates = {};
    const initialDayStates = {};
    days.forEach( day => {
      let allChoresDone = true;
      if (child[day]) {
        initialChoreStates[day] = {};
        child[day].forEach( chore => {
          const matching_child_chore = child.child_chores.find( child_chore =>
            child_chore.chore_id === chore.id
          );
          const choreDone = matching_child_chore[`done_${day.slice(0,3)}`];
          initialChoreStates[day][chore.id] = choreDone;
          if (!choreDone) {
            allChoresDone = false;
          }
        });
      }
      initialDayStates[day] = allChoresDone;
    });
    setChoreStates(initialChoreStates);
    setDayStates(initialDayStates);
    setDoneWeekly(child.chores_done_weekly);
  }, [child]);

  const handleCheckboxChange = (day, choreId, isChecked) => {
    const params = new FormData();
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
    axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${child.id}/${choreId}.json`, params).then((response) => {
      // axios.get(`${apiConfig.backendBaseUrl}/children/.json`).then((response) => {
        
        console.log(response.data);
        // setChild(response.data);

      // });
    });
  };

  const chorePoints = () => {
    return doneWeekly ? doneWeekly.reduce((acc, chore) => acc + chore.points_awarded, 0) : 0;
  };

  const totalPoints = () => {
    return parseInt(chorePoints()) + parseInt(bonusPoints);
  };

  const addPoints = () => {
    const params = new FormData();
    params.append("points_available", child.points_available + totalPoints(child));
    axios.patch(`${apiConfig.backendBaseUrl}/children/${child.id}.json`, params).then((response) => {
      setChild(response.data);
    });
  };

  const clearFields = () => {
    child.chores.forEach( (chore, i) => {
      const params = new FormData();
      days.forEach( (day) => {
        params.append(`done_${day.slice(0,3)}`, false);
      })
      axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${child.id}/${chore.id}.json`, params).then( (response) => {
        if (i == child.chores.length - 1) {
          // axios.get(`${apiConfig.backendBaseUrl}/children.json`).then((response) => {
            setChild(response.data);
          // });
        }
      })
    })
  }

  return (
    <div>
      <div style={{ display:'flex', flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
        <h1 style={{color:"white", width:"100%", textAlign:"center"}}>{child.name}</h1>
      </div>

      <div className="card">
        <div className="child-info">
          <h2>{child.name}</h2>
          <p>username: {child.username}</p>
          <p>age: {child.age}</p>
          <p>points: {child.points_available}</p>
          <p>money banked: ${child.money_banked}</p>
          <button style={{padding:'3px 2px'}} onClick={()=>handleChildChoresHistoryView(child)}>View {child.name}{child.name.slice(-1) === "s" ? `'` : `'s`} Chore History</button>
        </div>
        <br />
        <div style={{ display:"flex", flexDirection:"row", boxShadow:'2px 2px 2px gray' }}>
          {days.map( day => (
          <div key={day} id="day" style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
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
                <input type="text" size="3" onChange={e=>setBonusPoints(e.target.value)} style={{ textAlign:'right' }}/><p style={{ marginRight:'8px' }}>bonus points</p>
              </div>
              <div style={{ display:'flex', flexDirection:'row-reverse', marginBottom:'12px' }}>
                <p style={{  }}>total points: {totalPoints(child)}</p>
              </div>
              <button style={{alignSelf:'end'}} onClick={() => {addPoints(child); clearFields(child);}}>Approve</button>
            </div>
          </div>
          <br />
        </div>
        <div>
          {/* REWARDS */}
        </div>
      </div>


      <Modal onClose={handleChoresViewClose} show={choreHistoryModalVisible}>
        <ChildChoresHistory child={currentChild} onClose={handleChoresViewClose}/>
      </Modal>
    </div>
  );
}