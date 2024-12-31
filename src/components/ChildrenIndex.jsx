
import { useEffect, useState } from "react";

export function ChildrenIndex( { children_results }) {


  const [isChoreDone1, setIsChoreDone1] = useState(false);
  const [isChoreDone2, setIsChoreDone2] = useState(false);

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // }

  
  const chore_done_for_monday = (child_id, chore_id) => {
    let result = false;
    children_results.forEach(child => {
      if (child.id === child_id) {
        child.child_chores.forEach(child_chore => {
          if (child_chore.chore_id === chore_id) {
            // console.log("chore_id: ", chore_id)
            // console.log(child_chore.done_mon);
            result = child_chore.done_mon;
          }
        })
      }
    })
    return result;
  }

  useEffect(() => {
    const done1 = chore_done_for_monday(children_results[0].id, children_results[0].child_chores[1].chore_id);
    setIsChoreDone1(done1);
    const done2 = chore_done_for_monday(children_results[0].id, children_results[0].child_chores[2].chore_id);
    setIsChoreDone2(done2);
  }, [children_results]);
  
  return (
    <div>
      <h1>All children</h1>

      <div key={children_results[0].id} className="card">
            <div className="child-info">
              <h2>{children_results[0].name}</h2>
              <p>username: {children_results[0].username}</p>
              {/* <p>birthdate: {children_results[0].birthdate}</p> */}
              <p>age: {children_results[0].age}</p>
              <p>points: {children_results[0].points_available}</p>
              <p>money banked: ${children_results[0].money_banked}</p>
            </div>
            <br />
            <div style={{ display:"flex", flexDirection:"row"}}>
              <div>
                <h4>Monday</h4>

                  <div>
                    {/* <input type="checkbox" defaultChecked={children_results[0].child_chores[1].done_mon} /> {children_results[0].monday_chores[0].title} */}
                    <input type="checkbox" checked={isChoreDone1} onChange={e => setIsChoreDone1(e.target.checked)} /> {children_results[0].monday_chores[0].title}
                  </div>
                  <div>
                    {/* <input type="checkbox" defaultChecked={children_results[0].child_chores[2].done_mon} /> {children_results[0].monday_chores[1].title} */}
                    <input type="checkbox" checked={isChoreDone2} onChange={e => setIsChoreDone2(e.target.checked)} /> {children_results[0].monday_chores[1].title}
                  </div>
              </div>
              <br />
              

            
          </div>

          </div>






      <div>
        { children_results.map( child => (
          <div key={child.id} className="card">
            <div className="child-info">
              <h2>{child.name}</h2>
              <p>username: {child.username}</p>
              {/* <p>birthdate: {child.birthdate}</p> */}
              <p>age: {child.age}</p>
              <p>points: {child.points_available}</p>
              <p>money banked: ${child.money_banked}</p>
            </div>
            <br />
            <div style={{ display:"flex", flexDirection:"row"}}>
              {/* <div>
                <h4>Monday</h4>
                {child.monday_chores.map(chore => (
                  <div key={chore.id}>
                    <input type="checkbox" checked={isChecked} onChange={()=>chore_done_for_monday()} /> {chore.title}
                  </div>
                ))}
                <p>checked: {isChecked}</p>
              </div> */}
              <br />
              <div>
                <h4>Tuesday</h4>
                {child.tuesday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
              <br />
              <div>
                <h4>Wednesday</h4>
                {child.wednesday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
              <br />
              <div>
                <h4>Thursday</h4>
                {child.thursday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
              <br />
              <div>
                <h4>Friday</h4>
                {child.friday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
              <br />
              <div>
                <h4>Saturday</h4>
                {child.saturday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
              <br />
              <div>
                <h4>Sunday</h4>
                {child.sunday_chores.map(chore => (
                  <div key={chore.id}>
                  <p>{chore.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}