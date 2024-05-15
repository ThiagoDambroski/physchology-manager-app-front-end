import React, { useState } from 'react';
import MenuClient from './MenuClient/MenuClient';
import PutClient from './MenuClient/PutClient';
import SessionManager from './MenuClient/SessionManager';

function IndividualClient({ client }) {
  
    const [currentPage,setCurrentPage] = useState('Menu')

    const changePage = (page) => {
        setCurrentPage(page)
    }

    const [lightbox,setLightbox] = useState(false)

    const openLightbox = () => {
        setLightbox(true);
        
      }
    
      const closeLightbox = () => {
        setLightbox(false);
        setCurrentPage('Menu')
      }

    
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month < 10 ? '0' + month : month}/${year}`;
  };

  const pagamentColor = (client) => {

    if (!client.pagamentHistory || client.pagamentHistory.length === 0) {
        return 'red'; 
    }
    const payday = client.payday;
    const today = new Date();
    const dayToday = today.getDate();
    const monthToday = today.getMonth();
    const yearToday = today.getFullYear();

    const lastPayDate =  new Date(client.pagamentHistory[client.pagamentHistory.length - 1].payDate);
    const lastPayYear = lastPayDate.getFullYear();
    const lastPayMonth = lastPayDate.getMonth();

    if (yearToday !== lastPayYear  ) {
        return 'red';
    }
    if(lastPayMonth === monthToday && yearToday === lastPayYear) {
        return 'green'
    }else {
        if(monthToday - 1 !== lastPayMonth){
            return 'red'
        }else{
            if (payday < dayToday) {
                return 'red';
            } else if (payday === dayToday) {
                return 'yellow';
            } else {
                return 'green';
                }
            }
        }
       
    }



  return (
    <div>
      <p>Nome: {client.name}</p>
      <p>Data de nascimento: {formatDate(client.birthDate)}</p>
      <p>Dia de pagamento: <span style={{color:pagamentColor(client)}}>{client.payday}</span></p>
      <p>{client.active ? 'Cliente Ativo' : 'Client Desativado'}</p>


      <button onClick={openLightbox} >Menu do Cliente</button>


      {lightbox && (
        <div className="lightbox">
          <span className="close-button" onClick={closeLightbox}>X</span>
          <div className="lightbox-content">
            <div >
                {currentPage === 'Menu' && 
                    <MenuClient
                        client={client}
                        setCurrentPage={setCurrentPage}
                    />
                }
                {currentPage === 'PutClient' &&
                    <PutClient
                        client ={client}
                        setCurrentPage = {setCurrentPage}
                    />
                }
                {currentPage == 'SessionManager' &&
                    <SessionManager
                        client ={client}
                        setCurrentPage = {setCurrentPage}
                    />

                }
                
            </div>
          </div>
        </div>
    )}


    </div>
  );
}

export default IndividualClient;
