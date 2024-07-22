import React, { useState } from 'react'
import './Pagament.css'
import leftArrow from '../assets/compact-left-arrow.png'
import rigthArrow from '../assets/compact-right-arrow.png'
import { set } from 'date-fns'

function YearMonthDisplay({obj,pagaments,lenght,index,setIndex,numberOfPagamentsMonthPerPage}) {

    

    const nextMonth = () => {
        if(index + 1 > lenght){
            setIndex(0)
        }else{
            setIndex(index + 1)
        }
        
    }

    const previousMonth = () => {
        if(index - 1 < 0){
            setIndex(lenght)
        }else{
            setIndex(index - 1)
        }
    }

    const totalMonth = pagaments.reduce((total, pagament) => {
        return total + pagament.value;
    }, 0)

    const monthYearToBrazilian = (month, year) => {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const monthName = months[month]; 
        return `${monthName} - ${year}`; 
    };

    const formatDateToBrazilian = (dateInput) => {
        const date = new Date(dateInput)
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${day}/${month}/${year}`; 
    };

    /* filters*/

    const [clientFilter,setClientFilter] = useState('')

    const handleClientFilterChange = (event) => {
        setClientFilter(event.target.value)
    }

    const [tagsFilter,setTagsFilter] = useState('')

    const handleTagsFilterChange = (event) => {
        setTagsFilter(event.target.value)
    }

    const [delayFilter,setDelayFilter] = useState('all')

    const handleDelayFilter = (event) => {
        setDelayFilter(event.target.value)
    }

    const [dayOneFilter,setDayOneFilter] = useState(null)

    const handleDayOneFilterChange = (event) => {
        let number = event.target.value; 
    
        if (number > 31) {
            number = 31;
        } else if (number < 0) {
            number = 1;
        }

        setDayOneFilter(number)
    }

    const [dayTwoFilter,setDayTwoFilter] = useState(null)

    const handleDayTwoFilterChange = (event) => {
        let number = event.target.value; 
    
        if (number > 31) {
            number = 31;
        } else if (number < 0) {
            number = 1;
        }

        setDayTwoFilter(number)
    }

    const [valueFilter,setValueFilter] = useState(null)

    const handleValueFilterChange = (event) => {
        setValueFilter(event.target.value)
    }

    const [sortOptions,setSortOptions] = useState('recent')

    const handleSortOptionsChange = (event) => {
        setSortOptions(event.target.value)
    }

    const pagamentsFilter = pagaments.filter((pagament) => {

        const tagsMatch = tagsFilter.length > 0 ? pagament.pagamentTags ?  pagament.pagamentTags.toLowerCase().trim().includes(tagsFilter.toLowerCase().trim()) : false : true  
        const delayMatch = delayFilter === 'all' ? true : delayFilter === 'delay' ? pagament.delay > 0 : delayFilter === 'no-delay' ? pagament.delay === 0  : true
        const dayMatch = dayOneFilter && dayTwoFilter ? 
        parseInt(dayOneFilter, 10) <= new Date(pagament.payDate).getDate() && new Date(pagament.payDate).getDate() <= parseInt(dayTwoFilter, 10) :
        dayOneFilter ? new Date(pagament.payDate).getDate() === parseInt(dayOneFilter, 10) : true;
        const valueMatch = valueFilter ? parseFloat(valueFilter,10) === pagament.value : true
        const clientMatch = clientFilter.length > 0 ? pagament.client.name.toLowerCase().trim().includes(clientFilter.toLowerCase().trim()) : true

        return tagsMatch && delayMatch && dayMatch && valueMatch && clientMatch
    }).sort((a,b) => {
        if(sortOptions === 'recent'){
            return new Date(b.payDate) - new Date(a.payDate)
        }else if((sortOptions === 'old')){
            return new Date(a.payDate) - new Date(b.payDate)
        }else if((sortOptions === 'more')){
            return b.value - a.value
        }else if((sortOptions === 'less')){
            return a.value - b.value
        }
    })

    const totalWithFilter = () => {
        let total = 0
        pagamentsFilter.map((pagament) => {
          total += pagament.value
        })
        return total
      }

    /*Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = numberOfPagamentsMonthPerPage;
    const indexOfLastPagament = currentPage * itemsPerPage;
    const indexOfFirstPagament = indexOfLastPagament - itemsPerPage;
    const currentPagaments = pagamentsFilter.slice(indexOfFirstPagament, indexOfLastPagament);

    const handlePageChange = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPage(pageNumber);
    };
    
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(pagamentsFilter.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    
    
  return (    
    <div className='month-year-page'  >

        <div className='month-year-title'>
            {!(index - 1 < 0) && 
                <img src={leftArrow} className='month-year-arrow' onClick={() => previousMonth()}/>
            }
            
            <h2 >{monthYearToBrazilian(obj.month,obj.year)}</h2>
            {!(index + 1 > lenght) && 
                <img src={rigthArrow} className='month-year-arrow' onClick={() => nextMonth()}/>
            }
            
        </div>
        <p className='month-year-total'>Total do mês: R$ {totalMonth}</p>
        <div className='session-manager-filters-div client-filters-color'>
                    <p className='session-manager-filter-title' >Filtros</p>
                    <div className='client-filters-sub-div'>
                        <div className='session-manager-filters-item'>
                            <label>Nome do cliente</label>
                            <input type='text' value={clientFilter} onChange={handleClientFilterChange}/>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Tags</label>
                            <input type='text' value={tagsFilter} onChange={handleTagsFilterChange}/>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Atraso</label>
                            <select className='client-filters-select' value={delayFilter} onChange={handleDelayFilter}>
                                <option value='all'>Todos</option>
                                <option value='no-delay'>Apenas sem atraso</option>
                                <option value='delay'>Apenas com atraso</option>
                                
                            </select>
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Dia do pagamento</label>
                            <div>
                                <input type='number' value={dayOneFilter} onChange={handleDayOneFilterChange}  className='add-pagament-form-div-input-delay'/>
                                <span>-</span>
                                <input type='number' value={dayTwoFilter} onChange={handleDayTwoFilterChange}  className='add-pagament-form-div-input-delay'/>
                            </div>
                            
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Valor</label>
                            <input type='number'value={valueFilter} onChange={handleValueFilterChange}/>
                                
                        </div>
                        <div className='session-manager-filters-item'>
                            <label>Organizar por:</label>
                            <select value={sortOptions} onChange={handleSortOptionsChange} className='client-filters-select'>
                                <option value='recent'>Pagamentos mais recentes</option>
                                <option value='old'>Pagamentos mais antigos</option>
                                <option value='more'>Valor mais alto</option>
                                <option value='less'>Valor mais baixo</option>
                            </select>
                        </div>
                    </div>
                    
                    
        </div>

        
        <span className='client-register-total' style={{ alignSelf: 'center' }}> Pagamentos encontrados: {pagamentsFilter.length} | Total com filtros: R${totalWithFilter()} </span>
       
       <div className='month-year-pagament-div' >
        {currentPagaments.length === 0 && <p className='no-item-found'>Nenhum pagamento encontrado</p>}
        {currentPagaments.length > 0 && 
            currentPagaments.map((pagament) => 
                <div className='month-year-pagament'>
                    <p className='pagament-year'>{formatDateToBrazilian(pagament.payDate)}</p>
                    <p> Valor:  <span className='pagament-span-blue'> R$ {pagament.value}</span>  </p>
                    <p>Cliente: <span className='pagament-span-blue'>{pagament.client.name}</span> </p>
                    <p>Tags: <span className='pagament-span-blue'>{pagament.pagamentTags ? pagament.pagamentTags : 'Sem tags'}</span> </p>
                    <p>Atraso: <span className='pagament-span-blue'>
                        {pagament.delay === 0 
                            ? 'Sem Atraso' 
                            : `${pagament.delay} ${pagament.delay === 1 ? 'dia' : 'dias'}`
                        }
                        </span>
                    </p>

                    
                </div>
            
            )
        }
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
        
    </div>
  )
}

export default YearMonthDisplay