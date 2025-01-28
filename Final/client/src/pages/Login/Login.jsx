import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (userData.email || userData.password) {
      setError("");
    }
  }, [userData]);



  const handleLogin = async (e) => {
    e.preventDefault();
    // try {
    //     await axios.post('http://localhost:3000/usuarios/login', userData)
    //   .then((res) => {
    //     console.log('res', res);
    //     setUser(res.data.usuario);
    //     Cookies.set('jwToken', res.data.jwtToken, { expires: 3 });
    //     navigate('/');
    //   })
    // }
    try {
      await axios.post('https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios/login', userData)
    .then((res) => {
      console.log('res', res);
      setUser(res.data.usuario);
      Cookies.set('jwToken', res.data.jwtToken, { expires: 3 });
      navigate('/');
    })
  }
  
    catch (error) {
      setError(error.response?.data?.mensaje || "An error occurred.");
      console.log('el error: ', error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-lg-12">
          <h1 className="text-center">Iniciar sesión</h1>
          <p className="text-center">Accede a tu cuenta para continuar.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block">Iniciar sesión</button>
          </form>
          <p className="mt-3 text-center">
            ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  );
};

export { Login };
