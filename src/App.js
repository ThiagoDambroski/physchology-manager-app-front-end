import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./login/Login";
import Register from "./register/Register";
import HomePage from "./HomePage/HomePage";
import Clients from "./ClientsComponent/Clients";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
       
        <Route
            path="/home"
            element={<HomePage
              isLoggedIn={isLoggedIn}
            />}
            
          />

          <Route
             path="/clients"
             element={<Clients isLoggedIn={isLoggedIn}/>}
          />
      </Routes>
    </div>
  );
}

export default App;
