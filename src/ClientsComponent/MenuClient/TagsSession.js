import React from 'react'
import { useState } from 'react'

function TagsSession({session,handleSessionView}) {
    const [mouseAbove,setMoveAbove] = useState(false)

    const handleMouseEnter = () => {
        setMoveAbove(true)
    }
    const handleMouseExit = () => {
        setMoveAbove(false)
    }

    const truncateString = (string,number) => {

        if(string.length <= number){
            return string
        }

        return string.slice(0,number) + '...'

    }

    const formatDate = (dateRaw) => {
        const date = new Date(dateRaw)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };



    


  return (
    <div onClick={() => handleSessionView(session)}
            className='sessions-register-individual-session'>

        <p>{session.attend ? 'Data da sessão: ' : 'Data da falta: '} <span style={{color: 'blue'}}>{formatDate(session.date)}</span></p>
        {session.tagsDescription ? (
                <div >
                {mouseAbove ? 
                    <>
                        <p onMouseEnter={handleMouseEnter}
                        onMouseOut={handleMouseExit}
                        className='session-register-tags'>
                                Tags:{' '}   <span onMouseEnter={handleMouseEnter}
                        onMouseOut={handleMouseExit} style={{color:'blue'}}>{truncateString(session.tagsDescription,80)}</span>
                        </p>
                    </>
                    :
                     <>
                        <p  
                        onMouseEnter={handleMouseEnter}
                        onMouseOut={handleMouseExit}
                        className='session-register-tags'>
                         Tags:{' '} <span onMouseEnter={handleMouseEnter}
                        onMouseOut={handleMouseExit} style={{color: 'blue'}}>{truncateString(session.tagsDescription,20)}</span> </p>
                     </>
                }
                                    
                </div>
        ):
        <>
            <p className='session-register-tags'>Sem Tags</p>
        </>
        }
                             
        </div>
  )
}

export default TagsSession