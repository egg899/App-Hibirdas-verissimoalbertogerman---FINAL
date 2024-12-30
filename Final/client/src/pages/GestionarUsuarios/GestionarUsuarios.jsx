import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import ModalUsuario from "../../components/Modal/ModalUsuario";
const GestionarUsuarios = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [currentUsuario, setCurrentUsuario ] = useState(null);
  const [userId, setUserId] = useState(null);  
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/usuarios");
      setUsuarios(response.data.usuarios);
    } catch (error) {
      console.error("Error obteniendo a los usuarios:", error);
      setError("Error al obtener los usuarios");
    }
  };

  const handleUserSaved = () => {
    fetchUsers();
  }

  const fetchUser = async (id) =>
{
    try {
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`);
        setCurrentUsuario(response.data);
      
     
    }
    catch(error){
        console.error("Error obteniendo al usuario:", error);
  
    }
}//fetchuser
console.log('current',currentUsuario);
  const handleEditar = (id) => {
    console.log(`Editar usuario con ID: ${id}`);
    fetchUser(id);
    //setCurrentUsuario(id)
    setUserId(id);
    setShowModal(true);

  };
  

  const handleBorrar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas borrar este usuario?")) {
      try {
        await axios.delete(`http://localhost:3000/usuarios/${id}`);
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
      } catch (error) {
        console.error("Error eliminando al usuario:", error);
        alert("Error al intentar borrar el usuario.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
    <div
      className="container mt-5 p-4"
      style={{ backgroundColor: "#1c1c1c", borderRadius: "10px" }}
    >
      <h1 className="text-center mb-4" style={{ color: "#00ffcc" }}>
        Gestionar Usuarios
      </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && usuarios.length === 0 && (
        <div className="text-center text-light">
          <p>No hay usuarios registrados.</p>
        </div>
      )}

      {showModal && (
        <ModalUsuario 
            user = {currentUsuario}
            userId = {userId}
            onUserSaved = {handleUserSaved}
            onClose={()=> setShowModal(false)}

        />
      )}


      <div className="row">
        {usuarios.map((usuario) => (
          <div className="col-lg-4 col-md-6 mb-4" key={usuario._id}>
            <div
              className="card text-light h-100"
              style={{ backgroundColor: "#333333" }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#00ffcc" }}>
                  {usuario.name}
                  
                </h5>
                {/* <p className="card-text">
                  <strong>Usuario:</strong> {usuario.username}
                  <br />
                  <strong>Email:</strong> {usuario.email}
                  <br />
                  <strong>Rol:</strong> {usuario.role}
                </p> */}
              </div>
              <div className="card-footer d-flex justify-content-between">
                
                 <Link className="btn btn-info btn-sm ms-3" to={`/usuarios/nombre/${usuario.name}`}>
                                       Detalles
                                      </Link>
               
                <button
                  className="btn btn-warning btn-sm ms-3"
                  onClick={() => handleEditar(usuario._id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-3"
                  onClick={() => handleBorrar(usuario._id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <button
        className="btn btn-secondary  mt-3"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </>
  );
};

export { GestionarUsuarios };
