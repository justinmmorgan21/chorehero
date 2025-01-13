import BackgroundImage from './assets/main page logo.png';
export function HomePage() {
  return (
    <div id="home" style={{width:"100vw", height:"100vh", backgroundImage:`url(${BackgroundImage})`, backgroundSize:"cover", backgroundRepeat:"no-repeat", backgroundPosition:"center", overflow:"hidden"}}>

    </div>
  );
}