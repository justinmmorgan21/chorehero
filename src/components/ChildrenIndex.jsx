export function ChildrenIndex( { children }) {
  return (
    <div>
      <h1>All children</h1>
      { children.map( child => (
        <div key={child.id}>
          <p>{child.name}</p>
        </div>
      ))}
    </div>
  );
}