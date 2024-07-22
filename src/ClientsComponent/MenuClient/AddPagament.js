import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import apiRequest from '../../ApiRequest';
import backArrow from '../../assets/compact-left-arrow.png'

function AddPagament({client,setPagamentPage}) {

    const API_POST_NEW_PAGAMENT = "http://localhost:8080/pagament/post/" + client.clientId

    const [payDate,setPayDate] = useState(null)

    const handlePayDateChange = (date) => {
        setPayDate(date)
    }
    const [delayOnPagament, setDelayOnPagament] = useState(false);

    const handleDelayOnPagament = (event) => {
        setDelayOnPagament(event.target.checked);
    };
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

    const [tagsToggle,setTagsToggle] = useState(false)

    const handleTagsToggle = (event) => {
      setTagsToggle(event.target.checked)
    }

    const [tagsInput,setTagsInput] = useState('')

    const handleTagsInput = (event) => {
      setTagsInput(event.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedPaydate = new Date(payDate);

        const pagamentObj = {
            delay: delayOnPagament ? pagamentDelay : 0,
            payDate:parsedPaydate,
            value:pagamentValue,
            pagamentTags:tagsInput
        }

        const postOptions = {
            method: 'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(pagamentObj)
          }

          const resulPagament = await apiRequest(API_POST_NEW_PAGAMENT,postOptions)


         window.location.reload();
    }
    const payDateValidation = payDate === null ? true : false

    const pagamentValueValidation = pagamentValue === null ? true : false

    const delayOnPagamentValidation = pagamentDelay === null ? true : false

    const tagsValidation = (tagsToggle && tagsInput.length === 0)  ? true : false

  const isNotSubmitble = payDateValidation || pagamentValueValidation || delayOnPagamentValidation || tagsValidation
  return (
    <div className='put-client-page'> 
        <img  src={backArrow} className='arrow-go-back' onClick={() => setPagamentPage('Home')}/>
       
        <form onSubmit={handleSubmit} className='add-pagament-form'>
        <div className='client-registration-div-center'>
            <div className='add-pagament-form-div'>
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
        </div>
        <div className='add-pagament-form-div'>
          <div className='client-registration-div-center'>
              <span className={ pagamentValueValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
              <label>Valor do pagamento: </label>
              <input type='number'value={pagamentValue} onChange={handlePagamentValueChange} className='add-pagament-form-div-input' step='0.01'/>
          </div>
        </div>
        <div className='add-pagament-form-div'>
        <div className='client-registration-div-center'>
            <label>Atraso no pagamento: </label>
            <input type='checkbox' value={delayOnPagament} onChange={handleDelayOnPagament} className='add-pagament-form-check'/>
        </div>
        </div>
        {delayOnPagament &&
                <div className='add-pagament-form-div'>
                    <div className='client-registration-div-center'>
                    <span className={ delayOnPagamentValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                      <label>Dias de atraso: </label>
                      <input type='number'value={pagamentDelay} onChange={handlePagamentDelay} className='add-pagament-form-div-input-delay'/>
                    </div>
                </div> 
            }
        <div className='add-pagament-form-div'>
            <div className='client-registration-div-center'>
            <label>Adicionar Tags: </label>
            <input type='checkbox' value={tagsToggle} onChange={handleTagsToggle} className='client-registration-check'/>
            </div>
              
            {tagsToggle === true && 
              <div style={{marginTop:'5px'}}>
                  <span className={ tagsValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                  <input type='text' value={tagsInput} onChange={handleTagsInput} className='client-registration-tags-input'/>
              </div>
           }
       
       </div>
          
         
            <button type='submit' disabled={isNotSubmitble} className='put-client-button-save'>Registrar pagamento</button>
            <span className='necessary-input-missing'>* Não preenchido</span>
            <span className='necessary-input-complete'>*  preenchido</span>
        </form>
    </div>
  )
}

export default AddPagament