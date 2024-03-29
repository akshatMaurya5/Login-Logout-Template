import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import {Routes, Route} from 'react-router-dom'
import Home from './pages/home/Home';
import RequireUser from './components/requireUser';
function App() {
  return (
    <div className="App">
      <Routes>

      <Route element={<RequireUser/>}>
        <Route path="/" element={<Home/>} />
      </Route>
      <Route path="/login" element={<Login/>}  />
      <Route path="/signup" element={<Signup/>} />


      </Routes>
    </div>
  );
}

export default App;
