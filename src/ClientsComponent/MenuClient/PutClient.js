import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MenuClient.css'
import apiRequest from '../../ApiRequest';
import backArrow from '../../assets/compact-left-arrow.png'
import moment from 'moment';


function PutClient({client,limitTimeOfSession,limitDurationOfSession,setCurrentPage}) {

    const API_PUT_CLIENT = "http://localhost:8080/client/put/" + client.clientId

    const API_DELETE_SESSION_DAYS = "http://localhost:8080/sessionsDays/delete"

    const API_POST_NEW_CLIENT_SESSION_DAYS = "http://localhost:8080/sessionsDays/post"

    const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"


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

    const [newClientName,setNewClientName] = useState(client.name)

    const handleNewClientName = (event) => {
        setNewClientName(event.target.value)
    }

    const [newDateEntrace,setNewDateEntrace] = useState(client.entranceDate)

    const handleNewDateEntraceChange = (date) => {
        setNewDateEntrace(date)
    }


    const [newClientBirth,setNewClientBirth] = useState(client.birthDate)

    const handleClientBirthDateChange = (date) => {
        setNewClientBirth(date)
    }

    const [cpf,setCpf] = useState(client.cpf)

    const formatCpf = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
        if (match) {
          return `${match[1]}${match[2] ? '.' : ''}${match[2]}${match[3] ? '.' : ''}${match[3]}${match[4] ? '-' : ''}${match[4]}`;
        }
        return value;
      };
    
      const handleCpfChange = (event) => {
        const value = event.target.value;
        setCpf(formatCpf(value));
      };


      
    const [address,setAddress] = useState(client.address)
    
      const handleAddressChange = (event) => {
        const value = event.target.value;
        setAddress(value);
      };
    const [email,setEmail] = useState(client.email)

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const [telephone,setTelephone] = useState(client.telephone) 

    const handleTelephoneChange = (input) => {
        const filteredInput = input.replace(/[^0-9()\-\s]/g, ''); 
        setTelephone(filteredInput);

    }
    const [newClientPayOnDay,setNewClientPayOnDay] = useState(client.clientPayOnDay)

    const handleNewClientPayOnDayChange = (event) => {
        setNewClientPayOnDay(event.target.checked)
    }

    const [ newClientPayday,setNewClientPayday] = useState(client.payday)

    const handleClientPaydayChange = (event) => {
        let day = parseInt(event.target.value); 
    
        if (isNaN(day)) { 
            day = null; 
        } else if (day > 30) {
            day = 30;
        } else if (day <= 0) {
            day = 1;
        }
        
        setNewClientPayday(day);
    }

    

    /*Session informations*/ 
    const [sessionDay, setSessionDay] = useState('');

    const handleSessionDayChange = (event) => {
        setSessionDay(event.target.value);
    };
    const [timeOfSession, setTimeOfSession] = useState('');

    const handleTimeOfSessionChange = (input) => {
        const [limitHour, limitMin] = limitTimeOfSession.split(':').map(Number);
       
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setTimeOfSession(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setTimeOfSession(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setTimeOfSession(limitHour.toString().padStart(2, '0'));
                } else {
                    setTimeOfSession(numericValue);
                }
            }
        }
    }

    const [durationOfSession,setDurationOfSession] = useState('')

    const handleDurationOfSessionChange = (input) => {
        const [limitHour, limitMin] = limitDurationOfSession.split(':').map(Number);
       
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setDurationOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setDurationOfSession(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setDurationOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setDurationOfSession(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setDurationOfSession(limitHour.toString().padStart(2, '0'));
                } else {
                    setDurationOfSession(numericValue);
                }
            }
        }
    }


    const [bisemanalCheck,setBisemanalCheck] = useState(false)

    const handleBisemanalCheckChange = (e) => {
        setBisemanalCheck(e.target.checked)
    }

    const [erroSubmit,setErroSubmit] = useState(null)

    const checkIfTimeConflict = (dayOfWeek, listSessionTime, timeOfSession, durationOfSession,bisemanal) => {
        let bisemanalCount = 0
        const beggin = moment(timeOfSession, 'HH:mm');
        const duration = moment.duration(durationOfSession);
        const endTime = moment(beggin).add(duration);
    
        const SessionsOnDay = listSessionTime
            .filter(session => session.client.active === true)
            .filter(session => session.dayOfSession === dayOfWeek);

        
    
        for (const session of SessionsOnDay) {
            const sessionBeggin = moment(session.timeOfSession, 'HH:mm');
            const sessionDuration = moment.duration(session.durationOfSession);
            const sessionEnd = moment(sessionBeggin).add(sessionDuration);
    
            if (beggin.isBefore(sessionEnd) && endTime.isAfter(sessionBeggin)) {
                if(!bisemanal || session.everyWeek){
                    return session.client.name;
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


   const handleSubmit = async (e) => {

    e.preventDefault()

    
     //update client
    if(!client.clientPayOnDay && newClientPayOnDay && client.daysOfSession.length > 0){
        const deleteOptions = {
            method: 'DELETE'
          };
        const deleteSessionDayUrl = `${API_DELETE_SESSION_DAYS}/${client.daysOfSession[0].clientSessionDaysId}`
        
        const result = await apiRequest(deleteSessionDayUrl,deleteOptions)
     }

     if(client.clientPayOnDay && !newClientPayOnDay){
        if(checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck)){
            setErroSubmit('Conflito com o horario de ' + checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck))
            return
        }else{
            setErroSubmit(null)
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
            
              const urlSessionDays = `${API_POST_NEW_CLIENT_SESSION_DAYS}/${client.clientId}`

              const resultSessionDays = await apiRequest(urlSessionDays,postOptionsClientSessionDays)
        }
     }

     const parsedBirthDate = newClientBirth ?  new Date(newClientBirth) : null;

     const updateClient = {
        name:newClientName,
        entranceDate:newDateEntrace,
        birthDate: parsedBirthDate,
        email:email,
        cpf:cpf,
        address:address,
        telephone:telephone,
        payday:newClientPayday === 0 ? 1 : newClientPayday,
        clientPayOnDay:newClientPayOnDay,
        active:client.active
    }
    const putOptions = {
        method: 'PUT',
        headers: {
        'Content-Type':'application/json'
        },
        body: JSON.stringify(updateClient)
    }
 
    const resultClient = await apiRequest(API_PUT_CLIENT,putOptions)

    
    /*need to make the others two cases */
     

    
       window.location.reload();

    
   }

   const registerDateValidation = newDateEntrace === null ? true : false

   const nameValidation = newClientName === '' ? true : false

   const payDayValidation = newClientPayday === null ? true : false

   const sessionDayValidation = (sessionDay === '') ? true : false

   const timeOfSessionValidation = (timeOfSession === '') || (timeOfSession.length < 5 ) ? true : false

   const durationOfSessionValidation = (durationOfSession === '')  || (durationOfSession.length < 5) ? true : false
   
   const isNotSubmittable = registerDateValidation ||  nameValidation ||  payDayValidation || (client.clientPayOnDay && !newClientPayOnDay)  ? (sessionDayValidation) || (timeOfSessionValidation) || (durationOfSessionValidation)  : false

  return (
    <>
        <img src={backArrow} onClick={() => setCurrentPage('Menu')} className='arrow-go-back'/>

        <div className='put-client-page'>
        
        <form onSubmit={handleSubmit} className='put-client-form'>
            <div className='put-client-form-div'>
                <span className={ nameValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                <label>Nome: </label>
                <input type='text '  value={newClientName} onChange={handleNewClientName} 
                className='put-client-name-input'/>
            </div>
            <div className='put-client-form-div'>
                <span className={ registerDateValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                <label>Data de registro: </label>
                <DatePicker
                        selected={newDateEntrace}
                        onChange={handleNewDateEntraceChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className='add-pagament-form-div-input'
                />
            </div>
            <div className='put-client-form-div'>
                <label>Data de nascimento: </label>
                <DatePicker
                        selected={newClientBirth}
                        onChange={handleClientBirthDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className='add-pagament-form-div-input'
                />
            </div>

            <div className='put-client-form-div'>
                    <label>Email: </label>
                    <input type='text' value={email} onChange={handleEmailChange} className='put-client-name-input'/>
                </div>
                <div className='put-client-form-div'>
                    <label>Telefone: </label>
                    <input type='text' value={telephone} onChange={(e) => handleTelephoneChange(e.target.value)} className='put-client-name-input'/>
                </div>
                <div className='client-registration-div'>
                    <label>CPF: </label>
                    <input type='text' value={cpf} onChange={handleCpfChange} maxLength={14} className='put-client-name-input'/>
                </div>
                <div className='client-registration-div'>
                    <label>Endereço: </label>
                    <input type='text' value={address} onChange={handleAddressChange} className='put-client-name-input'/>
                </div>

            <div className='put-client-form-div'>
                <label>Cliente pagamento no ato </label>
                <input type='checkbox' checked={newClientPayOnDay} onChange={handleNewClientPayOnDayChange} className='client-registration-check'/>
            </div>

            {!newClientPayOnDay && 
                <>
                    <div className='put-client-form-div'> 
                        <span className={ payDayValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                        <label>Dia de pagamento: </label>
                        <input type='number' value={newClientPayday} onChange={handleClientPaydayChange}
                        className='put-client-number-input'
                        />
                            
                    </div>
                    {client.clientPayOnDay && 
                        <>
                            <div className='client-registration-form-h2'>
                                <h2>Informações da sessão: </h2>
                            </div>
                            
                            <div className='client-registration-div'>
                                <span className={ sessionDayValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                                <label>Dia da sessão: </label>
                                <select value={sessionDay} onChange={handleSessionDayChange} className='client-registration-day-select'>
                                    <option value="">Selecione o dia </option>
                                    <option value="SEGUNDA">Segunda-feira</option>
                                    <option value="TERÇA">Terça-feira</option>
                                    <option value="QUARTA">Quarta-feira</option>
                                    <option value="QUINTA">Quinta-feira</option>
                                    <option value="SEXTA">Sexta-feira</option>
                                    <option value="SABADO">Sábado</option>
                                    <option value="DOMINGO">Domingo</option>
                                </select>
                            </div>
                            <div className='client-registration-div'>
                                <span className={ timeOfSessionValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                                <label>Horário da sessão: </label>
                                <input type='text' value={timeOfSession} onChange={(e) => handleTimeOfSessionChange(e.target.value)} className='client-registration-time'/>
                            </div>
                            
                            <div className='client-registration-div'>
                                <span className={ durationOfSessionValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                                <label>Tempo da sessão: </label>
                                <input type='text' value={durationOfSession} onChange={(e) => handleDurationOfSessionChange(e.target.value)} className='client-registration-time'/>
                            </div>
                            
                            <div className='client-registration-div'>
                                <label>Sessão bisemanal</label>
                                <input type='checkbox' value={bisemanalCheck} onChange={handleBisemanalCheckChange} className='client-registration-check'/>
                            </div>
                        </>
                    }
                </>
                
            }
            
            {erroSubmit && <p style={{color:'red'}}>{erroSubmit}</p>}
            <button type='submit' disabled={isNotSubmittable} onClick={(e) => { e.stopPropagation()}} className='put-client-button-save'>Salvar alterações</button>
            <span className='necessary-input-missing'>* Não preenchido</span>
            <span className='necessary-input-complete'>*  preenchido</span>
           
        </form>
        

        </div>
    </>
    
  )
}

export default PutClient