import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext";
import ModalUsuario from '../../components/Modal/ModalUsuario';

const Usuario = () => {
  const { id } = useParams(); // Get the username from the URL
  const navigate = useNavigate(); // Hook for navigating programmatically
  const [user, setUser] = useState(null); // State to hold user data
  const [error, setError] = useState(null); // State to hold error messages
  const [loading, setLoading] = useState(true); // State to track loading
  const { logoutUser } = useContext(AuthContext); 
  const [showModal, setShowModal] = useState(false);

 const fetchUser = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error before fetching new data

      try {
        // Get the token from cookies
        const token = Cookies.get('jwToken');

        // Check if token exists
        if (!token) {
          setError('El token no fue encontrado, por favor inicie sesión nuevamente.');
          setLoading(false);
          return;
        }

        // Add token in Authorization header
        const response = await axios.get(`http://localhost:3000/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        // const response = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // Include the token in the headers
        //   },
        // });

        setUser(response.data);
        
      } catch (err) {
        setError('No se pudo encontrar la información del usuario.');
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    const handleUserSaved = () => {
      fetchUser();
    }
  console.log('user', user);
  useEffect(() => {
   

    fetchUser();
  }, [id]); // Trigger this effect whenever 'name' changes

  const handleEditar = (id) => {
    console.log(`Editar usuario con ID: ${id}`);
    setShowModal(true);
    
  }//handleEditar



  // If there's an error, handle it
  if (error) {
    // Check if the error is token-related and redirect to login
    if (error === 'El token no fue encontrado, por favor inicie sesión nuevamente.') {
      setTimeout(() => {
        navigate('/login'); // Redirect to login after a short delay
      }, 2000); // Delay before redirect (optional)
      return <div className="error">{error}. Redirigiendo a la página de inicio de sesión...</div>;
    }else{
      setTimeout(() => {
       
        logoutUser();
        navigate('/login'); // Redirect to login after a short delay
      }, 2000); // Delay before redirect (optional)
    }

    // Show other error message
    return <div className="error">{error}</div>;
  }
  console.log('user: ',user);
  // While loading, show a loading spinner or message
  if (loading) {
    return <div>Cargando...</div>;
  }

  // If the user data is available, render the user's info
  return (
    <div>
    <div className="row g-0 align-items-center border rounded-3 shadow-lg p-3 bg-dark text-light">
      <div className="col-md-4">
      {/* <img src=  {`../../src/assets/images/uploads/${user.image}`} style={{ maxWidth: '80%' }}  className="img-fluid rounded" alt="Imagen del usuario"/> */}
      <img src=  {`${user.image}`} style={{ maxWidth: '80%' }}  className="img-fluid rounded" alt="Imagen del usuario"/>

      </div>
      <div className="col-md-8 rounded p-4 ">
      <h1>Información del Usuario</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <button className="btn btn-warning btn-sm ms-3"
      onClick={() => handleEditar(user._id) }>Editar</button>

      {showModal && (
        <ModalUsuario
          user={user}
          userId ={user._id}
          onUserSaved={handleUserSaved}
          onClose={() => setShowModal(false)}
        />
      )}


      </div>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate(-1) || navigate('/')}
      >
        Volver
      </button>
    </div>
    </div>
  );
};

export { Usuario };
