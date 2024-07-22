import React, { useState } from 'react'
import './Configurations.css'
import backArrow from '../assets/compact-left-arrow.png'
import { NavLink } from 'react-router-dom'
import { useEffect } from "react";
import PutUserConfigurations from './PutUserConfigurations';

function ConfigurationsPage() {

    const API_GET_ALL_USER = "http://localhost:8080/user/getAll";

    const [configurationsPage,setConfigurationsPage] = useState('verify')
    const [user, setUser] = useState(null);

  
    const [isLoading, setIsLoading] = useState(true);

    const [erro,setError] = useState(false)

    
  
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(API_GET_ALL_USER);
          const userList = await response.json();
          const user = userList[0]
          setUser(user);
          
          /*
          setAPI_PUT_USER(`http://localhost:8080/user/put/${user.userId}`)
          setName(user.name)
          setPassword(user.password)
          setNumberOfClientsPerPage(user.numberOfClientsPerPage)
          setNumberOfSessionsPerPage(user.numberOfSessionsPerPage)
          setNumberOfPagamentsPerPage(user.numberOfPagamentsPerPage)

          */
        } catch (err) {
          console.log(err.stack);
          setError(true)
        } finally {
          setIsLoading(false);
        }
      };
  
      (async () => await fetchUser())();
    }, []);


    const [passwordForEntry,setPasswordForEntry] = useState();
  
    const handlePasswordForEntryChange = (event) => {
      setPasswordForEntry(event.target.value)
    }
    const [loginError,setLoginError] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!(user.password === passwordForEntry)){
           
            setLoginError('Senha incorreta')
          }else{
            setLoginError(null)
            setConfigurationsPage('configs')
            
        
          }
        
    }
    
  return (
    <>
    <NavLink to='/home'>
        <img src={backArrow} className='arrow-go-back'/>
    </NavLink>
    {isLoading &&
        <>
        
        <div className='message-to-user-display'>
                <p >Carregando...</p>
               
          </div>
        </>
      }
      {erro && 
      <>
    
      <div className='message-to-user-display'>
                <p >Back end error</p>
      </div>
      </>
      }
    {configurationsPage === 'verify' &&
    <>
        <div className='configurations-page'>
            <form  onSubmit={handleSubmit} className='login-form'>
                <label>Confirme sua senha: </label>
                <input type='password' value={passwordForEntry} onChange={handlePasswordForEntryChange}/>
                {loginError && 
                  <p style={{color:'red'}}>{loginError}</p>
                }
                <button type='submit'>Confirmar</button>
            </form>

        </div> 
    </>}
    {configurationsPage === 'configs' && 
 
    <>  
       <PutUserConfigurations user={user}/>
    </>
      
                    
        
    }
    
    
    </>
   
  )
}

export default ConfigurationsPage