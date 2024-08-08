import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/logo.jpg';

function HomePage({ isLoggedIn, username }) {
  const [isLoading, setIsLoading] = useState(true);

  const devOnly = false

  useEffect(() => {
    if(!devOnly){
      const hasReloaded = sessionStorage.getItem('hasReloaded');

      if (!hasReloaded) {
        sessionStorage.setItem('hasReloaded', 'true');
        window.location.reload();
      } else {
        setIsLoading(false);
      }
  
      return () => {
        sessionStorage.removeItem('hasReloaded');
      };
    }else{
      setIsLoading(false)
    }
    
  }, [devOnly]);
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className='home-page'>
      {!isLoggedIn && <p>Você precisa logar para acessar essa página</p>}
      {isLoggedIn && (
        <>
          {!isLoading && (
            <>
              {/* <img src={logo} className='home-page-logo' /> */}
              <h1>Bem Vindo(a) {capitalize(username)}</h1>
              <div className='home-page-buttons'>
                <NavLink to='/calender'>
                  <button>Calendário</button>
                </NavLink>
                <NavLink to='/clients'>
                  <button>Clientes</button>
                </NavLink>
                <NavLink to='/pagaments'>
                  <button>Pagamentos</button>
                </NavLink>
                <NavLink to='/configurations'>
                  <button>Configurações</button>
                </NavLink>
              </div>
            </>
          )}
          {isLoading && (
            <div className='message-to-user-display'>
              <p>Carregando...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
