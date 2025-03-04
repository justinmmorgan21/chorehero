import { Link } from "react-router-dom";
import { LogoutLink } from "./LogoutLink";
import { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from './assets/small logo.png';
import apiConfig from "./apiConfig";

export function Header() {
  const [currentParent, setCurrentParent] = useState({});
  const [currentChild, setCurrentChild] = useState({});

  const getParent = () => {
    axios.get(`${apiConfig.backendBaseUrl}/parents/current.json`).then(response => {
      setCurrentParent(response.data);
    })
  }
  
  const getChild = () => {
    axios.get(`${apiConfig.backendBaseUrl}/children/current.json`).then(response => {
      setCurrentChild(response.data);
    })
  }
  
  useEffect(getParent, []);
  useEffect(getChild, []);

  let authLinks;
  let navLinks = <></>;
  let welcomeUserMessage = <></>;
  if (localStorage.jwt === undefined) {
    authLinks = (
      <>
      <Link to="signup">Signup</Link> | <Link to="login">Login</Link>
      </>
    )
  } else {
    navLinks = currentParent.username ? 
      (
        <>
        <Link to="children">Children</Link>  | <Link to="chores">Chores</Link> | <Link to="rewards">Rewards</Link> |
        </>
      )
      :
      (
        <>
        <Link to={`children/${currentChild.id}`}>Chores</Link> | <Link to="rewards">Rewards</Link> |
        </>
      )
    authLinks = ( 
      <LogoutLink />
    )
    welcomeUserMessage = (
      <span style={{marginRight:"24px"}}>Welcome, {currentParent.username || currentChild.username}</span>
    )
  }
  
  return (
    <header style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'gray', zIndex: 1, padding:"8px" }}>
      <div style={{display:"flex", flexDirection:"row", margin:"0px", padding:"0px"}}>
        <img src={Logo} style={{padding:"0 60px 0 0", margin:"0px"}} alt="" />
        <nav style={{width:"100%", padding:"0px", margin:"0px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{margin:"0px", padding:"0px"}}>
            {navLinks} {authLinks} 
            {/* <Link to="/">Home</Link> {navLinks} | {authLinks}  */}
          </div>
          <span style={{margin:"0 32px 0 0"}}>{welcomeUserMessage}</span>
        </nav>
      </div>  
    </header>
  )
}