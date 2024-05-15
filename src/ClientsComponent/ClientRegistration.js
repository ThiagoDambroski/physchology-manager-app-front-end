import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiRequestPostReturn from '../ApiRequestPostReturn';
import apiRequest from '../ApiRequest';


function ClientRegistration() {

    const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"

    const API_POST_NEW_CLIENT = "http://localhost:8080/client/post"

    const API_POST_NEW_CLIENT_SESSION_DAYS = "http://localhost:8080/sessionsDays/post"

    const API_POST_NEW_PAGAMENT="http://localhost:8080/pagament/post"

    const [sessionDaysArray,setSessionDaysArray] = useState([])

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

    const [erroSubmit,setErroSubmit] = useState()

    const [canSubmit,setCanSubmit] = useState()

    const [name, setName] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const [birthDate, setBirthDate] = useState(null);

    const handleBirthDateChange = (date) => {
        setBirthDate(date);
    };

    const [payDay, setPayDay] = useState();

    const handlePayDayChange = (event) => {
        let day = parseInt(event.target.value); 
    
        if (isNaN(day)) { 
            day = 1; 
        } else if (day > 30) {
            day = 30;
        } else if (day < 0) {
            day = 1;
        }
        
        setPayDay(day);
    };

    /* session useStates */

    const [sessionDay, setSessionDay] = useState('');

    const handleSessionDayChange = (event) => {
        setSessionDay(event.target.value);
    };

    const [registerPagament, setRegisterPagament] = useState(false);

    const handlerRegisterPagament = (event) => {
        setRegisterPagament(event.target.checked);
    };

    const [delayOnPagament, setDelayOnPagament] = useState(false);

    const handleDelayOnPagament = (event) => {
        setDelayOnPagament(event.target.checked);
    };

    const [timeOfSession, setTimeOfSession] = useState('');

    const handleTimeOfSessionChange = (input) => {
        
        const numericValue = input.replace(/\D/g,"");

        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                if(min > 59){
                    setTimeOfSession(numericValue.slice(0, 2) + ":" +  '59')
                }else{
                    setTimeOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
                
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                if (hours > 23) {
                    setTimeOfSession('23');
                } else {
                    setTimeOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
            } else {
                setTimeOfSession(numericValue);
            }
        }
    };

    const [durationOfSession,setDurationOfSession] = useState()

    const handleDurationOfSessionChange = (input) => {
        const numericValue = input.replace(/\D/g,"");

        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                if(min > 59){
                    setDurationOfSession(numericValue.slice(0, 2) + ":" +  '59')
                }else{
                    setDurationOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
                
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                if (hours > 23) {
                    setDurationOfSession('23');
                } else {
                    setDurationOfSession(numericValue.slice(0, 2) + ":" + numericValue.slice(2));
                }
            } else {
                setDurationOfSession(numericValue);
            }
        }

    }

    const [bisemanalCheck,setBisemanalCheck] = useState(false)

    const handleBisemanalCheckChange = (e) => {
        setBisemanalCheck(e.target.checked)
    }

    const [payDate,setPayDate] = useState()

    const handlePayDateChange = (date) => {
        setPayDate(date)
    }
    
    const [pagamentValue,setPagamentValue] = useState()

    const handlePagamentValueChange = (e) => {
        setPagamentValue(e.target.value)
    }

    const [pagamentDelay,setPagamentDelay] = useState(null)

    const handlePagamentDelay = (e) => {
        setPagamentDelay(e.targer.value)
    }

    const moment = require('moment');

    const checkIfTimeConflict = (dayOfWeek,listSessionTime, timeOfSession, durationOfSession) => {
      
            const beggin = moment(timeOfSession, 'HH:mm');
            const end = moment( durationOfSession, 'HH:mm');
            const sessionEndTime = moment(beggin).add(end.hour(), 'hours').add(end.minute(), 'minutes');
    
            const SessionsOnDay = listSessionTime
                .filter(session => session.client.active === true)
                .filter(session => session.dayOfSession === dayOfWeek)
                
    
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
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        //check if time has conflict
        if(!checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession)){

            //Post new client
            const parsedBirthDate = new Date(birthDate);
            const newClient = {
                name:name,
                birthDate: parsedBirthDate,
                payday:payDay === 0 ? 1 : payDay
            }
            const postOptions = {
                method: 'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body: JSON.stringify(newClient)
              }
            
              const resultClient = await apiRequestPostReturn(API_POST_NEW_CLIENT,postOptions)

              const newClientId = resultClient.clientId
            

              //Post new Client Session Days

              const newClientSessionDays = {
                dayOfSession:sessionDay,
                timeOfSession:timeOfSession,
                durationOfSession:durationOfSession,
                everyWeek: bisemanalCheck ? false : true
              }

              const postOptionsClientSessionDays = {
                method: 'POST',
                headers: {
                  'Content-Type':'application/json'
                },
                body: JSON.stringify(newClientSessionDays)
              }
            
              const urlSessionDays = `${API_POST_NEW_CLIENT_SESSION_DAYS}/${newClientId}`

              const resultSessionDays = await apiRequest(urlSessionDays,postOptionsClientSessionDays)

              if(resultSessionDays){
                setErroSubmit('Error: ' + resultSessionDays)
              }

              if(registerPagament){
                //Post new Pagament
                const parsedPagamentDate = new Date(payDate);
                const newPagament = {
                    payDate:parsedPagamentDate,
                    value:pagamentValue,
                    delay: delayOnPagament ? pagamentDelay : 0
                }
                const postOptionsPagament = {
                    method: 'POST',
                    headers: {
                      'Content-Type':'application/json'
                    },
                    body: JSON.stringify(newPagament)
                  }
                  const urlPagament = `${API_POST_NEW_PAGAMENT}/${newClientId}`

                  const resultPagament= await apiRequest(urlPagament,postOptionsPagament)
    
                  if(resultPagament){
                    setErroSubmit('Error: ' + resultPagament)
                  }



              }
              

              

            
        }else{
            setErroSubmit('Conflito com o horario de ' + checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession))
        }

        
        window.location.reload();


    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <p>Informaçoes do cliente: </p>
                <label>Nome Completo: </label>
                <input type='text' value={name} onChange={handleNameChange}/>
                <label>Data de nascimento: </label>
                <DatePicker
                    selected={birthDate}
                    onChange={handleBirthDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                />
                <label>Dia de pagamento: </label>
                <input type='number' value={payDay} onChange={handlePayDayChange}/>
                <p>Informaçoes da sessão: </p>
                <select value={sessionDay} onChange={handleSessionDayChange}>
                    <option value="">Selecione o dia da sessão </option>
                    <option value="SEGUNDA">Segunda-feira</option>
                    <option value="TERÇA">Terça-feira</option>
                    <option value="QUARTA">Quarta-feira</option>
                    <option value="QUINTA">Quinta-feira</option>
                    <option value="SEXTA">Sexta-feira</option>
                    <option value="SABADO">Sabado</option>
                    <option value="DOMINGO">Domingo</option>
                </select>
                <label>Horario da sesão: </label>
                <input type='text' value={timeOfSession} onChange={(e) => handleTimeOfSessionChange(e.target.value)}/>
                <label>Tempo da sessão: </label>
                <input type='text' value={durationOfSession} onChange={(e) => handleDurationOfSessionChange(e.target.value)}/>
                <label>Sessão bisemanal</label>
                <input type='checkbox' value={bisemanalCheck} onChange={handleBisemanalCheckChange}/>
                <br/>
                <br/>
                <br/>
                <label>Registrar Pagamento</label>
                <input type='checkbox' value={registerPagament} onChange={handlerRegisterPagament}/>

                {registerPagament && 
                <div>
                    <label>Data do pagamento: </label>
                    <DatePicker
                    selected={payDate}
                    onChange={handlePayDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                />
                    <label>Valor do pagamento</label>
                    <input type='number'value={pagamentValue} onChange={handlePagamentValueChange}/>
                    <label>Atraso no pagamento</label>
                    <input type='checkbox' value={delayOnPagament} onChange={handleDelayOnPagament}/>
                    {delayOnPagament &&
                        <>
                            <label>Dias de atraso</label>
                            <input type='number'value={pagamentDelay} onChange={handlePagamentDelay}/>
                        </> 
                    }
                </div>
                }
                <button type='submit'>Registrar Cliente </button>
            </form>
        </>
    );
}


export default ClientRegistration;
