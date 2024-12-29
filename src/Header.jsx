import { Link } from "react-router-dom";
import { LogoutLink } from "./LogoutLink";

export function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | <Link to="/children">Children</Link>  | <Link to="/chores">Chores</Link> | <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link> | <LogoutLink />
        
        
      </nav>
    </header>
  )
}