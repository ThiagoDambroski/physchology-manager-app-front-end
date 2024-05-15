import React, { useEffect, useState } from 'react'

function PutSession({session}) {
    const moment = require('moment');
    const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"

    const [sessionDaysArray,setSessionDaysArray] = useState()

    useEffect(()=> {

        const fecthSessionDays = async () => {
            try{
              const response = await fetch(API_GET_ALL_SESSIONS_DAYS);
              if(!response.ok) throw Error('Did not recive expected data');
              const listSessionDays = await response.json();
              setSessionDaysArray(listSessionDays);
              
            }catch(err){
              console.log(err.stack)
            }
      
          }
          (async () => await fecthSessionDays())(); 
    },[])

    const [newDayOfSession,setNewDayOfSession] = useState(session.dayOfSession)

    const handleNewDayOfSessionChange = (day) => {
        setNewDayOfSession(day)
    }


    const [newTimeOfSession,setNewTimeOfSession] = useState(session.timeOfSession)

    const handleTimeOfSessionChange = (input) => {
        
        const numericValue = input.replace(/\D/g,"");

        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                if(min > 59){
                    setNewTimeOfSession(numericValue.slice(0, 2) + ":" +  '59')
                }else{
                    setNewTimeOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
                
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                if (hours > 23) {
                    setNewTimeOfSession('23');
                } else {
                    setNewTimeOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
            } else {
                setNewTimeOfSession(numericValue);
            }
        }
    };

    const [newSessionDuration,setNewSessionDuration] = useState(session.durationOfSession)

    const handleSessionDurationChange = (input) => {
        
        const numericValue = input.replace(/\D/g,"");

        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                if(min > 59){
                    setNewSessionDuration(numericValue.slice(0, 2) + ":" +  '59')
                }else{
                    setNewSessionDuration(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
                
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                if (hours > 23) {
                    setNewSessionDuration('23');
                } else {
                    setNewSessionDuration(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
            } else {
                setNewSessionDuration(numericValue);
            }
        }
    };

    const [newEveryWeek, setNewEveryWeek] = useState(session.everyWeek)


    const handleEveryWeekChange  = (event) => {
        setNewEveryWeek(!event.target.checked)
    }



    const checkIfTimeConflict = (dayOfWeek,listSessionTime, timeOfSession, durationOfSession) => {
      
        const beggin = moment(timeOfSession, 'HH:mm');
        const end = moment( durationOfSession, 'HH:mm');
        const sessionEndTime = moment(beggin).add(end.hour(), 'hours').add(end.minute(), 'minutes');

        const SessionsOnDay = listSessionTime
            .filter(sessionArray => sessionArray === session)
            .filter(sessionArray  => sessionArray .client.active === true)
            .filter(sessionArray  => sessionArray .dayOfSession === dayOfWeek)
            

        for (const session of SessionsOnDay) {
            const sessionBeggin = moment(session.timeOfSession, 'HH:mm');
            const timeOfSession= moment(session.durationOfSession, 'HH:mm');
            const sessionEnd = moment(timeOfSession).add(timeOfSession.hour(), 'hours').add(timeOfSession.minute(), 'minutes');

            if (beggin.isBefore(sessionEnd) && sessionEndTime.isAfter(sessionBeggin)) {
                return session.client.name;
            }
        }

        return false;
    };


    const handleSubmit = (e) => {
        e.preventDefault()



        if(!checkIfTimeConflict(newDayOfSession,sessionDaysArray,newTimeOfSession,newSessionDuration)){

        }

    }


  return (
    <div>
        <from>
            <label>Dia da Sessão:</label>
            <select value={newDayOfSession} onChange={handleNewDayOfSessionChange}>
                    <option value="">Selecione o dia da sessão </option>
                    <option value="SEGUNDA">Segunda-feira</option>
                    <option value="TERÇA">Terça-feira</option>
                    <option value="QUARTA">Quarta-feira</option>
                    <option value="QUINTA">Quinta-feira</option>
                    <option value="SEXTA">Sexta-feira</option>
                    <option value="SABADO">Sabado</option>
                    <option value="DOMINGO">Domingo</option>
            </select>
            <label>Horario da sessão: </label>
            <input type='text' value={newTimeOfSession} onChange={(event) => handleTimeOfSessionChange(event.target.value)}/>
            <label>Tempo da sessão:</label>
            <input type='text' value={newSessionDuration} onChange={(event) => handleSessionDurationChange(event.target.value)}/>
            <label>Bisemanal</label> 
            <input type='checkbox' value={!newEveryWeek} onChange={handleEveryWeekChange}/>
        </from> 
    </div>
  )
}

export default PutSession