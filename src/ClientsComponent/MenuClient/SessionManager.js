import React, { useEffect,useState } from 'react'
import PutSession from './PutSession'
import SessionView from './SessionView'
import DatePicker from 'react-datepicker';
import './MenuClient.css'
import TagsSession from './TagsSession'
import RegisterSession from '../../Calender/RegisterSession';
import backArrow from '../../assets/compact-left-arrow.png'


function SessionManager({client,limitTimeOfSession,limitDurationOfSession,setCurrentPage,numberOfSessionPerPage}) {

    const API_GET_ALL_SESSIONS = 'http://localhost:8080/sessions/getByClientId/' + client.clientId

    const [sessionForClient,setSessionForClient] = useState([])

    useEffect(()=> {

        const fecthSessionForClient = async () => {
            try{
              const response = await fetch(API_GET_ALL_SESSIONS);
              if(!response.ok) throw Error('Did not recive expected data');
              const listSessionForClient = await response.json();
              setSessionForClient(listSessionForClient);
              
            }catch(err){
              console.log(err.stack)
            }
      
          }
          (async () => await fecthSessionForClient())(); 
    },[])


    const [sessionManagerPage,setSessionManagerPage] = useState('Menu')

    const [sessionToModify,setSessionToModify] = useState()

    const handleSessionToModify = (session) => {
        setSessionToModify(session)
        setSessionManagerPage('Put')
    }

   

    const [sessionToView,setSessionToView]  = useState()

    const handleSessionView = (session) => {
        setSessionToView(session)
        setSessionManagerPage('View')
    }

    /* Filters functions*/

    const [search,setSearch] = useState('')

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const [dateSearch,setDateSearch] = useState(null)

    const handleDateSearchChange = (date) => {
        setDateSearch(date)
    }

    const [mounthFilter,setMounthFilter] = useState(null)

    const handleMounthFilterChange = (data) => {
        setMounthFilter(data)
    }

    const [yearFilter,setYearFilter] = useState(null)

    const handleYearFilterChange = (data) => {
        setYearFilter(data)
    }

    const [attendOptions,setAttendOptions] = useState('all')

    const handleAttendOptionsChange = (event) => {
        setAttendOptions(event.target.value)
    }

    const [sortOptions,setSortOptions] = useState('recent')

    const handleSortOptionsChange = (event) => {
        setSortOptions(event.target.value)
    }

    const filteredSessions = sessionForClient.filter((session) => {
        const tagMatch = session.tagsDescription 
            ?  
            session.tagsDescription.toLowerCase().trim().includes(search.toLowerCase().trim()) 
            : 
            search === '' ? true : false;

        const attendMatch = attendOptions === 'all' ? true : 
            attendOptions === 'attend' ? session.attend === true :
             attendOptions === 'missed' ?  session.attend === false : true;
        const dateMatch = dateSearch ? new Date(session.date).toDateString() === dateSearch.toDateString() : true;

        const mouthMatch = mounthFilter ? (
            new Date(session.date).getFullYear() === mounthFilter.getFullYear() &&
            new Date(session.date).getMonth() === mounthFilter.getMonth()
        ) : true

        const yearMatch = yearFilter ? new Date(session.date).getFullYear() === yearFilter.getFullYear() : true

        return tagMatch && dateMatch && attendMatch && mouthMatch && yearMatch;
      }).sort((a, b) => {
        if (sortOptions === 'recent') {
          return new Date(b.date) - new Date(a.date); // Sort by recent dates first
        } else {
          return new Date(a.date) - new Date(b.date); // Sort by old dates first
        }
      });;

        /*pagination*/
        const [currentPagePagination, setCurrentPagePagination] = useState(1);
        const handlePagePaginationChange = (event, pageNumber) => {
            event.preventDefault();
            setCurrentPagePagination(pageNumber);
        };
        const indexOfLastSession = currentPagePagination * numberOfSessionPerPage;
        const indexOfFirstSession = indexOfLastSession - numberOfSessionPerPage;
        const currentSession = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredSessions.length / numberOfSessionPerPage); i++) {
            pageNumbers.push(i);
        }

  return (
    <div className='session-manager-page'>
    {sessionManagerPage === 'Menu' &&
        <>
            <img  src={backArrow} className='arrow-go-back' onClick={() => setCurrentPage('Menu')}/>
            <div className='session-manager-session'>
                {client.clientPayOnDay ? 
                    <>
                        <p>Clientes pagamento no ato não possuem sessões semanais</p>
                    </>
                    :
                    <>
                        {client.daysOfSession.map((session) => (
                            <>
                                <p>Dia da sessão: <span style={{color:'black'}}>{session.dayOfSession}</span></p>
                                <p>Horário de início da sessão: <span style={{color:'black'}}>{session.timeOfSession}</span></p>
                                <p>Tempo da sessão: <span style={{color:'black'}}>{session.durationOfSession}</span></p>
                                <p>Sessão bisemanal: <span style={{color:'black'}}>{session.everyWeek ? 'Não' : 'Sim'} </span></p>
                                <button onClick={() => handleSessionToModify(session)}
                                className='session-manager-modify-button'>Modificar dia da sessão</button>
                            </>
                        ))}
                        {client.daysOfSession.length === 0 && <p>Cliente desativado</p>}
                    </>
                }
                
            </div>
            <div className='session-manager-sessions-register'>
                <button  onClick={() => setSessionManagerPage('Add')} className='pagament-manager-add-button'>Adicionar sessão</button>
            </div>
            <div className='session-manager-sessions-register'>
                <p className='sessions-register-title'>Sessões registradas</p>
                <div className='session-manager-filters-div client-filters-color' >
                    <p className='session-manager-filter-title'>Filtros</p>
                    <div className='session-manager-filters-sub-div'>

                        <div className='session-manager-filters-item'>
                            <label htmlFor='search'>Tags </label>
                            <input type='text' value={search} onChange={handleSearchChange}/>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Data da sessão </label>
                            <DatePicker
                                selected= {dateSearch}
                                onChange ={handleDateSearchChange}
                                isClearable
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                maxDate={new Date()}
                                className='add-pagament-form-div-input'
                                popperPlacement="top"
                                
                            />
                        </div>
                        <div  className='session-manager-filters-item'>
                            <label>Mês / Ano</label>
                                <DatePicker
                                    selected={mounthFilter}
                                    onChange={handleMounthFilterChange}
                                    isClearable
                                    dateFormat="MM/yyyy"
                                    showMonthYearPicker
                                    placeholderText="MM/YYYY"
                                    maxDate={new Date()}
                                    className='session-manager-filters-mounth-year-picker'
                                    popperPlacement="top"
                                />
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Ano</label>
                            <DatePicker
                                selected={yearFilter}
                                onChange={handleYearFilterChange}
                                isClearable
                                dateFormat="yyyy"
                                showYearPicker
                                placeholderText="YYYY"
                                maxDate={new Date()}
                                className='pagament-manager-year-picker'
                                popperPlacement="top"
                             />
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Presença </label>
                            <select value={attendOptions} onChange={handleAttendOptionsChange} className='client-filters-select'>
                                <option value='all'>Todos</option>
                                <option value='attend'>Apenas Presente</option>
                                <option value='missed'>Apenas Faltas</option>
                            </select>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Organizar por </label>
                            <select value={sortOptions} onChange={handleSortOptionsChange} className='client-filters-select'>
                                <option value='recent'>Mais recentes</option>
                                <option value='old'>Mais antigo</option>
                            </select>

                        </div>
                    </div>

                </div>

                {sessionForClient.length > 0 ? 
                    <>
                    <span className='client-register-total'> Sessões encontradas: {filteredSessions.length}</span>
                    {currentSession.map((session) => (
                    <TagsSession
                        key={session.id} 
                        session={session}
                        handleSessionView={handleSessionView}
                    />
                    ))}
                    </> : 
                    <p>Nenhuma sessão encontrada </p>
                }
                <div className='pagination'>
                     {pageNumbers.map(number => (
                        <button
                           key={number}
                           onClick={(e) => handlePagePaginationChange(e, number)}
                           className={number === currentPagePagination ? 'pagination-button-active' : ''}
                         >
                        {number}
                        </button>
                        ))}
                </div>

            </div>
                
            

        </>
    }
    {sessionManagerPage === 'Put' &&
        <>
        <img  src={backArrow} className='arrow-go-back' onClick={() => setSessionManagerPage('Menu')}/>
        <PutSession
            session={sessionToModify}
            limitTimeOfSession={limitTimeOfSession}
            limitDurationOfSession={limitDurationOfSession}
        />
        </>
    }
    {sessionManagerPage === 'View' &&
        <>
            <img  src={backArrow} className='arrow-go-back' onClick={() => setSessionManagerPage('Menu')}/>
            <SessionView
                session={sessionToView}
            />
        </>
    }
    {sessionManagerPage === 'Add' && 
        <>
            <img  src={backArrow} className='arrow-go-back' onClick={() => setSessionManagerPage('Menu')}/>
            <RegisterSession
                client={client}
                day={new Date()}
                attend={true}
                fromMenu={true}
            />

        </>

    }

    </div>
  )}
    

export default SessionManager