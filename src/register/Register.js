import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../ApiRequest";

function Register() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };

  const POST_USER_URL = "http://localhost:8080/user/post";

  const [userName, setUserName] = useState();

  const handleUserName = (event) => {
    event.preventDefault();
    setUserName(event.target.value);
  };

  const [password, setPassword] = useState();

  const handlePassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const [confirmPassword, setConfirmPassword] = useState();

  const handleConfirmPassword = (event) => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //POST User
    const userToPost = {
      name: userName,
      password: password,
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nome de usuario: </label>
        <input type="text" value={userName} onChange={handleUserName} />
        <label>Senha: </label>
        <input type="password" value={password} onChange={handlePassword} />
        <label>Confirm sua senha: </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
        />

        {confirmPassword && password === confirmPassword && userName && (
          <button type="submit">Registrar</button>
        )}
        {!(password === confirmPassword) && (
          <>
            <p>As senhas não estão iguais</p>
            <button type="submit" disabled={true}>
              Registrar
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Register;
