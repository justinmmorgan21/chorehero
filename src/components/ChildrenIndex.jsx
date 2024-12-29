export function ChildrenIndex( { children_results }) {

  return (
    <div>
      <h1>All children</h1>
      <div className="cards">
        { children_results.map( child => (
          <div key={child.id} className="card">
            <h2>{child.name}</h2>
            <p>username: {child.username}</p>
            <p>birthdate: {child.birthdate}</p>
            <p>points available: {child.points_available}</p>
            <p>money banked: {child.money_banked}</p>
          </div>
        ))}
      </div>
    </div>
  );
}