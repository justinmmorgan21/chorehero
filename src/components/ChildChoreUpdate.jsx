import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ChildChoreUpdate( { child, chore, onClose } ) {
  // const [currentParent, setCurrentParent] = useState({});

  // const getParent = () => {
  //   axios.get("http://localhost:3000/parents/current.json").then(response => {
  //     setCurrentParent(response.data);
  //   })
  // }

  // useEffect(getParent, []);

  const [isOneTimerChecked, setIsOneTimerChecked] = useState(chore.one_timer);
  const [isDayChecked, setIsDayChecked] = useState({});
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
    for (const [key, value] of params.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    console.log("other children: ", countOtherChildren());
    // console.log("parent children: ", currentParent.children.count)
    if (countOtherChildren() == 0) {//} || countOtherChildren() + 1 == currentParent.children.count) {  //if no other children sharing the chore, edit that chore  OR if all selected, edit that chore
      axios.patch(`http://localhost:3000/chores/${chore.id}.json`, params).then(response => {
        console.log("response: ", response.data);
        onClose();
        navigate(`/children`);
      })
    } 
    // else {   // if other children share the chore
    //   if () { // if none checked, make new chore with new values and change childchore for THIS child to new chore_id
      
    //   } else if () { // if 1 to less than all selected, make new chore, and change childchore for EACH child selected to new chore_id
      
    //   }
    // }
  }

  // const handleSubmit = (choreId) => {
  //   const params = new FormData();
  //   params.append("active", false);
  //   params.append("date_inactivated", new Date());
  //   axios.patch(`http://localhost:3000/child_chores/${child.id}/${choreId}.json`, params).then( (response) => {
  //     console.log(response.data);

  //   })
  // }

  const countOtherChildren = () => {
    let count = 0;
    chore.children.map((oneChild) => {
      if (oneChild.id !== child.id) count++;
    })
    return count;
  }
  return (
    <div>
      <h1>{child.name} - {chore.title}</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">description:</label><br />
        <textarea name="description" id="description" rows="4" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        <br />
        <br />
        {days.map( day => (
          <div key={day}>
            <input type="checkbox" checked={isDayChecked[day]} name={day} onChange={()=>setIsDayChecked((prevCheckedStates) => ({...prevCheckedStates, [day]: !isDayChecked[day]}))}/> {day}
          </div>
        ))}
        <input type="checkbox" checked={isOneTimerChecked} name="one_timer" onChange={()=>setIsOneTimerChecked(!isOneTimerChecked)}/> one-timer (*)
        <br />
        <br />
        <div>Points earned for chore: <input type="text" name="points_awarded" value={points} size="6" onChange={(e)=>setPoints(e.target.value)}/></div>
        <br />
        {countOtherChildren() != 0 ?
          <div>
            <div>Also modify this chore for: </div>
            {chore.children.map((oneChild, i) => (
              <div key={oneChild.id}>
                {oneChild.id !== child.id ? <div><input type="checkbox" name={"child" + i} /> {oneChild.name}</div> : null}
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