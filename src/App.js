import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import './App.css';
import Home from './Containers/Home';
import Atmos from './Containers/Atmosphere';
import PageNotFound from './Components/PageNotFound';

const App = () => {

  const [user, setUser] = useState(false);

  const helloUser = () => {
    console.log('hello')
    setUser(!user)
  }

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => (user ? <Atmos {...props}/> : <Home {...props} helloUser={helloUser}/>)}/>
          <Route component={PageNotFound}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
