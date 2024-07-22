import React, { useEffect, useState } from 'react'
import RegisterSession from './RegisterSession'
import './Calender.css'
import backArrow from '../assets/compact-left-arrow.png'
import { NavLink } from 'react-router-dom'

function Calender({isLoggedIn}) {

    const API_GET_ALL_SESSIONS = "http://localhost:8080/sessionsDays/getAll"

    const [allSessions,setAllSessions] = useState([])

    const [isLoading,setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSessions = async () => {
            try{
                const response = await fetch(API_GET_ALL_SESSIONS)
                const sessionListResponse = await response.json()
               
                setAllSessions(sessionListResponse)
            }catch(err){
                console.log(err.stack)
            }finally{
                setIsLoading(false)
            }
        }
        (async () => await fetchSessions())()
    },[])


    const SessionsDays = {
        SEGUNDA: "SEGUNDA",
        TERCA: "TERÇA",
        QUARTA: "QUARTA",
        QUINTA: "QUINTA",
        SEXTA: "SEXTA",
        SABADO: "SABADO",
        DOMINGO: "DOMINGO"
    };

    const getSessionDay = (date) => {
        const dayOfWeek = date.getDay();
        switch (dayOfWeek) {
            case 0: return SessionsDays.DOMINGO;
            case 1: return SessionsDays.SEGUNDA;
            case 2: return SessionsDays.TERCA;
            case 3: return SessionsDays.QUARTA;
            case 4: return SessionsDays.QUINTA;
            case 5: return SessionsDays.SEXTA;
            case 6: return SessionsDays.SABADO;
            default: return null;
        }
    };


    const getWeekDays = () => {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDay + 1);
        const weekDays = [];
    
        for (let i = 0; i < 7; i++) {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + i);
          weekDays.push(day);
        }
    
        return weekDays;
      };
    
      const weekDays = getWeekDays();


      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const pagamentColor = (client) => {

        if (!client.pagamentHistory || client.pagamentHistory.length === 0) {
            return 'red'; 
        }
        const payday = client.payday;
        const today = new Date();
        const dayToday = today.getDate();
        const monthToday = today.getMonth();
        const yearToday = today.getFullYear();
      
        const sortPagamentList = client.pagamentHistory.sort((a,b) => {
            return new Date(b.payDate) - new Date(a.payDate)
        })
      
        const lastPayDate =  new Date(sortPagamentList[0].payDate);
        const lastPayYear = lastPayDate.getFullYear();
        const lastPayMonth = lastPayDate.getMonth();
      
        if (yearToday !== lastPayYear  ) {
            return 'red';
        }
        if(lastPayMonth === monthToday && yearToday === lastPayYear) {
            return 'green'
        }else {
            if(monthToday - 1 !== lastPayMonth){
                return 'red'
            }else{
                if (payday < dayToday) {
                    return 'red';
                } else if (payday === dayToday) {
                    return 'gold';
                } else {
                    return 'green';
                    }
                }
            }
           
        }

    
        const bisemanlColor = (client) => {
            if (!client.sessions || client.sessions.length === 0) {
                return 'blue'; 
            }
            const sortSessionList = client.sessions
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        
            const today = new Date();
            const lastSessionDate = new Date(sortSessionList[0].date);
        
            
            const startOfLastWeek = new Date(today);
            startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
            startOfLastWeek.setHours(0, 0, 0, 0); 
        
            const endOfLastWeek = new Date(today);
            endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
            endOfLastWeek.setHours(23, 59, 59, 999); 
        
            if (lastSessionDate >= startOfLastWeek && lastSessionDate <= endOfLastWeek) {
                return 'gold';
            } else {
                return 'blue';
            }
        };

        const semanalColor = (client) => {
            if (!client.sessions || client.sessions.length === 0) {
                return 'blue'; 
            }
        
            const sortedSessionList = client.sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
            const today = new Date();
            const lastSessionDate = new Date(sortedSessionList[0].date);
        
            
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0); 
        
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() - today.getDay() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
        
            if (lastSessionDate >= startOfWeek && lastSessionDate <= endOfWeek) {
                return 'gold';
            } else {
                return 'blue';
            }
        };
        

    const filterSessionByDay = (day) => {
        return allSessions.filter(session => session.dayOfSession === day).sort((a, b) => {
            const [hourA, minuteA] = a.timeOfSession.split(':').map(Number);
            const [hourB, minuteB] = b.timeOfSession.split(':').map(Number);
    
            if (hourA !== hourB) {
                return hourA - hourB;
            } else {
                return minuteA - minuteB;
            }
        });
    };

    
    const [lightbox,setLightbox] = useState(false)

    const openLightbox = () => {
        setLightbox(true);
        document.body.classList.add('no-scroll');
        
      }
    
      const closeLightbox = () => {
        setLightbox(false);
        document.body.classList.remove('no-scroll');
      }

      const [selectedClient,setSelectedClient] = useState()
      const [selectedDate,setSelectedDate] = useState()
      const [attend,setAttend] = useState(true)

      const handleRegisterSession = (client,day) => {
        setSelectedClient(client)
        setSelectedDate(day)
        setAttend(true)
        openLightbox()
      }

      const handleMissedSession = (client,day) => {
        setSelectedClient(client)
        setSelectedDate(day)
        setAttend(false)
        openLightbox()
      }


  return (
    <div >
        {isLoggedIn ?
            <>
            {!isLoading ? 
                <div className='calender-page'>
                <NavLink to='/home'>
                    <img src={backArrow} className='arrow-go-back'/>
                </NavLink>
                <div className='calender-page-h1'>
                    <h1>Calendário Semanal</h1>
                </div>
                
                <ul className='calender-ul'>
                    {weekDays.map((day, index) => {
                    const sessionDay = getSessionDay(day);
                    const filteredSession = filterSessionByDay(sessionDay);
                    return (
                            <li key={index} className='calender-li'>
                            <div className='calender-day-head'>
                                <p className='calender-day'>{formatDate(day)}</p>
                                {day.toLocaleDateString('pt-BR', { weekday: 'long' })} 
                            </div>
                            
                                <ul className='calender-client-ul'>
                                    {filteredSession.map(session => (
                                                <li key={session.clientSessionDaysId} className='calender-client-li'>
                                                <>

                                                  <p className='calender-client-name'>{session.client.name} </p>  
                                                  <p className='calender-client-li-p'>Dia de pagamento: <span style={{color:pagamentColor(session.client)}}>{session.client.payday}  {pagamentColor(session.client) === 'red' ? '(Atrasado)' : pagamentColor(session.client) === 'green' ? '(Em dia)' : pagamentColor(session.client) === 'gold' ? '(Vence Hoje)' : ''}</span></p>
                                                  <p className='calender-client-li-p'>Horário de início da sessão: {session.timeOfSession}</p>
                                                  <p className='calender-client-li-p'>Duração da sessão: {session.durationOfSession}</p>
                                                  <p className='calender-client-li-p'>
                                                    Tipo de sessão: {session.everyWeek ? <span style={{color: semanalColor(session.client)}}>Semanal</span> : <span style={{color: bisemanlColor(session.client)}}>Bisemanal</span>}
                                                </p>
                                                  <button onClick={() => handleRegisterSession(session.client,day)}>
                                                  Registar Sessão </button>
                                                  <button onClick={() => handleMissedSession(session.client,day)}>Marcar falta</button>
                                                   
                                                </>
                                                </li>
                                        ))}
                                </ul>
                            </li>
                            );
                    })}
                </ul>
                {lightbox && (
                    <div className="lightbox">
                    <span className="close-button" onClick={closeLightbox}>X</span>
                    <div className="lightbox-content">
                        <div >
                            <RegisterSession
                                client = {selectedClient}
                                day = {selectedDate}
                                attend={attend}
                                fromMenu={false}
                            />
                        </div>
                    </div>
                    </div>
                )}
                </div>
                :
                <div className='message-to-user-display'>
                <p >Carregando...</p>
                </div>
            }
            
            </>
            :
            <p>Voce precisa logar para acessar essa pagina</p>
        }
    </div>
  )

  
}

export default Calender