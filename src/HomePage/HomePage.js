import React from 'react'
import { NavLink } from 'react-router-dom'

function HomePage({isLoggedIn}) {
  return (
    <>
        {!isLoggedIn &&
            <p>Voce precisa logar para acessar essa pagina</p>
        }
        {isLoggedIn &&
        <>
            <h1>Bem Vindo(a)</h1>
            <div>
                <button>
                    Calendario
                </button>
                <NavLink to='/clients'>
                    <button>
                        Pacientes
                    </button>
                </NavLink>
                
                <button>
                    Configuraçoes
                </button>
            </div>
        </>}
    </>
  )
}

export default HomePage