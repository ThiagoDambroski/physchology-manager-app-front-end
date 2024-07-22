import React, { useEffect, useState } from 'react'
import backArrow from '../assets/compact-left-arrow.png'
import { NavLink } from 'react-router-dom'
import YearMonthDisplay from './YearMonthDisplay';

function PagamentPage({numberOfPagamentsMonthPerPage}) {
  const API_GET_ALL_PAGAMENTS = "http://localhost:8080/pagament/getAll";

  const [index,setIndex] = useState(0)

  const [pagamentsList,setPagamentList] = useState([])

  const [isLoading,setIsLoading] = useState(true)

  const [pagamentMonths,setPagamentMonths] = useState([])

  const [error,setErro] = useState(false)
  useEffect(() => {
    const fetchPagaments = async () => {
        try{
          const response = await fetch(API_GET_ALL_PAGAMENTS);
          const pagamentListResponse = await response.json();
            const months = [];
          
            const pagamentListResponseFiltered = pagamentListResponse.sort((a, b) => {
              return new Date(b.payDate) - new Date(a.payDate);
          })
            pagamentListResponseFiltered.forEach(pagament => {
              const pagamentDate = new Date(pagament.payDate);
              const pagamentMonth = pagamentDate.getMonth();
              const pagamentYear = pagamentDate.getFullYear();
              const monthObject = { month: pagamentMonth, year: pagamentYear };
              if (!months.some(m => m.month === monthObject.month && m.year === monthObject.year)) {
                months.push(monthObject);
              }
            });
            setPagamentMonths(months);
            setIndex(months.length - 1)
            setPagamentList(pagamentListResponse);
         
          

          
          
        }catch(err){
            console.log(err.stack)
            setErro(true)
        }finally{
            setIsLoading(false)
        }
    }
    (async () => await fetchPagaments())()
},[])

const filterPagamentMonthYear = (month, year) => {
  return pagamentsList.length > 0 &&  pagamentsList.filter(pagament => {
    const pagamentDate = new Date(pagament.payDate);
    return pagamentDate.getMonth() === month && pagamentDate.getFullYear() === year;
  });
};







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
      {error && 
      <>
    
      <div className='message-to-user-display'>
                <p >Back end error</p>
      </div>
      </>
      }
      {!isLoading && !error && pagamentMonths.length > 0 &&
        <div className='pagament-page'>
       
        <div className='client-title'>
          <h2 >  Pagamentos </h2>             
        </div>

        <YearMonthDisplay key={`${pagamentMonths.slice().reverse()[index].year}-${pagamentMonths.slice().reverse()[index].month}`} obj={pagamentMonths.slice().reverse()[index]} pagaments={filterPagamentMonthYear(pagamentMonths.slice().reverse()[index].month, pagamentMonths.slice().reverse()[index].year) } lenght={pagamentMonths.length - 1} index={index} setIndex={setIndex} numberOfPagamentsMonthPerPage={numberOfPagamentsMonthPerPage}/>

        </div>
      }
      {!isLoading && !error && pagamentMonths.length === 0 &&
        <div className='message-to-user-display'>
                <p >Nenhum pagamento registrado</p>
            </div>
      }
     
    </>
    
  )
}

export default PagamentPage