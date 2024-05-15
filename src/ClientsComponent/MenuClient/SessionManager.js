import React, { useState } from 'react'
import PutSession from './PutSession'

function SessionManager({client,setCurrentPage}) {

    const [sessionManagerPage,setSessionManagerPage] = useState('Menu')

    const [sessionToModify,setSessionToModify] = useState()

    const handleSessionToModify = (session) => {
        setSessionToModify(session)
        setSessionManagerPage('Put')
    }


  return (
    <div>
    {sessionManagerPage === 'Menu' &&
        <>
            <span onClick={() => setCurrentPage('Menu')}> {'<-'}</span>
            <div>
                {client.daysOfSession.map((session) => (
                    <>
                        <p>Dia da sessão: {session.dayOfSession}</p>
                        <p>Horario de inicio da sessão: {session.timeOfSession}</p>
                        <p>Tempo da sessão: {session.durationOfSession}</p>
                        <p>Sessão bisemanal: {session.everyWeek ? 'Não' : 'Sim'}</p>
                        <button onClick={() => handleSessionToModify(session)}>Modificar Sessão</button>
                    </>
                ))}
            </div>
        </>
    }
    {sessionManagerPage === 'Put' &&
        <>
        <span onClick={() => setSessionManagerPage('Menu')}> {'<-'}</span>
        <PutSession
            session={sessionToModify}
        />
        </>
    }

    </div>
  )}
    

export default SessionManager