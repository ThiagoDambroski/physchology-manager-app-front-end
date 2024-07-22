import React, { useState } from 'react';
import MenuClient from './MenuClient/MenuClient';
import PutClient from './MenuClient/PutClient';
import SessionManager from './MenuClient/SessionManager';
import PagamentManager from './MenuClient/PagamentManager';

function IndividualClient({ client,limitTimeOfSession,limitDurationOfSession ,numberOfSessionPerPage,numberOfPagamentsPerPage}) {
  
    const [currentPage,setCurrentPage] = useState('Menu')

    const changePage = (page) => {
        setCurrentPage(page)
    }

    const [lightbox,setLightbox] = useState(false)

    const openLightbox = () => {
        setLightbox(true);
        document.body.classList.add('no-scroll');
        
      }
    
      const closeLightbox = () => {
        setLightbox(false);
        setCurrentPage('Menu')
        document.body.classList.remove('no-scroll');
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

    const sortPagamentList = client.pagamentHistory.sort((a,b) => {
        return new Date(b.payDate) - new Date(a.payDate)
    })

    const lastPayDate =  new Date(sortPagamentList[0].payDate);
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
                return 'gold';
            } else {
                return 'green';
                }
            }
        }
       
    }



  return (
    <div className={`${client.active ? 'individual-client-div-active' : 'individual-client-div-not-active'} individual-client-div`}>


      
      <p className='individual-client-name'>{client.name}</p>
      <div className='individual-client-informations'>
        <p >Data de registro: {formatDate(client.entranceDate)}</p>
        <p>{client.clientPayOnDay ? 'Cliente pagamento no ato' : <>Dia de pagamento: <span style={{color:pagamentColor(client)}}>{client.payday}  {pagamentColor(client) === 'red' ? '(Atrasado)' : pagamentColor(client) === 'green' ? '(Em dia)' : pagamentColor(client) === 'gold' ? '(Vence Hoje)' : ''}</span></>}</p>
      </div>
     
      <p className='individual-client-active'>{client.active ? 'Cliente ativo' : 'Cliente desativado'}</p>


      <button onClick={openLightbox} className='indivudal-client-button-menu' >Menu do cliente</button>


      {lightbox && (
        <div className="lightbox">
          <span className="close-button" onClick={closeLightbox}>X</span>
          <div className="lightbox-content">
            <div >
                {currentPage === 'Menu' && 
                    <MenuClient
                        client={client}
                        setCurrentPage={setCurrentPage}
                        limitTimeOfSession={limitTimeOfSession}
                        limitDurationOfSession={limitDurationOfSession}
                    />
                }
                {currentPage === 'PutClient' &&
                    <PutClient
                        client ={client}
                        setCurrentPage = {setCurrentPage}
                        limitTimeOfSession={limitTimeOfSession}
                        limitDurationOfSession={limitDurationOfSession}
                    />
                }
                {currentPage === 'SessionManager' &&
                    <SessionManager
                        client ={client}
                        setCurrentPage = {setCurrentPage}
                        limitTimeOfSession={limitTimeOfSession}
                        limitDurationOfSession={limitDurationOfSession}
                        numberOfSessionPerPage={numberOfSessionPerPage}
                    />

                }
                {currentPage === 'PagamentManager' && 
                    <PagamentManager
                        client = {client}
                        setCurrentPage = {setCurrentPage}
                        numberOfPagamentsPerPage={numberOfPagamentsPerPage}
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
