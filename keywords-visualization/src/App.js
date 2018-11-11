import React, { Component } from 'react';
import './App.css';
import MainView from './main-view/main-view.component';

class App extends Component {
  render() {
    return (
      <div id="app" className="App">
        <MainView/>
      </div>
    );
  }
}

export default App;
