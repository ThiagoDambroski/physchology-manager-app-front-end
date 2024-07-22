import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../ApiRequest";

function Register({user}) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };

  const POST_USER_URL = "http://localhost:8080/user/post";

  const [userName, setUserName] = useState('');

  const handleUserName = (event) => {
    event.preventDefault();
    setUserName(event.target.value);
  };

  const [password, setPassword] = useState('');

  const handlePassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirmPassword = (event) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //POST User
    const userToPost = {
      name: userName,
      password: password
    };

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToPost),
    };

    const result = await apiRequest(POST_USER_URL, postOptions);
    if (result) {
      console.log(result);
    } else {
      goBack();
    }
    
  };

  const isDisable = userName === '' || password === '' || confirmPassword === '' || !(password === confirmPassword) || user

  return (
    <div className='put-client-page'>
      <form onSubmit={handleSubmit} className='put-client-form'>
        <div className='put-client-form-div'>
          <label>Nome de usuario: </label>
          <input type="text" value={userName} onChange={handleUserName} className='put-client-name-input' />
        </div>
        <div className='put-client-form-div'>
          <label>Senha: </label>
          <input type="password" value={password} onChange={handlePassword} className='put-client-name-input' />
        </div>
        <div className='put-client-form-div'>
          <label>Confirm sua senha: </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            className='put-client-name-input'
          />
        </div>
       
        {user && 
          <p>Usuario ja registrado</p>
        }
        {confirmPassword.length > 0 && !(password === confirmPassword) && (
          <>
            <p>As senhas não estão iguais</p>
          </>
        )}
        <button type="submit" disabled={isDisable}  className='put-client-button-save'>Registrar</button>

        
      </form>
    </div>
  );
}

export default Register;
