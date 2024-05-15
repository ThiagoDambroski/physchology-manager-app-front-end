import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    console.log(user[0])
    setLoginError('Usuario ou senha incorreto(s)')
  }else{
    setLoginError(null)
    handleLogin()
    goHome()

  }

  
  
}

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      {!isLoading && (
        <>
          {user.length > 0 && (
            <>
              <form onSubmit={onSubmit}>
                <label>Usuario: </label>
                <input type="text" value={userName} onChange={handleUserNameChange}/>
                <label>Senha: </label>
                <input type="password" value={password} onChange={handlePasswordChange}/>
                <button type="submit">Entrar</button>
              </form>
              {loginError && 
                <p>{loginError}</p>
              }
              
            </>
          )}
          {user.length == 0 && (
            <>
              <div>
                <p>Usuario não registrado</p>
                <NavLink to={"register"}>
                  <button>Registre agora</button>
                </NavLink>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Login;
