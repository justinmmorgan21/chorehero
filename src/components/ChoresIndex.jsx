export function ChoresIndex( { chores } ) {
  return (
    <div>
      <h1>All chores</h1>
      { chores.map( chores => (
        <div key={chores.id}>
          <p>{chores.title}</p>
          <p>parent_id: {chores.parent_id}</p>
        </div>
      ))}
    </div>
  );
}