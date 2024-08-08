import React, { useEffect, useState } from 'react'
import PutPagament from './PutPagament'
import AddPagament from './AddPagament'
import backArrow from '../../assets/compact-left-arrow.png'
import DatePicker from 'react-datepicker';

function PagamentManager({client,setCurrentPage,numberOfPagamentsPerPage}) {

  const API_GET_CLIENT_PAGAMENTS = "http://localhost:8080/pagament/getById/" + client.clientId
  
  const [clientPagaments,setClientsPagament] = useState([])

  const [isLoading,setIsLoading] = useState(true)

  const [pagamentPage,setPagamentPage] = useState('Home')
  
  const [selectPagament,setSelectPagament] = useState()


  const handleModifyPagament = (pagament) => {
    setSelectPagament(pagament)
    setPagamentPage('Modify')
 }

 const [dateFilter,setDateFilter] = useState(null)

 const handleDateFilterChange = (date) => {
  setDateFilter(date)
 }

 const [yearFilter,setYearFilter] = useState(null)
 
 const handleYearFilterChange = (year) => {
    setYearFilter(year)
 }

 const [valueFilter,setValueFilter] = useState(null)

 const handleValueFilterChange = (event) => {
      setValueFilter(event.target.value)
 }


 const [delayFilter,setDelayFilter] = useState('all')

 const handleDelayFilterChange  = (event) => {
  setDelayFilter(event.target.value)
 }



 const [sortOptions,setSortOptions] = useState('recent')

 const handleSortOptionsChange = (event) => {
  setSortOptions(event.target.value)
 }



 const [tagsFilter,setTagsFilter] = useState('')

 const handeTagsFilterChange = (event) => {
  setTagsFilter(event.target.value)
 }

 const [mounthFilter,setMounthFilter] = useState(null)

    const handleMounthFilterChange = (data) => {
        setMounthFilter(data)
    }



  
  useEffect(()=> {

    const fecthPagaments = async () => {
        try{
          const response = await fetch(API_GET_CLIENT_PAGAMENTS);
          if(!response.ok) throw Error('Did not recive expected data');
          const listClientPagaments = await response.json();
          setClientsPagament(listClientPagaments);
          
        }catch(err){
          console.log(err.stack)
        }finally{
          setIsLoading(false)
        }
  
      }
      (async () => await fecthPagaments())(); 
},[])

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};


const filterPagamentsNewPagamentForFunction = clientPagaments.filter((pagament) => {
  return true
}).sort((a,b) => {
    return new Date(b.payDate) - new Date(a.payDate); // Sort by recent dates first
})


const today = new Date()


const filterPagaments = clientPagaments.filter((pagament) => {

  const dateMatch = dateFilter ? new Date(pagament.payDate).toDateString() === dateFilter.toDateString() : true
  const yearMatch = yearFilter ?  new Date(pagament.payDate).getFullYear() === yearFilter.getFullYear() : true
  const valueMatch = valueFilter ? pagament.value === parseFloat(valueFilter): true
  const delayMatch = delayFilter === 'delay' ? pagament.delay > 0 : delayFilter === 'noDelay' ? pagament.delay === 0 : true
  const tagsMatch = pagament.pagamentTags ? pagament.pagamentTags.toLowerCase().trim().includes(tagsFilter.toLowerCase().trim()) : tagsFilter === '' ? true : false
  const mouthMatch = mounthFilter ? (
    new Date(pagament.payDate).getFullYear() === mounthFilter.getFullYear() &&
    new Date(pagament.payDate).getMonth() === mounthFilter.getMonth()
) : true

  return dateMatch && yearMatch && valueMatch && delayMatch && tagsMatch && mouthMatch
}).sort((a, b) => {
  if (sortOptions === 'recent') {
    return new Date(b.payDate) - new Date(a.payDate); // Sort by recent dates first
  } else if (sortOptions === 'old') {
    return new Date(a.payDate) - new Date(b.payDate); // Sort by old dates first
  }else if(sortOptions === 'high'){
    return b.value - a.value
  }else if(sortOptions === 'low'){
    return a.value - b.value
  }
})

const truncateString = (string,number) => {

  if(string.length <= number){
      return string
  }

  return string.slice(0,number) + '...'

}

const totalWithFilter = () => {
  let total = 0
  filterPagaments.map((pagament) => {
    total += pagament.value
  })
  return total
}

    /*pagination*/
    const [currentPagePagination, setCurrentPagePagination] = useState(1);
    const handlePagePaginationChange = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPagePagination(pageNumber);
    };
    const indexOfLastPagament = currentPagePagination * numberOfPagamentsPerPage;
    const indexOfFirstPagament = indexOfLastPagament - numberOfPagamentsPerPage;
    const currentPagament = filterPagaments.slice(indexOfFirstPagament, indexOfLastPagament);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filterPagaments.length / numberOfPagamentsPerPage); i++) {
        pageNumbers.push(i);
    }


  return (
    <div className='pagament-manager-page'>
       
        {!isLoading ?
          <>  
            
            {pagamentPage === 'Home' &&
              <>
              <img src={backArrow} onClick={() => setCurrentPage('Menu')} className='arrow-go-back'/>
    
              <button onClick={() => setPagamentPage('Add')} className='pagament-manager-add-button'>Adicionar pagamento</button>
              {/*!client.clientPayOnDay &&
                <div>
                  <p>Ultimo Pagamento : { formatDate(lastPagament.getDate())}</p>
                  <p>Proximo Pagamento : {client.payDay}</p>
                </div>
                
              */}
              
              <div className='pagament-manager-filters-div client-filters-color'>
                <p className='session-manager-filter-title'>Filtros</p>
                <div className='session-manager-filters-sub-div'>
                  <div className='session-manager-filters-item'>
                    <label>Data do pagamento</label>
                    <DatePicker
                                selected={dateFilter}
                                onChange={handleDateFilterChange}
                                isClearable
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                maxDate={new Date()}
                                className='add-pagament-form-div-input'
                                popperPlacement="left"
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
                    <label>Valor do pagamento</label>
                    <input type='number' value={valueFilter} onChange={ handleValueFilterChange}
                     className='add-pagament-form-div-input'/>
                  </div>
                  
                  <div className='session-manager-filters-item'>
                    <label>Tags</label>
                    <input type='text' value={tagsFilter} onChange={handeTagsFilterChange}/>
                  </div>
                 
                  <div className='session-manager-filters-item '>
                      <label>Atraso</label>
                      <select value={delayFilter} onChange={handleDelayFilterChange}>
                        <option value={'all'}>Todos</option>
                        <option value={'delay'}>Apenas atrasados</option>
                        <option value={'noDelay'}>Apenas sem atraso</option>
                      </select>
                  </div>

                 

                  <div className='session-manager-filters-item'>
                      <label>Organizar por</label>
                      <select value={sortOptions} onChange={handleSortOptionsChange}>
                        <option value='recent'>Data mais recente</option>
                        <option value='old'>Data mais antiga</option>
                        <option value='high'>Valor mais alto</option>
                        <option value='low'>Valor mais baixo</option>
                      </select>
                  </div>
                </div>
                
              </div>
                
                {filterPagaments.length > 0 ? 
                  <>
                      {!client.clientPayOnDay && 
                        <div>
                          <p>Dia de pagamento: <span style={{color:pagamentColor(client)}}>{client.payday} {pagamentColor(client) === 'red' ? '(Atrasado)' : pagamentColor(client) === 'green' ? '(Em dia)' : pagamentColor(client) === 'gold' ? '(Vence Hoje)' : ''}</span></p>
                          <p></p>
                        </div>
                      }
                      <p>Total: <span style={{color:'blue'}}>R${totalWithFilter()}</span> </p>
                      <span className='client-register-total'> Pagamentos encontradas: {filterPagaments.length} </span>
                   {currentPagament.map((pagament) => (
                      <div className='individual-pagament' >
                        <div className='individual-pagament-head'>
                          <p>Data do pagamento: <span style={{color:'blue'}}>{formatDate(pagament.payDate)}</span></p>
                          <p>Valor do pagamento: <span style={{color:'blue'}}>R${pagament.value}</span> </p>
                        </div>
                        
                        
                        <p>{pagament.delay !== 0 ? 'Atraso no pagamento: ' + pagament.delay + ( pagament.delay === 1 ? ' dia' : 'dias') : 'Sem atraso no pagamento'}</p>
                        <p className='individual-pagament-tags'>
                          {pagament.pagamentTags ? 'tags: ' +  truncateString(pagament.pagamentTags,40) : 'Sem tags'}
                        </p>
                        <button onClick={() => handleModifyPagament(pagament)} className='indidivual-pagament-button'>
                        Modificar pagamento</button>
                      </div>
                    ))}
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
                  </>
                  :
                  <p className='pagament-manager-empty-pagament'>Nenhum pagamento registrado</p>
                }
                

              </>
            }
            {pagamentPage === 'Modify' && 
              <PutPagament
                pagament={selectPagament}
                setPagamentPage={setPagamentPage}
              />
            }
            {pagamentPage === 'Add' &&
            <AddPagament
              client={client}
              setPagamentPage={setPagamentPage}
            />

            }
            
          </>
          :
          <p>Carregando...</p>
        }
       
    </div>
  )
}

export default PagamentManager