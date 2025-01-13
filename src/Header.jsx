import { Link } from "react-router-dom";
import { LogoutLink } from "./LogoutLink";
import { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from './assets/small logo.png';

export function Header() {
  const [currentParent, setCurrentParent] = useState({});

  const getParent = () => {
    axios.get("http://localhost:3000/parents/current.json").then(response => {
      setCurrentParent(response.data);
    })
  }

  useEffect(getParent, []);

  let authLinks
  let welcomeUserMessage = <></>
  if (localStorage.jwt === undefined) {
    authLinks = (
      <>
      <Link to="signup">Signup</Link> | <Link to="login">Login</Link>
      </>
    )
  } else {
    authLinks = ( 
      <LogoutLink />
    )
    welcomeUserMessage = (
      <span>Welcome, {currentParent.username}</span>
    )
  }
  
  return (
    <header style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'gray', zIndex: 1, padding:"8px" }}>
      <div style={{display:"flex", flexDirection:"row", margin:"0px", padding:"0px"}}>
        <img src={Logo} style={{paddingRight:"60px", margin:"0px"}} alt="" />
        <nav style={{width:"100%", padding:"0px", margin:"0px", display:"flex", alignItems:"center"}}>

        <span style={{margin:"0px", padding:"0px"}}>

          <Link to="/">Home</Link> | <Link to="children">Children</Link>  | <Link to="chores">Chores</Link> | <Link to="rewards">Rewards</Link>| {authLinks} | {welcomeUserMessage}
        </span>
      </nav>
        </div>
        
    </header>
  )
}