import React, { useEffect, useState } from 'react'
import './Client.css'
import ClientRegistration from './ClientRegistration';
import 'react-datepicker/dist/react-datepicker.css';
import IndividualClient from './IndividualClient';

function Clients({isLoggedIn}) {

    const API_GET_ALL_CLIENTS = "http://localhost:8080/client/getAll";

    const [clientsList,setClientsList] = useState([])

    const [isLoading,setIsLoading] = useState(true)

    const [lightbox,setLightbox] = useState(false)

    const openLightbox = () => {
        setLightbox(true);
        
      }
    
      const closeLightbox = () => {
        setLightbox(false);
      }

    useEffect(() => {
        const fetchClients = async () => {
            try{
                const response = await fetch(API_GET_ALL_CLIENTS)
                const clientsListResponse = await response.json()
                console.log(clientsListResponse)
                setClientsList(clientsListResponse)
            }catch(err){
                console.log(err.stack)
            }finally{
                setIsLoading(false)
            }
        }
        (async () => await fetchClients())()
    },[])
      

  return (
    <>
        {isLoggedIn &&
            <p>Voce precisa logar para acessar essa pagina</p>
        }
        {!isLoggedIn &&
        <>
            {!isLoading && 
            <>
                    <h2>Clientes registrados </h2>
                <button onClick={openLightbox}>Adicionar Cliente</button>
                {clientsList.length === 0 && <p>Nenhum Client Registrado</p>}
                {clientsList.length > 0 &&
                    clientsList.map((client) => (
                        <IndividualClient
                            client={client}
                        />
                    ))
                }
            </>
            }
            {isLoading && 
            <p>Carregando...</p>}
            
        </>}
        {lightbox && (
        <div className="lightbox">
          <span className="close-button" onClick={closeLightbox}>X</span>
          <div className="lightbox-content">
            <div >
                <ClientRegistration/>
            </div>
          </div>
        </div>
 )}

    </>
  )
}

export default Clients