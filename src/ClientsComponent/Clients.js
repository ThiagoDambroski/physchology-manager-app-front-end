import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Client.css'
import ClientRegistration from './ClientRegistration';
import 'react-datepicker/dist/react-datepicker.css';
import IndividualClient from './IndividualClient';
import backArrow from '../assets/compact-left-arrow.png'

function Clients({isLoggedIn,limitTimeOfSession,limitDurationOfSession,numberOfClientPerPage,numberOfSessionPerPage,numberOfPagamentsPerPage}) {

    const API_GET_ALL_CLIENTS = "http://localhost:8080/client/getAll";

    const [clientsList,setClientsList] = useState([])

    const [isLoading,setIsLoading] = useState(true)

    const [lightbox,setLightbox] = useState(false)

    const openLightbox = () => {
        setLightbox(true);
        document.body.classList.add('no-scroll');
        
      }
    
      const closeLightbox = () => {
        setLightbox(false);
        document.body.classList.remove('no-scroll');
      }

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

      const [nameFilter,setNameFilter] = useState(null)

      const handleNameFilterChange = (event) => {
            setNameFilter(event.target.value)
            setCurrentPage(1)
      }

      const [activeFilter,setActiveFilter] = useState('active')

      const handleActiveFilterChange = (event) => {
        setActiveFilter(event.target.value)
        setCurrentPage(1)
      }

      const [pagamentDayFilter,setPagamentDayFilter] = useState(null)

      const handlePagamentDayFilterChange = (event) => {
        let number = event.target.value; 
    
        if (number > 31) {
            number = 31;
        } else if (number < 0) {
            number = 1;
        }
        setPagamentDayFilter(number)
        setCurrentPage(1)
      }

      const [pagamentDaySecondFilter,setPagamentDaySecondFilter] = useState(null)

      const handlePagamentDaySecondFilterChange = (event) => {
        let number = event.target.value; 
    
        if (number > 31) {
            number = 31;
        } else if (number < 0) {
            number = 1;
        }
        setPagamentDaySecondFilter(number)
        setCurrentPage(1)
      }

      const [clientType,setClientType] = useState('all')

      const handleClientTypeChange = (event) => {
        setClientType(event.target.value)
        setCurrentPage(1)
      }
      const [pagamentFilter,setPagamentFilter] = useState('all')

      const handlePagamentFilterChange  = (event) => {
       setPagamentFilter(event.target.value)
      }
     

      const [sortOptions,setSortOptions] = useState('recent')

      const handleSortOptionsChange = (event) => {
            setSortOptions(event.target.value)
      }

      
    useEffect(() => {
        const fetchClients = async () => {
            try{
                const response = await fetch(API_GET_ALL_CLIENTS)
                const clientsListResponse = await response.json()
                
                setClientsList(clientsListResponse)
            }catch(err){
                console.log(err.stack)
            }finally{
                setIsLoading(false)
            }
        }
        (async () => await fetchClients())()
    },[])

    const filterClients = clientsList.filter((client) => {
        const nameMatch = nameFilter ? client.name.toLowerCase().trim().includes(nameFilter.toLowerCase().trim()) : true
        const activeMatch = activeFilter === 'active' ? client.active === true : 
        activeFilter === 'inactive' ? client.active === false :
        activeFilter === 'all' ? true : true
        const pagamentDayMatch = pagamentDayFilter && pagamentDaySecondFilter ? 
           parseInt(pagamentDayFilter,10)  <= client.payday && client.payday <=  parseInt(pagamentDaySecondFilter,10)  : 
           pagamentDayFilter ? client.payday === parseInt(pagamentDayFilter,10) : true
        const clientTypeMatch = clientType === 'all' ? true : clientType === 'payment-on-act' ? client.clientPayOnDay === true : 
        clientType === 'mensal' ? client.clientPayOnDay === false : clientType === 'semanal' ? (client.daysOfSession.length > 0 ? client.daysOfSession[0].everyWeek : false)  : clientType === 'bisemanal' ?  (client.daysOfSession.length > 0 ? !client.daysOfSession[0].everyWeek : false) : true
        const pagamentClientFilter =  pagamentFilter === 'all' ? true : client.clientPayOnDay === false ? (pagamentFilter === 'ok' ? pagamentColor(client) === 'green' : pagamentFilter === 'today' ? pagamentColor(client) === 'gold': pagamentFilter === 'delay' ? pagamentColor(client) === 'red' : false) :  false

        return nameMatch && activeMatch && pagamentDayMatch && clientTypeMatch && pagamentClientFilter
    }).sort((a,b) => {
        if(sortOptions === 'recent'){
            return new Date(b.entranceDate) - new Date(a.entranceDate)
        }else if (sortOptions === 'old'){
            return new Date(a.entranceDate) - new Date(b.entranceDate)
        }else if (sortOptions === 'more'){
            return b.sessions.length - a.sessions.length
        }else if (sortOptions === 'less'){
            return a.sessions.length - b.sessions.length
        }
    })
      
    /*Page logic */
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (event, pageNumber) => {
      event.preventDefault();
      setCurrentPage(pageNumber); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

    const indexOfLastClient = currentPage * numberOfClientPerPage;
    const indexOfFirstClient = indexOfLastClient - numberOfClientPerPage;
    const currentClients = filterClients.slice(indexOfFirstClient, indexOfLastClient);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filterClients.length / numberOfClientPerPage); i++) {
        pageNumbers.push(i);
    }


  return (
    <>
        {!isLoggedIn &&
            <p>Voce precisa logar para acessar essa pagina</p>
        }
        {isLoggedIn &&
        <>
            {!isLoading && 
            
            <div className='client-page'>
                    <NavLink to='/home'>
                    <img src={backArrow} className='arrow-go-back'/>
                    </NavLink>
                    <div className='client-title'>
                        <h2 >  Clientes  registrados </h2>
                        
                    </div>
                    
                <button onClick={openLightbox} className='add-client-button'>Adicionar cliente</button>

                <div className='session-manager-filters-div client-filters-color'>
                    <p className='session-manager-filter-title' >Filtros</p>
                    <div className='client-filters-sub-div'>
                        <div className='session-manager-filters-item'>
                            <label>Nome</label>
                            <input type='text'value={nameFilter} onChange={handleNameFilterChange}/>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Cliente ativado</label>
                            <select value={activeFilter} onChange={handleActiveFilterChange} className='client-filters-select'>
                                <option value='active'>Apenas ativos</option>
                                <option value='inactive'>Apenas inativos</option>
                                <option value='all'>Todos</option>
                            </select>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Dia do pagamento</label>
                            <div>
                                <input type='number'value={pagamentDayFilter} onChange={handlePagamentDayFilterChange}  className='add-pagament-form-div-input-delay'/>
                                <span>-</span>
                                <input type='number'value={pagamentDaySecondFilter} onChange={handlePagamentDaySecondFilterChange}  className='add-pagament-form-div-input-delay'/>
                            </div>
                            
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Tipo de cliente</label>
                            <select value={clientType} onChange={handleClientTypeChange} className='client-filters-select'>
                                <option value='all'>Todos</option>
                                <option value='mensal'>Mensal</option>
                                <option value='semanal'>Semanal</option>
                                <option value='bisemanal'>Bisemanal</option>
                                <option value='payment-on-act'>Pagamento no ato</option>
                                
                            </select>
                        </div>
                        <div className='session-manager-filters-item '>
                            <label>Pagamento</label>
                            <select value={pagamentFilter} onChange={handlePagamentFilterChange}  className='client-filters-select'>
                                <option value={'all'}>Todos</option>
                                <option value={'ok'}>Apenas em dia</option>
                                <option value={'today'}>Apenas pagamento hoje</option>
                                <option value={'delay'}>Apenas atrasado</option>
                            </select>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Organizar por:</label>
                            <select value={sortOptions} onChange={handleSortOptionsChange} className='client-filters-select'>
                                <option value='recent'>Clientes mais recentes</option>
                                <option value='old'>Clientes mais antigos</option>
                                <option value='more'>Clientes com mais sessões</option>
                                <option value='less'>Clientes com menos sessões</option>
                            </select>
                        </div>
                    </div>
                    
                    
                </div>
                <span className='client-register-total'> Clientes encontrados: {filterClients.length}</span>
                <div className='client-div'>     
                           
                {currentClients.length === 0 && <p className='no-item-found'>Nenhum cliente encontrado</p>}
                {currentClients.length > 0 &&
                    currentClients.map((client) => (
                        <IndividualClient
                            client={client}
                            limitTimeOfSession={limitTimeOfSession}
                            limitDurationOfSession={limitDurationOfSession}
                            numberOfSessionPerPage={numberOfSessionPerPage}
                            numberOfPagamentsPerPage={numberOfPagamentsPerPage}
                        />
                    ))
                }
                </div>
                <div className='pagination'>
                {pageNumbers.map(number => (
                        <button
                           key={number}
                           onClick={(e) => handlePageChange(e, number)}
                           className={number === currentPage ? 'pagination-button-active' : ''}
                         >
                                    {number}
                                </button>
                            ))}
                 </div>
            </div>
            }
            {isLoading && 
            <div className='message-to-user-display'>
                <p >Carregando...</p>
            </div>
            
            }
            
            
            
        </>}
        {lightbox && (
            <div className="lightbox">
            <span className="close-button" onClick={closeLightbox}>X</span>
            <div className="lightbox-content">
                <div >
                    <ClientRegistration

                        limitTimeOfSession={limitTimeOfSession}
                        limitDurationOfSession={limitDurationOfSession}
                    />
                </div>
            </div>
            </div>
        )}

    </>
  )
}

export default Clients