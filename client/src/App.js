
import './App.css';
import NavBar from './components/NavBar/NavBar';
import RenderSidebar from './components/Sidebar/RenderSidebar.js';
import Calendar from './components/Calendar/Calendar';

function App() {

  return (
    <div className="App">
      <NavBar />
      <div className='demo-app'>
        <RenderSidebar />
        <div className='demo-app-main'>
          <Calendar />
        </div>
      </div>
    </div>
  );

}


export default App;
