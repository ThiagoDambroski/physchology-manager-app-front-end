import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'


function Login({ handleLogin }) {
  const API_GET_ALL_USER = "http://localhost:8080/user/getAll";
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/home");
  };

  const [user, setUser] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [userName,setUserName] = useState();

  const handleUserNameChange = (event) => {
    setUserName(event.target.value)
  }


  const [password,setPassword] = useState();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const [loginError,setLoginError] = useState()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 15000));
        const response = await fetch(API_GET_ALL_USER);
        const userList = await response.json();
        setUser(userList);
      } catch (err) {
        console.log(err.stack);
      } finally {
        setIsLoading(false);
      }
    };

    (async () => await fetchUser())();
  }, []);

const onSubmit = async (event) => {
  event.preventDefault()


  if(!(user[0].name === userName) || !(user[0].password === password)){
    
    setLoginError('Usuário ou senha incorreto(s)')
  }else{
    setLoginError(null)
    handleLogin()
    goHome()

  }

  
  
}

  return (
    <div >
      {isLoading && <div className='message-to-user-display'>
                <p >Carregando...</p>
            </div>}
      {!isLoading && (
        <>
        <div className='client-title'>
          <h2>Gerenciador de clientes</h2>
        </div>
          <div className="login-page">
            <div >
              {user.length > 0 && (
                <>
                  <form onSubmit={onSubmit} className="login-form">
                    <label>Usuário: </label>
                    <input type="text" value={userName} onChange={handleUserNameChange}/>
                    <label>Senha: </label>
                    <input type="password" value={password} onChange={handlePasswordChange}/>
                    <button type="submit">Entrar</button>
                  </form>
                  {loginError && 
                    <p style={{color:'red'}}>{loginError}</p>
                  }
                  
                </>
              )}
              {user.length === 0 && (
                <>
                  <div>
                    <p>Usuário não registrado</p>
                    <NavLink to={"register"}>
                      <button className="indivudal-client-button-menu">Registre agora</button>
                    </NavLink>
                  </div>
                </>
              )}
            </div> 
          </div>
         

        </>
      )}
    </div>
  );
}

export default Login;
