import axios from "axios";
import { useNavigate } from "react-router-dom";


export function ChildChoresHistory( { child } ) {

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const navigate = useNavigate();
  // const handleSubmit = event => {
  //   event.preventDefault();
  //   const params = new FormData(event.target);
  //   onCreate(params, () => event.target.reset());
  // }

  const handleReactivate = (choreId) => {
    const params = new FormData();
    params.append("active", false);
    params.append("date_inactivated", new Date());
    axios.patch(`http://localhost:3000/child_chores/${child.id}/${choreId}.json`, params).then( (response) => {
      console.log(response.data);
      navigate(`/children`);
    })
  }

  return (
    <div>
      <h1>Chore History - {child.name}</h1>
      <br />
      {child.inactive_chores.map( chore => (
        <div key={chore.id} >
          <div style={{ display:'flex', flexDirection:'row', gap:'6px'}}>
            <button >Edit</button>
            <button onClick={() => handleReactivate(chore.id)}>Reactivate</button>
            <div>{chore.title} -- </div>
            {days.map( day => ( 
              chore[`${day}`] ?
              (<div key={day}>&lt;{day}&gt;</div>) : (null)
              ))} --
            <div> points: {chore.points_awarded}</div>
          </div>
          <br />
        </div>
      ))}
      {/* <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" />
        </div>
        <div>
          Username: <input name="username" type="text" />
        </div>
        <div>
          Password: <input name="password" type="password" />
        </div>
        <div>
          Password confirmation: <input name="password_confirmation" type="password" />
        </div>
        <div>
          <label htmlFor="birthday">Birthdate: </label>
          <input type="date" id="birthday" name="birthdate" />
        </div>
        <br />
        <button type="submit">Create</button>
      </form> */}
    </div>
  );
}