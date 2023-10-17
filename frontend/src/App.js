import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// components
import Container from  './components/layout/Container';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Message from './components/layout/Message';

// pages
import EditFuel from './components/pages/Fuel/EditFuel';
import FuelDetails from './components/pages/Fuel/FuelDetails';
import MyFuels from './components/pages/Fuel/MyFuels';
import AddFuel from './components/pages/Fuel/AddFuel';
import Profile from  './components/pages/User/Profile';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';

// context
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar/>
        <Message/>
        <Container>
          <Routes>
            <Route path='/fuel/edit/:id' element={<EditFuel/>}/>
            <Route path='/fuel/:id' element={<FuelDetails/>}/>
            <Route path='/fuel/myfuels' element={<MyFuels/>}/>
            <Route path='/fuel/addfuel' element={<AddFuel/>}/>
            <Route path='/user/:id' element={<Profile />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/' element={<Home/>}/>
          </Routes>
        </Container>
        <Footer/>
      </UserProvider>
    </Router>
  );
}

export default App;
