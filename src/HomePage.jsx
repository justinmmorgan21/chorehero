import BackgroundImage from './assets/main page logo.png';
export function HomePage() {
  return (
    <div id="home" style={{width:"100vw", height:"100vh", backgroundImage:`url(${BackgroundImage})`, backgroundSize:"cover", backgroundRepeat:"no-repeat", backgroundPosition:"center", overflow:"hidden"}}>
      <div style={{width:"100vw", marginTop:"400px", display:"flex", justifyContent:"center"}}>
        {localStorage.jwt === undefined ? 
          <a href="/login"><button style={{padding:"5px 20px", fontSize:"1.2em"}}>Login</button></a> 
          : 
          null
        }
      </div>
    </div>
  );
}