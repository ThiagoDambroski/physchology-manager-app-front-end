import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import './MenuClient.css'
import apiRequest from '../../ApiRequest';

function SessionView({session}) {

    const API_PUT_SESSION = "http://localhost:8080/sessions/put/" + session.clientSessionId

   const formatDate = (dateRaw) => {
        const date = new Date(dateRaw)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [pageSessionView,setPageSessionView] = useState('View')

    const [newSessionDate,setNewSessionDate] = useState(session.date)

    const handleNewSessionDate = (date) => {
        setNewSessionDate(date)
    }

    const [newSessionText,setNewSessionText] = useState(session.sessionDescription)

    const handleNewSessionTextChange = (event) => {
        setNewSessionText(event.target.value)
    }

    const [newAttend,setNewAttend] = useState(session.attend)

    const handleNewAttendChange = (event) => {
        setNewAttend(event.target.checked)
        
    }

    const [newTags,setNewTags] = useState(session.tagsDescription)
    
    const handleNewTagsChange = (event) => {
        setNewTags(event.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parseDate = new Date(newSessionDate)
        const newSession = {
            date: parseDate,
            attend: newAttend,
            sessionDescription:newSessionText,
            tagsDescription:newTags

        }

        const putOptions = {
            method: 'PUT',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify(newSession)
          }
        

          const resultSessionDays = await apiRequest(API_PUT_SESSION,putOptions)
          window.location.reload()
    }

    const sessionDateValidation = newSessionDate === null ? true : false

    const isNotSubmittable = sessionDateValidation
  return (
    <div className='session-view-page'>
       {pageSessionView === 'View' &&
        <>
            <p>Data da sessão: {formatDate(session.date)}</p>
            <p className='session-view-attended'>Compareceu a sessão: {session.attend ? 'Sim' : 'Não'}</p>
            <textarea className='session-view-description'
            readOnly={true}>{session.sessionDescription}</textarea>
            <div className='session-viw-tags-div'>
                <p>Tags:</p> 
               
                <textarea readOnly='true' style={{fontFamily:'Verdana'}}>{session.tagsDescription}</textarea>
            </div>
            <button onClick={() => setPageSessionView('Edit') } className='session-view-button'>Modificar sessão </button>
        </>
       }
       {pageSessionView === 'Edit' && 
        <>
            
            <form onSubmit={handleSubmit} className='session-view-form'>
                <div>
                    <span className={ sessionDateValidation ? 'necessary-input-missing' : 'necessary-input-complete'}>*</span>
                    <label>Data da sessão: </label>
                    <DatePicker
                        selected={newSessionDate}
                        onChange={handleNewSessionDate}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        maxDate={new Date()}
                    />
                </div>
                <div className='session-view-attended' style={{paddingLeft:'5px'}}>
                    <label>Compareceu a sessão </label>
                    <input type='checkbox' checked={newAttend} onChange={handleNewAttendChange}/>
                </div>
                
                
                <textarea className='session-view-description' value={newSessionText} onChange={handleNewSessionTextChange}/>
                <div className='session-viw-tags-div'>
                    <label style={{marginBottom:'5px',marginTop:'5px'}}>Tags:</label> 
                    <textarea value={newTags} onChange={handleNewTagsChange} style={{fontFamily:'Verdana'}}/>
                </div>
                
                <button type='submit' disabled={isNotSubmittable} className='session-view-button'>Salvar </button>
            </form>
            <span className='necessary-input-missing'>* Não preenchido</span>
            <span className='necessary-input-complete'>*  preenchido</span>
        </>   
    
       }
        
    </div>
  )
}

export default SessionView