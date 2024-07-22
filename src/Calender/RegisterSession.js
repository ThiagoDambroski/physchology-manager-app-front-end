import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calender.css'
import apiRequest from '../ApiRequest';
function RegisterSession({client,day,attend,fromMenu}) { 

    const API_POST_NEW_SESSION = "http://localhost:8080/sessions/post/" + client.clientId

    const API_POST_NEW_PAGAMENT = "http://localhost:8080/pagament/post/" + client.clientId

    const [sessionDate,setSessionDate] = useState(day)

    const handleSessionDateChange = (date) => {
        setSessionDate(date)
    }

    const [textInput,setTextInput] = useState("")

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value)
    } 

    const [tagsToggle,setTagsToggle] = useState(false)

    const handleTagsToggle = (e) => {
        setTagsToggle(e.target.checked)
    }

    const [tagsInput,setTagsInput] = useState('')

    const handleTagsInput = (event) => {
        setTagsInput(event.target.value)
    }

    const [missedMotive,setMissedMotive] = useState(false)

    const handleMissedMotiveChange = (event) => {
        setMissedMotive(event.target.checked)
    }

    /*Pagament */

    const [registerPagament, setRegisterPagament] = useState(false);

    const handlerRegisterPagament = (event) => {
        setRegisterPagament(event.target.checked);
    };


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


    const [delayOnPagament, setDelayOnPagament] = useState(false);

    const handleDelayOnPagament = (event) => {
        setDelayOnPagament(event.target.checked);
    };


    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedSessionDate = new Date(sessionDate);
        const newSessionObj = {
            date : parsedSessionDate,
            attend: attend,
            sessionDescription:textInput,
            tagsDescription: tagsInput
        }
       

        const postOptions = {
            method: 'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(newSessionObj)
          }

          const resultSession = await apiRequest(API_POST_NEW_SESSION,postOptions)
          if(registerPagament){
            const parsedPaydate = new Date(payDate);

            const pagamentObj = {
                delay: delayOnPagament ? pagamentDelay : 0,
                payDate:parsedPaydate,
                value:pagamentValue,
                pagamentTags:tagsPagamentInput
            }

            const postPagamentOptions = {
                method: 'POST',
                headers: {
                'Content-Type':'application/json'
                },
                body: JSON.stringify(pagamentObj)
            }

            const resulPagament = await apiRequest(API_POST_NEW_PAGAMENT,postPagamentOptions)
          }



          window.location.reload();


    }


    const sessionDateValidation = sessionDate === null

    const tagsValidation = (tagsToggle && tagsInput.length === 0)  ? true : false

    const payDateValidation = payDate === null ? true : false

    const pagamentValueValidation = pagamentValue === null ? true : false

    const delayOnPagamentValidation = pagamentDelay === null ? true : false

    const tagsPagamenyValidation = (tagsPagamentToggle && tagsPagamentInput.length === 0)  ? true : false

    const isNotSubmittable = !fromMenu 
  ? sessionDateValidation || (tagsValidation)
  : sessionDateValidation || (tagsValidation) || (registerPagament && (payDateValidation || (pagamentValueValidation)  || (delayOnPagamentValidation) || (tagsPagamenyValidation)));

  return (
    <div >
        <div className='client-registration-form-h2'>
             <h2>{client.name} </h2>
        </div>
        
        <form onSubmit={handleSubmit} className='register-session-form'>
            <div>
            <span className={ sessionDateValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
            <label>{attend ? 'Data da sessão' : 'Data da falta'} </label>
            </div>
            
            <DatePicker
                    selected={sessionDate}
                    onChange={handleSessionDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    maxDate={new Date()}
                    className='add-pagament-form-div-input'
                />
            {attend ? 
            <>
                <label>Descrição da sessão: </label>
                <textarea className='session-view-description' value={textInput} onChange={handleTextInputChange}/>
            </>
            :
            <>
                <div className='client-registration-div-center'>
                    <label>Adicionar motivo de falta</label>
                    <input type='checkbox' value={missedMotive} onChange={handleMissedMotiveChange} className='client-registration-check'/>
                </div>
                {missedMotive === true && 
                <>
                    <label>Motivo da Falta: </label>
                    <textarea className='session-view-description' value={textInput} onChange={handleTextInputChange}/>
                </>
                }
            </>
            
            
            }
            
            <div className='register-session-tags-div'>
                <div className='client-registration-div-center'>
                    <label>Adicionar Tags: </label>
                    <input type='checkbox' value={tagsToggle} onChange={handleTagsToggle} className='client-registration-check'/>  
                </div>
                {tagsToggle === true && 
                    <div>
                        <span className={ tagsValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                        <input type='text' value={tagsInput} onChange={handleTagsInput} className='client-registration-tags-input'/>
                    </div>
                }
            </div>
            {fromMenu &&
                <>
                    <div className='client-registration-div'>
                        <label>Registrar Pagamento:</label>
                        <input type='checkbox' value={registerPagament} onChange={handlerRegisterPagament} className='client-registration-check'/>
                    </div>
                    {registerPagament &&
                        <div className='client-registration-pagament'>
                        <div className='client-registration-form-h2'>
                            <h2>Informações  do pagamento </h2>
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
                            <input type='number'value={pagamentValue} onChange={handlePagamentValueChange} className='client-registration-time' step='0.01'/>
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
                                <span className={ tagsPagamenyValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                                <input type='text' value={tagsPagamentInput} onChange={handleTagsPagamentInput} className='client-registration-tags-input'/>
                            </div>
                            }
                        </div>

                        </div>
                    }
                   
                </>
            }
            <button type='submit' disabled={isNotSubmittable} className='client-registration-button'>Registar</button>

                
         
            
        </form>
        <div style={{display:'flex',flexDirection:'column'}}>
        <span className='necessary-input-missing'>* Não preenchido</span>
        <span className='necessary-input-complete'>*  preenchido</span>
        </div>
        
    </div>
  )
}

export default RegisterSession