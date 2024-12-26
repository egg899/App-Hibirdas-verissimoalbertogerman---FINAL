import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext";


const Usuario = () => {
  const { name } = useParams(); // Get the username from the URL
  const navigate = useNavigate(); // Hook for navigating programmatically
  const [user, setUser] = useState(null); // State to hold user data
  const [error, setError] = useState(null); // State to hold error messages
  const [loading, setLoading] = useState(true); // State to track loading
  const { logoutUser} = useContext(AuthContext); 
  useEffect(() => {
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
        const response = await axios.get(`http://localhost:3000/usuarios/nombre/${name}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        setUser(response.data);
        
      } catch (err) {
        setError('No se pudo encontrar la información del usuario.');
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchUser();
  }, [name]); // Trigger this effect whenever 'name' changes

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
      <h1>Información del Usuario</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate(-1) || navigate('/')}
      >
        Volver
      </button>
    </div>
  );
};

export { Usuario };
