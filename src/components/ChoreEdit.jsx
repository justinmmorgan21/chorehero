import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiConfig";

export function ChoreEdit( { chore, currentParent, onClose } ) {

  const [isOneTimerChecked, setIsOneTimerChecked] = useState(chore.one_timer);
  const [isDayChecked, setIsDayChecked] = useState({});
  const [isChildChecked, setIsChildChecked] = useState({});
  const [description, setDescription] = useState(chore.description);
  const [points, setPoints] = useState(chore.points_awarded);

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
    currentParent.children.map( oneChild => {
      if (chore.children.find(child => child.id === oneChild.id)) {
        initialChildCheckedStates[oneChild.id] = true;
      } else {
        initialChildCheckedStates[oneChild.id] = false;
      }
    })
    setIsChildChecked(initialChildCheckedStates);
  }, []);

  const navigate = useNavigate();

  const initializeParams = event => {
    let params = new FormData(event.target);
    days.forEach( day => {
      if (!params.has(day)) {
        params.append(day, false);
      }
    })
    if (!params.has("one_timer")) {
      params.append("one_timer", false);
    }
    params.append("title", chore.title);
    return params;
  }

  const handleSubmit = event => {
    event.preventDefault();
    let params = initializeParams(event);

    axios.get(`${apiConfig.backendBaseUrl}/chores.json`).then((response) => {
      const chores = response.data;
      let matchesAny = false;
      chores.map( oneChore => {
        let matches = true;
        if (oneChore.id == chore.id) matches = false;
        if (oneChore.title != params.get("title")) matches = false;
        if (oneChore.description != params.get("description")) matches = false;
        days.forEach( day => {
          if ((oneChore[day] != null && oneChore[day] != (params.get(day) === "on" ? true : false)) || (oneChore[day] == null && params.get(day) != "false")) {
            matches = false;
          }
        })
        if (oneChore.one_timer != (params.get("one_timer") === "on" ? true : false)) matches = false;        
        if (oneChore.points_awarded != params.get("points_awarded")) matches = false;
        if (matches) {
          matchesAny = true;
          // if all checked children stay checked - change child_chores to other chore for each and delete chore
          // otherwise...
          // // if was not checked is now checked: make new child_chore for other chore
                // if ONLY no checked to checked, delete chore
          // // if was checked and is now not checked: deactivate child_chore for THAT Child

          // while looping through each parent's child:  also track if any go from checked to not checked, then switch boolean
          let checkedToUnchecked = false;
          currentParent.children.forEach( (oneChild, i) => {
            params = initializeParams(event);
            // checked to checked -> update child_chore (new chore_id)
            if (chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
              params.append("new_chore_id", oneChore.id);
              axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params).then(() => {
                if (currentParent.children.length - 1 === i && checkedToUnchecked) {
                  onClose();
                  navigate(`/chores`);
                }
              })
            }
            // unchecked to checked -> create child_chore (using child_id, chore_id)
            else if (!chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
              params.append("chore_id", oneChore.id);
              params.append("child_id", oneChild.id);
              axios.post(`${apiConfig.backendBaseUrl}/child_chores.json`, params).then(() => {
                if (currentParent.children.length - 1 === i && checkedToUnchecked) {
                  onClose();
                  navigate(`/chores`);
                }
              })
            }
            // checked to unchecked -> update child_chore (active:false, date_inactivated)
            else if (chore.children.find(child => child.id === oneChild.id) && !isChildChecked[oneChild.id]) {
              checkedToUnchecked = true;
              params.append("active", false);
              params.append("date_inactivated", new Date());
              axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params).then(() => {
                if (currentParent.children.length - 1 === i) {
                  onClose();
                  navigate(`/chores`);
                }
              })
            }
          })
          // if boolean says no checked to unchecked, delete old chore
          if (!checkedToUnchecked) {
            axios.delete(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`).then(() => {
              onClose();
              navigate(`/chores`);
            })
          }
        }
      })
      if (!matchesAny) {
        axios.patch(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`, params).then(() => {
          let axiosPromises = currentParent.children.map((oneChild) => {
            if (chore.children.find(child => child.id === oneChild.id) && !isChildChecked[oneChild.id]) {  // checked to unchecked
              params.append("active", false);
              params.append("date_inactivated", new Date());
              return axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params);
            }
            if (!chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
              params.append("child_id", oneChild.id);
              params.append("chore_id", chore.id);
              return axios.post(`${apiConfig.backendBaseUrl}/child_chores.json`, params);
            }        
            return Promise.resolve();
          });
          Promise.all(axiosPromises).then(() => {
            onClose();
            navigate(`/chores`);
          }).catch((error) => {
            console.error("Error updating child chores:", error);
          });
        })
      }
    })
  }


  return (
    <div>
      <h1>{chore.title}</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">description:</label><br />
        <textarea name="description" id="description" rows="4" value={description || ""} onChange={(e)=>setDescription(e.target.value)}/><br />
        <br />
        {days.map( day => (
        <div key={day}>
          <input type="checkbox" checked={isDayChecked[day] || false} name={day} onChange={()=>setIsDayChecked((prevCheckedStates) => ({...prevCheckedStates, [day]: !isDayChecked[day]}))}/> {day}
        </div>
        ))}
        <input type="checkbox" checked={isOneTimerChecked || false} name="one_timer" onChange={()=>setIsOneTimerChecked(!isOneTimerChecked)}/> one-timer (*)<br />
        <br />
        <div>Points earned for chore: <input type="text" name="points_awarded" value={points || 0} size="6" onChange={(e)=>setPoints(e.target.value)}/></div>
        <br />
        <p>Assign chore to: </p>
        <div style={{display:"flex", flexDirection:"row", marginTop:"4px"}}>
          {currentParent.children.map( child => (
          <div key={child.id} style={{marginRight:"12px"}}>
            <input type="checkbox" name={child.id} checked={isChildChecked[child.id] || false} onChange={()=>{
              setIsChildChecked((prevStates)=>({...prevStates, [child.id]: !prevStates[child.id]}));
            }} /> {child.name}
          </div>
          ))}
        </div>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}