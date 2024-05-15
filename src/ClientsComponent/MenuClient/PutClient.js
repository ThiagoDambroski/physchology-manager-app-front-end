import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiRequest from '../../ApiRequest';

function PutClient({client,setCurrentPage}) {

    const API_PUT_CLIENT = "http://localhost:8080/client/put/" + client.clientId

    const [newClientName,setNewClientName] = useState(client.name)

    const handleNewClientName = (event) => {
        setNewClientName(event.target.value)
    }

    const [newClientBirth,setNewClientBirth] = useState(client.birthDate)

    const handleClientBirthDateChange = (date) => {
        setNewClientBirth(date)
    }

    const [ newClientPayday,setNewClientPayday] = useState(client.payday)

    const handleClientPaydayChange = (event) => {
        let day = event.target.value; 
    
        if (day > 30) {
            day = 30;
        } else if (day < 0) {
            day = 1;
        }
        
        setNewClientPayday(day)
    }

    const [newClientActive,setNewClientActive] = useState(client.active)

    const handleNewClientActiveChange = () => {
        setNewClientActive(!newClientActive)
    }


   const handleSubmit = async (e) => {

    e.preventDefault()
     //update client
     const parsedBirthDate = new Date(newClientBirth);

     const updateClient = {
         name:newClientName,
         birthDate: parsedBirthDate,
         payday:newClientPayday === 0 ? 1 : newClientPayday
     }
     const putOptions = {
         method: 'PUT',
         headers: {
           'Content-Type':'application/json'
         },
         body: JSON.stringify(updateClient)
       }
     
       const resultClient = await apiRequest(API_PUT_CLIENT,putOptions)

    
       window.location.reload();

    
   }

       

  return (
    <div>
        <span onClick={() => setCurrentPage('Menu')}> {'<-'}</span>
        <form onSubmit={handleSubmit}>
            <label>Nome: </label>
            <input type='text ' value={newClientName} onChange={handleNewClientName}/>
            <label>Data de nascimento: </label>
            <DatePicker
                    selected={newClientBirth}
                    onChange={handleClientBirthDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
            />
            <label>Dia de pagamento</label>
            <input type='number' value={newClientPayday} onChange={handleClientPaydayChange}/>
            <button onClick={() => handleNewClientActiveChange()}>
            {client.active ? 'Desativar Cliente' : 'Ativar Cliente'}
            </button>

            <button type='submit'>Salvar Alteraçoes</button>

        </form>


    </div>
  )
}

export default PutClient