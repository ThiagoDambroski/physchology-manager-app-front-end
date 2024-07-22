import React, { useState } from 'react'
import apiRequest from '../ApiRequest';

function PutUserConfigurations({user}) {

    const API_PUT_USER = `http://localhost:8080/user/put/${user.userId}`

    const [name,setName] = useState(user.name)

    const handleNameChange  = (event) => {
        setName(event.target.value)
    }

    const [password,setPassword] = useState(user.password)

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const [limitTimeOfSession,setLimitTimeOfSession] = useState(user.limitTimeOfSession)

    const handleLimitTimeOfSessionChange = (input) => {
        
        const limitHour = 23; 
        const limitMin = 0; 
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setLimitTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setLimitTimeOfSession(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setLimitTimeOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setLimitTimeOfSession(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setLimitTimeOfSession(limitHour.toString().padStart(2, '0'));
                } else {
                    setLimitTimeOfSession(numericValue);
                }
            }
        }
    }

    const [limitDurationOfSession,setLimitDurationOfSession] = useState(user.limitDurationOfSession)

    const handleLimitDurationOfSessionChange = (input) => {
        
        const limitHour = 12; 
        const limitMin = 0; 
        const numericValue = input.replace(/\D/g,"");
    
        if (numericValue.length < 5) { 
            if (numericValue.length === 4) {
                const min = parseInt(numericValue.slice(2));
                const hours = parseInt(numericValue.slice(0, 2));
    
                if (hours > limitHour || (hours === limitHour && min > limitMin)) {
                    setLimitDurationOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedMin = min > 59 ? 59 : min;
                    setLimitDurationOfSession(hours.toString().padStart(2, '0') + ":" + limitedMin.toString().padStart(2, '0'));
                }
            } else if (numericValue.length > 2) {
                const hours = parseInt(numericValue.slice(0, 2));
                const minPart = numericValue.slice(2);
                if (hours > limitHour || (hours === limitHour && minPart > limitMin.toString())) {
                    setLimitDurationOfSession(limitHour.toString().padStart(2, '0') + ":" + limitMin.toString().padStart(2, '0'));
                } else {
                    const limitedHours = hours > 23 ? 23 : hours;
                    setLimitDurationOfSession(limitedHours.toString().padStart(2, '0') + ":" + minPart);
                }
            } else {
                const hours = parseInt(numericValue);
                if (hours > limitHour) {
                    setLimitDurationOfSession(limitHour.toString().padStart(2, '0'));
                } else {
                    setLimitDurationOfSession(numericValue);
                }
            }
        }
    }
    
    const [numberOfClientsPerPage,setNumberOfClientsPerPage] = useState(user.numberOfClientsPerPage)


    const handleNumberOfClientPerPageChange = (event) => {
        let number = parseInt(event.target.value); 
        if(number <=0){
            number = 1
        }
        if(number > 100 ){
            number = 100
        }      
        setNumberOfClientsPerPage(number)
    }

    const [numberOfSessionsPerPage,setNumberOfSessionsPerPage] = useState(user.numberOfSessionsPerPage)

    const handleNumberOfSessionPerPageChange = (e) => {
        let number = parseInt(e.target.value); 
        if(number <=0){
            number = 1
        }
        if(number > 100 ){
            number = 100
        }      
      setNumberOfSessionsPerPage(number)
    }

    const [numberOfPagamentsPerPage,setNumberOfPagamentsPerPage] = useState(user.numberOfPagamentsPerPage)

    const handleNumberOfPagamnetPerPageChange = (e) => {
        let number = parseInt(e.target.value); 
        if(number <=0){
            number = 1
        }
        if(number > 100 ){
            number = 100
        }      
      setNumberOfPagamentsPerPage(number)
    }
    
    const [numberOfPagamentsMonthPerPage,setNumberOfPagamentsMonthPerPage] = useState(user.numberOfPagamentsPerMonthPage)

    const handleNumberOfPagamentMonthPerPageChange = (e) => {
        let number = parseInt(e.target.value); 
        if(number <=0){
            number = 1
        }
        if(number > 100 ){
            number = 100
        }      
      setNumberOfPagamentsMonthPerPage(number)
    }
   
    const handleSubmit = async (e) => {
        e.preventDefault()

        const updateUser = {
           name:name,
           password:password,
           limitTimeOfSession:limitTimeOfSession,
           limitDurationOfSession:limitDurationOfSession,
           numberOfClientsPerPage:numberOfClientsPerPage,
           numberOfPagamentsPerPage:numberOfPagamentsPerPage,
           numberOfSessionsPerPage:numberOfSessionsPerPage,
           numberOfPagamentsPerMonthPage:numberOfPagamentsMonthPerPage
        }
        const putOptions = {
            method: 'PUT',
            headers: {
            'Content-Type':'application/json'
            },
            body: JSON.stringify(updateUser)
        }
     
        const resultUser = await apiRequest(API_PUT_USER,putOptions)
        window.location.reload();

    }

    const isNotSubmittable = name.length === 0 || password.length === 0 || limitTimeOfSession.length < 5 || limitDurationOfSession.length < 5

  return (
    <>
    <div className='client-title'>
            <h2 >  Configurações </h2>    
        </div>
        <div className='configurations-content'>
            <form onSubmit={handleSubmit} className='configurations-form'>
                <div className='configurations-form-div'>
                    <label>Nome de usuario: </label>
                    <input type='text' value={name} onChange={handleNameChange} className='put-client-name-input'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Senha: </label>
                    <input type='text' value={password} onChange={handlePasswordChange} className='put-client-name-input'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Limite do horário da sessão: </label>
                    <input type='text' value={limitTimeOfSession} onChange={(e) => handleLimitTimeOfSessionChange(e.target.value)} className='client-registration-time'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Limite do tempo da sessão: </label>
                    <input type='text' className='client-registration-time' value={limitDurationOfSession} onChange={(e) => handleLimitDurationOfSessionChange(e.target.value)}/>
                 </div>
                <div className='configurations-form-div'>
                    <label>Numero de clientes por pagina: </label>
                    <input type='number' value={numberOfClientsPerPage} onChange={handleNumberOfClientPerPageChange} className='add-pagament-form-div-input-delay'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Numero de sessões por pagina: </label>
                    <input type='number' value={numberOfSessionsPerPage} onChange={handleNumberOfSessionPerPageChange}  className='add-pagament-form-div-input-delay'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Numero de pagamentos por pagina: (pagamento individual): </label>
                    <input type='number' value={numberOfPagamentsPerPage} onChange={handleNumberOfPagamnetPerPageChange} className='add-pagament-form-div-input-delay'/>
                </div>
                <div className='configurations-form-div'>
                    <label>Numero de pagamentos por pagina (pagamento mensal): </label>
                    <input type='number' value={numberOfPagamentsMonthPerPage} onChange={handleNumberOfPagamentMonthPerPageChange} className='add-pagament-form-div-input-delay'/>
                </div>
                <button type='submit' className='client-registration-button' disabled={isNotSubmittable}>Salvar</button>
            </form>
        </div>
    </>
  )
}

export default PutUserConfigurations