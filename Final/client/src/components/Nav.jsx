import React from 'react';
import { Link } from 'react-router-dom';

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Nav = ({ username, cerrarSesion, isLoggedIn, isAdmin }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          GuitaristApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/albumsLista">
                Albums
              </Link>
            </li>

            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <>
                {username && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="userDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Bienvenido {capitalizeFirstLetter(username)}
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby="userDropdown">
                      <li>
                        <Link className="dropdown-item" to={`/usuarios/nombre/${username}`}>
                          Perfil
                        </Link>
                      </li>
                      
                      {isAdmin && (
                          <>
                        <li>
                          <Link className="dropdown-item" to="/gestionarUsuarios">
                            Gestionar Usuarios
                          </Link>
                        </li>
                         <li>
                         <Link className="dropdown-item" to="/register">
                           Registrar Usuario
                         </Link>
                       </li>
                       </>
                      )}

<li>
                        <Link className="dropdown-item" to="/" onClick={cerrarSesion}>
                          Cerrar Sesión
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
