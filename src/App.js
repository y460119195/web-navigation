import React from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBox from './components/search-box'
import TimeBox from './components/time-box'
import BookMarkBox from './components/bookmark-box'

function App() {
  return (
    
    <div className="App">
      {/* <div className= "App-space"/> */}
      <TimeBox/>
      <SearchBox/>
      <BookMarkBox/>
      
    </div>
  );
}

export default App;
