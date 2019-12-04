import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import './App.css';
import AtmosDrums from './Containers/Atmosphere';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <AtmosDrums {...props}/>}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
