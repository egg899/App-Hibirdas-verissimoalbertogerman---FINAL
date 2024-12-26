import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",  // Establece un valor por defecto en 'user'
  });
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/usuarios/register', userData)
      .then((res) => {
        console.log(res);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-lg-12">
          <h1 className="text-center">Registrarse</h1>
          <p className="text-center">Crea una cuenta para comenzar a usar nuestra plataforma.</p>
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                required
              />
            </div>

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

            <div className="form-group mb-3">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                className="form-control"
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
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

export { Register };
