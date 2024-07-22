import React from 'react'
import { NavLink } from 'react-router-dom'
import './HomePage.css'
import logo from '../assets/logo.jpg'
function HomePage({isLoggedIn,username}) {

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
  return (
    <div className='home-page'>
        {!isLoggedIn &&
            <p>Voce precisa logar para acessar essa pagina</p>
        }
        {isLoggedIn &&
        <>
            {/* <img src ={logo} className='home-page-logo'/> */} 
            <h1>Bem Vindo(a) {capitalize(username)}</h1>
            <div className='home-page-buttons'>
            <NavLink to='/calender'>
                <button>
                    Calendário
                </button>
            </NavLink>
                <NavLink to='/clients'>
                    <button>
                        Clientes
                    </button>
                </NavLink>
                <NavLink to = '/pagaments'>
                    <button>Pagamentos</button>
                </NavLink>
                <NavLink to ='/configurations'>
                    <button>
                        Configurações
                    </button>
                </NavLink>
                
                
            </div>
        </>}
    </div>
  )
}

export default HomePage