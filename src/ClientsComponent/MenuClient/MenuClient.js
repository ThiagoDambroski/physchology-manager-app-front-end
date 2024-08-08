import React, { useEffect, useState } from 'react';
import { format, differenceInDays, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './MenuClient.css'
import apiRequest from '../../ApiRequest';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import backArrow from '../../assets/compact-left-arrow.png'

function MenuClient({client,limitTimeOfSession,limitDurationOfSession,setCurrentPage}) {

  const API_PUT_ACTIVE_CHANGE_CLIENT = "http://localhost:8080/client/activeChange/" + client.clientId
  const API_DELETE_CLIENT = "http://localhost:8080/client/delete/" + client.clientId
  const API_POST_NEW_CLIENT_SESSION_DAYS = "http://localhost:8080/sessionsDays/post/" + client.clientId
  const API_POST_NEW_PAGAMENT="http://localhost:8080/pagament/post/" + client.clientId
  const API_GET_ALL_SESSIONS_DAYS = "http://localhost:8080/sessionsDays/getAll"

  const formatDateAndDifference = (date) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    const today = new Date();
    const daysDifference = differenceInDays(today, new Date(date));
    const yearsDifference = differenceInYears(today, new Date(date));
    const remainingDays = daysDifference - (yearsDifference * 365);
  
    if (yearsDifference > 0) {
      return `${formattedDate} - ${yearsDifference} ${yearsDifference != 1  ? 'anos' : 'ano'} e ${remainingDays} ${remainingDays > 1 ? 'dias' : 'dia'}`;
    } else {
      return  `${formattedDate} - ${daysDifference} ${daysDifference != 1 ? 'dias' : 'dia'}`;
    }
  
   
  };

  const formatBirthdateAndAge = (birthdate) => {
    if(birthdate === null){
      return 'Sem registro'
    }
    const formattedDate = format(birthdate, 'dd/MM/yyyy', { locale: ptBR });
    const today = new Date();
    const age = differenceInYears(today, birthdate);
  
    const ageText = `${formattedDate} - ${age} ${age != 1 ? 'anos' : 'ano'}`;
  
    return ageText ;
  };

  const [menuClientPage,setMenuClientPage] = useState('menu') 

  const handleMenuClientChange = (input) => {
    setMenuClientPage(input)
  }

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

  const handleDisableOption = async (e) => {
    

    const putOptions = {
      method: 'PUT',
  }

  const resultClient = await apiRequest(API_PUT_ACTIVE_CHANGE_CLIENT,putOptions)
  window.location.reload();
  }

  const [confirmDelete,setConfirmDelete] = useState(false)

  const handleConfirmDeleteChange = (event) => {
    setConfirmDelete(event.target.checked)
  }
  const handleDeleteOption = async (e) => {
    const deleteOptions = {
      method: 'DELETE',
    }

   const resultClient = await apiRequest(API_DELETE_CLIENT,deleteOptions)
   window.location.reload();
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck)){
        const putOptions = {
          method: 'PUT',
      }
    
      const resultClient = await apiRequest(API_PUT_ACTIVE_CHANGE_CLIENT,putOptions)
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
      const resultSessionDays = await apiRequest(API_POST_NEW_CLIENT_SESSION_DAYS,postOptionsClientSessionDays)
      if(registerPagament){
        //Post new Pagament
        const parsedPagamentDate = new Date(payDate);
        const newPagament = {
            payDate:parsedPagamentDate,
            value:pagamentValue,
            delay: delayOnPagament ? pagamentDelay : 0,
            pagamentTags: tagsPagamentInput
        
        }
        const postOptionsPagament = {
            method: 'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(newPagament)
          }
          
  
          const resultPagament= await apiRequest(API_POST_NEW_PAGAMENT,postOptionsPagament)
          
  
          
      }
      window.location.reload();
    }else{
      setErroSubmit('Conflito com o horario de ' + checkIfTimeConflict(sessionDay,sessionDaysArray,timeOfSession,durationOfSession,bisemanalCheck))
    }
    

  }
  const sessionDayValidation = sessionDay === '' ? true : false

  const timeOfSessionValidation = ( timeOfSession === '' || timeOfSession.length < 5  ) ? true : false

  const durationOfSessionValidation = (durationOfSession === '' || durationOfSession.length < 5) ? true : false

  const payDateValidation = payDate === null ? true : false

  const pagamentValueValidation = pagamentValue === null ? true : false

  const delayOnPagamentValidation = pagamentDelay === null ? true : false

  const tagsValidation = (tagsPagamentToggle && tagsPagamentInput.length === 0)  ? true : false
  
  const isNotSubmittable = sessionDayValidation || (timeOfSessionValidation) || (durationOfSessionValidation) || (registerPagament ? (payDateValidation || pagamentValueValidation ||delayOnPagamentValidation || tagsValidation ) : false)

  return (
    <>
      {menuClientPage === 'menu'  && 
      <>
        <div className='menu-client-menu'>
          <h1 >{client.name}</h1>
          <span className='menu-client-informations'>Email: {client.email ? client.email : 'Sem registro'}</span>
          <span  className='menu-client-informations'>Telefone: {client.telephone ? client.telephone : 'Sem registro'} </span>
          <span  className='menu-client-informations'>Data de registro: {formatDateAndDifference(client.entranceDate)}</span>
          <span  className='menu-client-informations'>Data de aniversário: {formatBirthdateAndAge(client.birthDate)}</span>
          <span  className='menu-client-informations'>Endereço: {client.address ? client.address : 'Sem registro'}</span>
          <span  className='menu-client-informations'>CPF: {client.cpf ? client.cpf : 'Sem registro'}</span>
          <div className='menu-client-div-buttons'>
              <button onClick={() => setCurrentPage('PutClient')}>Alterar dados</button>
              <button onClick={() => setCurrentPage('SessionManager')}>Gerenciar sessões</button>
              <button onClick={() => setCurrentPage('PagamentManager')}>Gerenciar pagamentos</button>
              
          </div>
          {client.active ?
            <>
              <button onClick={() => handleDisableOption()} 
                  className= {`put-client-button-deactivated ${!client.active ? 'button-green' : 'button-red'}`}>
                  {client.active ? 'Desativar cliente' : 'Ativar cliente'}
              </button>
            </>
          :
            <>
            {client.clientPayOnDay  &&
              <>
              <button onClick={() => handleDisableOption()} 
                  className= {`put-client-button-deactivated ${!client.active ? 'button-green' : 'button-red'}`}>
                  {client.active ? 'Desativar Cliente' : 'Ativar Cliente'}
              </button>
              </>
            }
            {!client.clientPayOnDay && 
                <>
                  <button onClick={() => handleMenuClientChange('add-session')} 
                  className= {`put-client-button-deactivated ${!client.active ? 'button-green' : 'button-red'}`}>
                  {client.active ? 'Desativar Cliente' : 'Ativar Cliente'}
                  </button>
                </>
            }
            <button style={{marginTop:'5px'}} onClick={() => handleMenuClientChange('delete')} 
                  className= {`put-client-button-deactivated button-red`}>
                  Deletar
            </button>
            
            </>
          }
          

        </div>
      </>
      }
      {menuClientPage === 'add-session'  &&
        
        <>
        <img src={backArrow} className='arrow-go-back' onClick={() => handleMenuClientChange('menu')}/>
        <div className='menu-client-add-session'>
        <div className='client-registration-form-h2'>
                            <h2>Informaçoes da sessão: </h2>
                        </div>
          <form  className='put-session-form'  onSubmit={handleSubmit}>
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
                                  <option value="SABADO">Sabado</option>
                                  <option value="DOMINGO">Domingo</option>
                    </select>
            </div>
              <div className='client-registration-div'>
                  <span className={ timeOfSessionValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                  <label>Horario da sessão: </label>
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
            
          <div className='client-registration-div'>
                    <label>Registrar Pagamento</label>
                    <input type='checkbox' value={registerPagament} onChange={handlerRegisterPagament} className='client-registration-check'/>
                </div>
                

                {registerPagament && 
                <>
                <div className='client-registration-form-h2'>
                        <h2>Informaçoes do Pagamento </h2>
                    </div>
                    <div className='client-registration-pagament'>
                    
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
                </>
                
                }
                {erroSubmit && <p style={{color:'red'}}>{erroSubmit}</p>}
                <button type='submit' className='put-session-button' disabled={isNotSubmittable}>Salvar sessão </button>
                
          </form>
          
        </div>
        
        <div style={{display:'flex',flexDirection:'column'}}>
        <span className='necessary-input-missing'>* Não preenchido</span>
        <span className='necessary-input-complete'>*  preenchido</span>
        </div>
          
        </>
      }

      {menuClientPage === 'delete' &&
        <>
        <img src={backArrow} className='arrow-go-back' onClick={() => handleMenuClientChange('menu')}/>
        <div className='message-to-user-display'>
                <p >Atenção ! essa ação não tem volta</p>
                
         </div>
         <div className='menu-client-add-session'>
          
          <span style={{justifySelf:'center',color:'red'}}>Todas as sessões e pagamentos desse clientes serão deletados.</span>
          <div >
                        <label>Estou ciente que todos os dados desse cliente serão deletados: </label>
                        <input type='checkbox' value={confirmDelete} onChange={handleConfirmDeleteChange} />
          </div>
          <button style={{marginTop:'5px'}} onClick={() => handleDeleteOption()} 
                  className= {`put-client-button-deactivated button-red`} disabled={!confirmDelete}>
                  
                  Deletar: {client.name}
            </button>
         </div>
        
        </>
      }
    </>
    
    
  )
}

export default MenuClient