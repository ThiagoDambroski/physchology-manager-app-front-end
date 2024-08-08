import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';
import 'react-datepicker/dist/react-datepicker.css';
import apiRequestPostReturn from '../ApiRequestPostReturn';
import apiRequest from '../ApiRequest';


function ClientRegistration({limitTimeOfSession,limitDurationOfSession}) {

    const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"

    const API_POST_NEW_CLIENT = "http://localhost:8080/client/post"

    const API_POST_NEW_CLIENT_SESSION_DAYS = "http://localhost:8080/sessionsDays/post"

    const API_POST_NEW_PAGAMENT="http://localhost:8080/pagament/post"

    const isDateFormat = (dateString) => {
        const brazilianDateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return brazilianDateRegex.test(dateString);
      };

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

    const [email,setEmail] = useState(null)

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const [cpf,setCpf] = useState(null)

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


      
    const [address,setAddress] = useState(null)
    
      const handleAddressChange = (event) => {
        const value = event.target.value;
        setAddress(value);
      };


    const [telephone,setTelephone] = useState(null) 

    const handleTelephoneChange = (input) => {
        const filteredInput = input.replace(/[^0-9()\-\s]/g, ''); 
        setTelephone(filteredInput);

    }

    const [clientPayOnDay,setClientPayOnDay] = useState(false)

    const handleClientPayOnDayChange = (event) => {
        setErroSubmit(null)
        setClientPayOnDay(event.target.checked)
    }

    const [registerSession,setRegisterSession] = useState(false)

    const handleRegisterSessionChange = (event) => {
        setRegisterSession(event.target.checked)
    }

    const [payDay, setPayDay] = useState(1);

    const handlePayDayChange = (event) => {
        let day = parseInt(event.target.value); 
    
        if (isNaN(day)) { 
            day = null; 
        } else if (day > 30) {
            day = 30;
        } else if (day <= 0) {
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

    const [payDate,setPayDate] = useState(null)


    const handlePayDateChange = (date) => {
        setPayDate(date)
    }
    
    const [pagamentValue,setPagamentValue] = useState(null)

    const handlePagamentValueChange = (e) => {
        let day = parseInt(e.target.value); 
    
        if (isNaN(day)) { 
            day = null; 
        } else if (day <= 0) {
            day = 1;
        }
        
        setPagamentValue(day);
    }

    const [pagamentDelay,setPagamentDelay] = useState(1)

    const handlePagamentDelay = (e) => {
        let day = parseInt(e.target.value); 
    
        if (isNaN(day)) { 
            day = null; 
        } else if (day > 30) {
            day = 30;
        } else if (day <= 0) {
            day = 1;
        }
        
        setPagamentDelay(day);
    }

    const [tagsPagamentToggle,setTagsPagamentToggle] = useState(false)

    const handleTagsPagamentToggle = (event) => {
      setTagsPagamentToggle(event.target.checked)
    }

    const [tagsPagamentInput,setTagsPagamentInput] = useState('')

    const handleTagsPagamentInput = (event) => {
      setTagsPagamentInput(event.target.value)
    }

    const moment = require('moment');

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
    
    const nameValidation = name === '' ? true : false

    const payDayValidation = payDay === null ? true : false

    const sessionDayValidation = sessionDay === '' ? true : false

    const timeOfSessionValidation = ( timeOfSession === '' || timeOfSession.length < 5  ) ? true : false

    const durationOfSessionValidation = (durationOfSession === '' || durationOfSession.length < 5) ? true : false

    const payDateValidation = payDate === null ? true : false

    const pagamentValueValidation = pagamentValue === null ? true : false

    const delayOnPagamentValidation = pagamentDelay === null ? true : false

    const tagsValidation = (tagsPagamentToggle && tagsPagamentInput.length === 0)  ? true : false


    const isNotSubmittable = clientPayOnDay ?  
    (registerPagament ? (payDateValidation ||  pagamentValueValidation || delayOnPagamentValidation ||tagsValidation ) : false) || (nameValidation) 
    : 
    (nameValidation) || (payDayValidation) || (sessionDayValidation) || timeOfSessionValidation || durationOfSessionValidation  || (registerPagament ? ( payDateValidation ||  pagamentValueValidation || delayOnPagamentValidation ||tagsValidation ) : false) 

    const handleSubmit = async (e) => {
        e.preventDefault()

        //check if time has conflict
        if(clientPayOnDay || !checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck)){

            //Post new client
            const parsedBirthDate = birthDate ?  new Date(birthDate) : null;
            const newClient = {
                name:name,
                birthDate: parsedBirthDate,
                email:email,
                cpf:cpf,
                address:address,
                telephone:telephone,
                payday:payDay === 0 ? 1 : payDay,
                entranceDate:new Date(),
                clientPayOnDay:clientPayOnDay
                
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
              if(!clientPayOnDay){
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
              }
              

              if(registerPagament){
                //Post new Pagament
                const parsedPagamentDate = new Date(payDate);
                const newPagament = {
                    payDate:parsedPagamentDate,
                    value:pagamentValue,
                    delay: delayOnPagament ? pagamentDelay : 0,
                    pagamentTags:tagsPagamentInput
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
              window.location.reload();
            
        }else{
            setErroSubmit('Conflito com o horario de ' + checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck))
        }

        
        


    }

    return (
        <>
            <form onSubmit={handleSubmit} className='client-registration-form'>
                <div className='client-registration-form-h2'>
                    <h2>Informações do cliente </h2>
                </div>
                
                <div className='client-registration-div'>
                    <span className={ nameValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                    <label>Nome Completo: </label>
                    <input type='text' value={name} onChange={handleNameChange} className='put-client-name-input'/>
                </div>
                <div className='client-registration-div'>
                    <label>Data de aniversário: </label>
                    <DatePicker
                        selected={birthDate}
                        onChange={handleBirthDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className='add-pagament-form-div-input'
                    />
                </div>
                <div className='client-registration-div'>
                    <label>Email: </label>
                    <input type='text' value={email} onChange={handleEmailChange} className='put-client-name-input'/>
                </div>
                <div className='client-registration-div'>
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
                <div className='client-registration-div'>
                    <label>Cliente pagamento no ato</label>
                    <input type='checkbox' value={clientPayOnDay} onChange={handleClientPayOnDayChange} className='client-registration-check'/>
                </div>
                {!clientPayOnDay &&
                    <>
                       <div className='client-registration-div'>
                            <span className={ payDayValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                            <label>Dia de pagamento: </label>
                            <input type='number' value={payDay} onChange={handlePayDayChange}  className='add-pagament-form-div-input-delay'/>
                        </div>
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
                {/*clientPayOnDay &&
                    <>
                    <div className='client-registration-div'>
                        <label>Registrar sessão</label>
                        <input type='checkbox' value={registerSession} onChange={handleRegisterSessionChange} className='client-registration-check'/>
                    </div>
                    {registerSession &&
                        <>
                        <div className='client-registration-form-h2'>
                            <h2>Informaçoes da sessão </h2>
                        </div>
                        </>  
                    }
                    </>
                */}
                
                <div className='client-registration-div'>
                    <label>Registrar Pagamento</label>
                    <input type='checkbox' value={registerPagament} onChange={handlerRegisterPagament} className='client-registration-check'/>
                </div>
                

                {registerPagament && 
                <div className='client-registration-pagament'>
                    <div className='client-registration-form-h2'>
                        <h2>Informações do pagamento</h2>
                    </div>
                    <div className='client-registration-div'>
                        <span className={ payDateValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                        <label>Data do pagamento: </label>
                            <DatePicker
                                selected={payDate}
                                onChange={handlePayDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                maxDate={new Date()}
                                className='add-pagament-form-div-input'
                            />
                    </div>
                    <div className='client-registration-div'>
                        <span className={ pagamentValueValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                        <label>Valor do pagamento: </label>
                        <input type='number'value={pagamentValue} onChange={handlePagamentValueChange} className='client-registration-time'/>
                    </div>
                    <div className='client-registration-div'>
                        
                        <label>Atraso no pagamento: </label>
                        <input type='checkbox' value={delayOnPagament} onChange={handleDelayOnPagament} className='client-registration-check'/>
                    </div>
                    
                    {delayOnPagament &&
                        <div className='client-registration-div'>
                            <span className={ delayOnPagamentValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                            <label>Dias de atraso: </label>
                            <input type='number'value={pagamentDelay} onChange={handlePagamentDelay}  className='add-pagament-form-div-input-delay'/>
                        </div> 
                    }
                    <div className='client-registration-div'>
                            <div className='client-registration-div-center'>
                                <label>Adicionar Tags: </label>
                                <input type='checkbox' value={tagsPagamentToggle} onChange={handleTagsPagamentToggle} className='client-registration-check'/>
                            </div>
  
                            {tagsPagamentToggle === true && 
                            <div style={{marginTop:'5px'}}>
                                <span className={ tagsValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                                <input type='text' value={tagsPagamentInput} onChange={handleTagsPagamentInput} className='client-registration-tags-input'/>
                            </div>
                            }
                    </div>
                </div>
                }
                {erroSubmit && <p style={{color:'red'}}>{erroSubmit}</p>}
                <button type='submit' className='client-registration-button' disabled={isNotSubmittable}>Registrar Cliente </button>
                <span className='necessary-input-missing'>* Não preenchido</span>
                <span className='necessary-input-complete'>*  preenchido</span>
            </form>
        </>
    );
}


export default ClientRegistration;
