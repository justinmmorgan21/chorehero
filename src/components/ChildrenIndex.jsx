
export function ChildrenIndex( { children_results }) {

  return (
    <div>
      <h1>All children</h1>
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
              <div>
                <h4>Monday</h4>
                {child.monday_chores.map(chore => (
                  <div key={chore.id}>
                    <input type="checkbox" /> {chore.title}
                  </div>
                ))}
                <div>COMPLETE</div>
              </div>
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