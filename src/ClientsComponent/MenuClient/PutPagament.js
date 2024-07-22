import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import apiRequest from '../../ApiRequest';
import backArrow from '../../assets/compact-left-arrow.png'

function PutPagament({pagament,setPagamentPage}) {

    const API_PUT_PAGAMENT =  "http://localhost:8080/pagament/put/" + pagament.pagamentId

    const [newPayDate,setNewPayDay] = useState(pagament.payDate)

    const handleNewPayDateChange = (date) => {
        setNewPayDay(date)
    }

    const [value,setValue] = useState(pagament.value)

    const handleValueChange = (e) => {
      let day = parseInt(e.target.value); 
    
      if (isNaN(day)) { 
          day = null; 
      } else if (day <= 0) {
          day = 1;
      }
      
      setValue(day);
        
    }

    const [delay,setDelay] = useState(pagament.delay)

    const handleDelayChange = (e) => {
      let day = parseInt(e.target.value); 
    
      if (isNaN(day)) { 
          day = null; 
      } else if (day < 0) {
          day = 0;
      }
      
      setDelay(day);
        
    }

    const [tags,setTags] = useState(pagament.pagamentTags)

    const handleTagsChange = (event) => {
      setTags(event.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const parsedPagamentDate = new Date(newPayDate);

        const newPagamentObj = {
            delay:delay,
            payDate: parsedPagamentDate,
            value:value,
            pagamentTags:tags
        }
        const putOptions = {
            method: 'PUT',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(newPagamentObj)
          }
          const resultSessionDays = await apiRequest(API_PUT_PAGAMENT,putOptions)


        window.location.reload();

    }

    const payDateValidation = newPayDate === null ? true : false

    const pagamentValueValidation = value === null ? true : false

    const delayOnPagamentValidation = delay === null ? true : false

    const isNotSubmittable = payDateValidation || pagamentValueValidation || delayOnPagamentValidation

  return (
    <>
    <div className='put-client-page'>
      <img  src={backArrow} className='arrow-go-back' onClick={() => setPagamentPage('Home')}/>
      <form onSubmit={handleSubmit} className='add-pagament-form'>
      <div className='client-registration-div-center'>
        <div className='add-pagament-form-div'>
          <span className={ payDateValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
          <label>Data de pagamento: </label>
              <DatePicker
                          selected={newPayDate}
                          onChange={handleNewPayDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="DD/MM/YYYY"
                          maxDate={new Date()}
                          className='add-pagament-form-div-input'
                      />
        </div>
      </div>
      <div className='client-registration-div-center'>
        <div className='add-pagament-form-div'>
            <span className={ pagamentValueValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
            <label>Valor: </label>
            <input type='number' step='0.01' value={value} onChange={handleValueChange} className='add-pagament-form-div-input'/>
        </div>
      </div>
      <div className='client-registration-div-center'>
        <div className='add-pagament-form-div'>
            <span className={ delayOnPagamentValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
            <label>Dias de atraso do pagamento: </label>
            <input type='number' value={delay} onChange={handleDelayChange} className='add-pagament-form-div-input-delay'/>
        </div>
      </div>
      <div className='client-registration-div-center'> 
        <div className='add-pagament-form-div'>
            <label>Tags: </label> 
            
        </div>

      </div>
      
      
      <input type='text' value={tags} onChange={handleTagsChange}  className='client-registration-tags-input'/>
          
          <button type='submit' disabled ={isNotSubmittable} className='put-client-button-save'>Salvar alteraçoes</button>
          <span className='necessary-input-missing'>* Não preenchido</span>
          <span className='necessary-input-complete'>*  preenchido</span>
      </form>
      
      </div>
    </>

  )
}

export default PutPagament