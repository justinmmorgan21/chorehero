import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../ApiConfig";

export function ChildChoreUpdate( { child, chore, onClose } ) {

  const [isOneTimerChecked, setIsOneTimerChecked] = useState(chore.one_timer);
  const [isDayChecked, setIsDayChecked] = useState({});
  const [isChildChecked, setIsChildChecked] = useState({});
  const [description, setDescription] = useState(chore.description);
  const [points, setPoints] = useState(chore.points_awarded);
  const [checkedChildCount, setCheckedChildCount] = useState(0);

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  
  useEffect(() => {
    const initialDayCheckedStates = {};
    days.forEach( day => {
      initialDayCheckedStates[day] = chore[day];
    });
    setIsDayChecked(initialDayCheckedStates);
    const initialChildCheckedStates = {};
    chore.children.map( oneChild => {
      if (oneChild.id !== child.id) {
        initialChildCheckedStates[oneChild.id] = false;
      }
    });
  }, []);

  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    const params = new FormData(event.target);
    days.forEach( day => {
      if (!params.has(day)) {
        params.append(day, false);
      }
    })
    if (!params.has("one_timer")) {
      params.append("one_timer", false);
    }
    params.append("title", chore.title);

    if (countOtherChildren() == 0 || countOtherChildren() == checkedChildCount) {  // if no other children sharing the chore  OR  if all selected, edit that chore
      // if current params match an existing Chore, change ChildChore of THIS Child to the other matching Chore, and delete the current Chore
      axios.get(`${apiConfig.backendBaseUrl}/chores.json`).then((response) => {
        const chores = response.data;
        let matchesAny = false;
        chores.map( oneChore => {
          let matches = true;
          if (oneChore.title != params.get("title")) matches = false;
          if (oneChore.description != params.get("description")) matches = false;
          days.forEach( day => {   
            if ((oneChore[day] != null && oneChore[day] != (params.get(day) === "on" ? true : false)) || (oneChore[day] == null && params.get(day) != "false")) {
              matches = false;
            }
          })
          if (oneChore.one_timer != params.get("one_timer") === "on" ? true : false) matches = false;        
          if (oneChore.points_awarded != params.get("points_awarded")) matches = false;
          if (matches) {
            matchesAny = true;
            params.append("new_chore_id", oneChore.id);
            axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${child.id}/${chore.id}.json`, params).then(()=>{
              axios.delete(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`);
              onClose();
              navigate(`/children`);
            })
          }    
        })
        if (!matchesAny) {
          axios.patch(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`, params).then(() => {
            onClose();
            navigate(`/children`);
          })
        }
      })
    }
    else {   // if other children share the chore but none or not all are selected, first make new chore with new values and change childchore for THIS child to use new chore_id
      axios.post(`${apiConfig.backendBaseUrl}/chores.json`, params).then((response) => {
        const params = new FormData();
        params.append("new_chore_id", response.data.id);
        axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${child.id}/${chore.id}.json`, params).then(() => {
          if (checkedChildCount == 0) {
            onClose();
            navigate(`/children`);
          }
        })
        if (checkedChildCount != 0) { // if 1 to less than all selected, change childchore for EACH child selected to new chore_id
          Object.keys(isChildChecked).forEach( (childId, i) => {
            if (isChildChecked[childId]) {
              axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${childId}/${chore.id}.json`, params).then(() => {
                if (i === (Object.keys(isChildChecked).length - 1)) {
                  onClose();
                  navigate(`/children`);
                }
              });
            }
          })
        }
      })
    }
  }

  const countOtherChildren = () => {
    let count = 0;
    chore.children.map((oneChild) => {
      if (oneChild.id !== child.id && chore.child_chores.find(child_chore => child_chore.child_id === oneChild.id).active) 
        count++;
    })
    return count;
  }

  return (
    <div>
      <h1>{child.name} - {chore.title}</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">description:</label><br />
        <textarea name="description" id="description" rows="4" value={description || ""} onChange={(e)=>setDescription(e.target.value)}/>
        <br />
        <br />
        {days.map( day => (
          <div key={day}>
            <input type="checkbox" checked={isDayChecked[day] || false} name={day} onChange={()=>setIsDayChecked((prevCheckedStates) => ({...prevCheckedStates, [day]: !isDayChecked[day]}))}/> {day}
          </div>
        ))}
        <input type="checkbox" checked={isOneTimerChecked || false} name="one_timer" onChange={()=>setIsOneTimerChecked(!isOneTimerChecked)}/> one-timer (*)
        <br />
        <br />
        <div>Points earned for chore: <input type="text" name="points_awarded" value={points || 0} size="6" onChange={(e)=>setPoints(e.target.value)}/></div>
        <br />
        {countOtherChildren() != 0 ?
          <div>
            <div>Also modify this chore for: </div>
            {chore.children.map((oneChild) => (
              <div key={oneChild.id}>
                {oneChild.id !== child.id && chore.child_chores.find(child_chore => child_chore.child_id === oneChild.id).active ? <div><input type="checkbox" name={oneChild.id} value={isChildChecked[oneChild.id]} onChange={()=>{
                  setIsChildChecked((prevStates)=>({...prevStates, [oneChild.id]: !isChildChecked[oneChild.id]}));
                  setCheckedChildCount(checkedChildCount + (!isChildChecked[oneChild.id] ? 1 : -1));
                  }}/> {oneChild.name}</div> : null}
              </div>
            ))}
            <br />
          </div>
          :
          null
        }
        <button type="submit">Update</button>
      </form>
    </div>
  );
}