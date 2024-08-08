import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./login/Login";
import Register from "./register/Register";
import HomePage from "./HomePage/HomePage";
import Clients from "./ClientsComponent/Clients";
import Calender from "./Calender/Calender";
import './App.css'
import ConfigurationsPage from "./ConfigurationsPage/ConfigurationsPage";
import PagamentPage from "./PagamentsPage/PagamentPage";



function App() {

  const API_GET_ALL_USER = "http://localhost:8080/user/getAll";

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(API_GET_ALL_USER);
        const userList = await response.json();
        if(userList.length > 0){
          const user = userList[0]
        setUser(user);
        setUsername(user.name)
        setLimitTimeOfSession(user.limitTimeOfSession)
        setLimitDurationOfSession(user.limitDurationOfSession)
        setNumberOfClientsPerPage(user.numberOfClientsPerPage)
        setNumberOfSessionPerPage(user.numberOfSessionsPerPage)
        setNumberOfPagamentsPerPage(user.numberOfPagamentsPerPage)
        setNumberOfPagamentsMonthPerPage(user.numberOfPagamentsPerMonthPage)
        }
        
      } catch (err) {
        console.log(err.stack);
      } finally {
        setIsLoading(false);
      }
    };

    (async () => await fetchUser())();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const [username,setUsername] = useState('')

  const [limitTimeOfSession,setLimitTimeOfSession] = useState('23:00')

  const [limitDurationOfSession,setLimitDurationOfSession] = useState('12:00')


  const [numberOfClientPerPage,setNumberOfClientsPerPage] = useState(5)

 

  const [numberOfSessionPerPage,setNumberOfSessionPerPage] = useState(5)

  

  const [numberOfPagamentsPerPage,setNumberOfPagamentsPerPage] = useState(5)

  const [numberOfPagamentsMonthPerPage,setNumberOfPagamentsMonthPerPage] = useState(5)


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register user={user}/>} />
       
        <Route
            path="/home"
            element={<HomePage
            
              isLoggedIn={isLoggedIn}
              username={username}
            />}
            
          />

          <Route
            path="/calender"
            element={<Calender 
              isLoggedIn={isLoggedIn}
            />}
          />

          <Route
             path="/clients"
             element={<Clients isLoggedIn={isLoggedIn} limitTimeOfSession={limitTimeOfSession} limitDurationOfSession={limitDurationOfSession} numberOfClientPerPage={numberOfClientPerPage} numberOfSessionPerPage={numberOfSessionPerPage} numberOfPagamentsPerPage={numberOfPagamentsPerPage}/>}
          />
          <Route
            path="/configurations"
            element={<ConfigurationsPage/>}
          />

          <Route
              path="/pagaments"
              element={<PagamentPage numberOfPagamentsMonthPerPage ={numberOfPagamentsMonthPerPage} />}
          />



      </Routes>
    </div>
  );
}

export default App;
