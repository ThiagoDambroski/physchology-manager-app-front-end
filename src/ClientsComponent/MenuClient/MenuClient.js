import React from 'react'

function MenuClient({client,setCurrentPage}) {
  return (
    <div>
        <h1>Menu do cliente : {client.name}</h1>
        <div>
            <button onClick={() => setCurrentPage('PutClient')}>Alterar Dados</button>
            <button onClick={() => setCurrentPage('SessionManager')}>Gerenciar Sessões</button>
            <button>Gerenciar Pagamentos</button>
        </div>
    </div>
  )
}

export default MenuClient