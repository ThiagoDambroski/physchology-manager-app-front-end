import React, { useEffect, useState } from 'react'
import apiRequest from '../../ApiRequest';
import './MenuClient.css'

function PutSession({session,limitTimeOfSession,limitDurationOfSession}) {
    const moment = require('moment');
    const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"
    const API_PUT_SESSION_DAY = "http://localhost:8080/sessionsDays/put/" + session.clientSessionDaysId


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

    const handleNewDayOfSessionChange = (event) => {
        setNewDayOfSession(event.target.value)
    }


    const [newTimeOfSession,setNewTimeOfSession] = useState(session.timeOfSession)

    const handleTimeOfSessionChange = (input) => {
        const [limitHour, limitMin] = limitTimeOfSession.split(':').map(Number);
       
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setNewTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setNewTimeOfSession(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setNewTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setNewTimeOfSession(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setNewTimeOfSession(limitHour.toString().padStart(2, '0'));
                } else {
                    setNewTimeOfSession(numericValue);
                }
            }
        }
    }

    const [newSessionDuration,setNewSessionDuration] = useState(session.durationOfSession)

    const handleSessionDurationChange = (input) => {
        const [limitHour, limitMin] = limitDurationOfSession.split(':').map(Number);
       
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setNewSessionDuration(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setNewSessionDuration(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setNewSessionDuration(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setNewSessionDuration(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setNewSessionDuration(limitHour.toString().padStart(2, '0'));
                } else {
                    setNewSessionDuration(numericValue);
                }
            }
        }
    }

    const [newBisemanalCheck, setNewBisemanalCheck] = useState(!session.everyWeek)


    const handleNewBisemanalCheck = (event) => {
        setNewBisemanalCheck(event.target.checked)
    }



    const checkIfTimeConflict = (dayOfWeek, listSessionTime, timeOfSession, durationOfSession,bisemanal) => {
        let bisemanalCount = 0
        const beggin = moment(timeOfSession, 'HH:mm');
        const duration = moment.duration(durationOfSession);
        const endTime = moment(beggin).add(duration);
    
        const SessionsOnDay = listSessionTime
            .filter(session => session.client.active === true)
            .filter(session => session.dayOfSession === dayOfWeek);

        
    
        for (const sessionCheck of SessionsOnDay) {
            if(session.clientSessionDaysId === sessionCheck.clientSessionDaysId){
                continue
            }
            const sessionBeggin = moment(sessionCheck.timeOfSession, 'HH:mm');
            const sessionDuration = moment.duration(sessionCheck.durationOfSession);
            const sessionEnd = moment(sessionBeggin).add(sessionDuration);
    
            if (beggin.isBefore(sessionEnd) && endTime.isAfter(sessionBeggin)) {
                if(!bisemanal || sessionCheck.everyWeek){
                    return sessionCheck.client.name;
                }else{
                    bisemanalCount++;
                }
                
            }
        }

        if(bisemanalCount >=2 ){
            return 'Dois Clientes Bisemanais'
        }
    
        return false;
    };

    const [erroOnSubmit,setErroOnSubmit] = useState()



    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!checkIfTimeConflict(newDayOfSession,sessionDaysArray,newTimeOfSession,newSessionDuration,newBisemanalCheck)){
            setErroOnSubmit(null)
    
            //newSessionObj
            const newSessionObj = {
                dayOfSession: newDayOfSession,
                timeOfSession: newTimeOfSession,
                durationOfSession:newSessionDuration,
                everyWeek: newBisemanalCheck ? false : true
            }

            const putOptions = {
                method: 'PUT',
                headers: {
                  'Content-Type':'application/json'
                },
                body: JSON.stringify(newSessionObj)
              }
              const resultSessionDays = await apiRequest(API_PUT_SESSION_DAY,putOptions)

    
            window.location.reload();



        }else{
            setErroOnSubmit('Conflito com o horario de ' + checkIfTimeConflict(newDayOfSession,sessionDaysArray,newTimeOfSession,newSessionDuration,newBisemanalCheck))
        }

    }

    
    const sessionDayValidation = (newDayOfSession === '') ? true : false

    const timeOfSessionValidation = ( newTimeOfSession === '' || newTimeOfSession.length < 5  ) ? true : false

    const durationOfSessionValidation = (newSessionDuration === '' || newSessionDuration.length < 5) ? true : false


    const isNotSubmittable = (sessionDayValidation) || (timeOfSessionValidation ) || (durationOfSessionValidation) 

  return (
    <div className='put-session-page'>
        
        <form onSubmit={handleSubmit} className='put-session-form'>
            <div className='put-session-form-div'>
                <span className={ sessionDayValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                <label>Dia da Sessão: </label>
                <select value={newDayOfSession} onChange={handleNewDayOfSessionChange} >
                        <option value="">Selecione o dia </option>
                        <option value="SEGUNDA">Segunda-feira</option>
                        <option value="TERÇA">Terça-feira</option>
                        <option value="QUARTA">Quarta-feira</option>
                        <option value="QUINTA">Quinta-feira</option>
                        <option value="SEXTA">Sexta-feira</option>
                        <option value="SABADO">Sabado</option>
                        <option value="DOMINGO">Domingo</option>
                </select>
            </div>
            <div className='put-session-form-div' >   
                <span className={ timeOfSessionValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                <label>Horario da sessão: </label>
                <input type='text' value={newTimeOfSession} onChange={(event) => handleTimeOfSessionChange(event.target.value)} className='put-session-form-div-input'/>
            </div>
            
            <div className='put-session-form-div' >
                <span className={ durationOfSessionValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                <label>Tempo da sessão: </label>
                <input type='text' value={newSessionDuration} onChange={(event) => handleSessionDurationChange(event.target.value)} className='put-session-form-div-input'/>
            </div>
            <div className='put-session-form-div' >
                <label>Bisemanal</label> 
                <input type='checkbox' checked={newBisemanalCheck} onChange={handleNewBisemanalCheck} className='client-registration-check'/>
            </div>
            {erroOnSubmit && <p style={{color:'red'}}>{erroOnSubmit}</p>}
            <button type='submit' disabled={isNotSubmittable} className='put-session-button'>Salvar alteraçoes </button>
            <span className='necessary-input-missing'>* Não preenchido</span>
            <span className='necessary-input-complete'>*  preenchido</span>
        </form> 
    </div>
  )
}

export default PutSession