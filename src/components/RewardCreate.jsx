export function RewardCreate( { onCreate } ) {

  const handleSubmit = event => {
    event.preventDefault();
    let params = new FormData(event.target);
    onCreate(params);
  }

  return (
    <div>
      <h1>New Reward</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Reward: </label><br />
        <input name="title" type="text" /><br />
        <br />
        <label htmlFor="points_cost">Points cost: </label>
        <input name="points_cost" type="text" size="4"/><br />
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}