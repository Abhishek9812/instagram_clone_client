import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import { Switch, Route } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Cookies from "universal-cookie";
import CreatePost from './components/CreatePost';

function App() {
  const [userData, setUserData] = useState('');
  const cookie = new Cookies();

  const logoutUser = () => {
    localStorage.clear();
    cookie.remove('token');
    setUserData(null);
  }



  return (
    <>

      <Navbar userData={userData} logoutUser={logoutUser} />
      <Switch>
        <Route exact path='/'>
          <Home userData={userData} />
        </Route>

        <Route path='/login'>
          <Login setUserData={setUserData} />
        </Route>

        <Route path='/signUp'>
          <SignUp />
        </Route>

        <Route path='/createPost'>
          <CreatePost />
        </Route>

        <Route >
          <ErrorPage />
        </Route>
      </Switch>
      <ToastContainer />
    </>
  );
}

export default App;
