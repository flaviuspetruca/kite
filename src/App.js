import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Container, Navbar, Dropdown } from 'react-bootstrap';
import Spots from './components/Spots';
import Login from './components/Login';
import NotFound from './components/NotFound';

function App() {

  const getUsername = () => {
    const user = localStorage.getItem('username');
    const userJson = JSON.parse(user);
    return userJson;
  };
  
  const [username, setUsername] = useState(getUsername());

  const handleLogin = (username) => {
    localStorage.setItem('username', JSON.stringify(username));
    setUsername(username);
  }

  const logOut = () => { 
    localStorage.removeItem('username');
    setUsername(null);
  }

  return(
    <div>
      <Router>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Kite</Navbar.Brand>
              <Dropdown >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {
                  username !== null ? 
                    <>{username}</>
                  :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
                    </svg>
                }
                </Dropdown.Toggle>

                <Dropdown.Menu align="right">
                {
                  username !== null? 
                    <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>
                  :
                    <Dropdown.Item href="/login">Login</Dropdown.Item>
                }
                </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
      
      { 
        username === null?
          <Switch>
            <Route exact path="/" component={() => <Spots props={username}/>}></Route>
            <Route path="/login" component={() => <Login setUsername={handleLogin}/>} />
            <Route component={NotFound}/>
          </Switch>
        :
          <Switch>
            <Route exact path="/" component={() => <Spots props={username}/>}></Route>
            <Route component={NotFound}/>
          </Switch>
      }

      </Router>
    </div>
  )
}

export default App;
