import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GuitaristForm from '../../components/guitaristForm';
import '../../styles/estilo.scss';
import ModalGuitarra from '../../components/Modal/ModalGuitarra';
import ConfirmationModal from '../../components/Confirmation/ConfirmationModal';
import useDebounce from '../../hooks/useDebounce';
import { AuthContext } from '../../context/AuthContext';
import Nav from '../../components/Nav';
import {io} from "socket.io-client";

const Home = () => {
  const navigate = useNavigate();

  const [guitarristas, setGuitarristas] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [albums, setAlbums] = useState('');
  const [image, setImage] = useState('');
  const [header, setHeader] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [currentGuitarrista, setCurrentGuitarrista] = useState(null);
  const [guitaristId, setGuitaristId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // For confirmation modal
  const [guitaristToDelete, setGuitaristToDelete] = useState(null); // The guitarist to delete

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState();
  const [suggestions, setSuggestions] = useState('');
  const debouncedSearch = useDebounce(search, 1000);
  const [error, setError] = useState("");
  const {user, auth, logoutUser} = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false);
  const socket = io('http://localhost:3000');//Conectado al servidor

console.log('auth',auth);


  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchGuitarists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/guitarists',{
        params: {
          name:search,
          sortBy:sort,
          page,
          limit
          
        },
        headers:{'token':auth}
      });
      setGuitarristas(response.data);
      setHeader(response);
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
      setTimeout(() => {
        logoutUser();
        navigate("/login");
      }, 3000);
    }
  };
console.log(guitarristas)
  useEffect(() => {
    if(debouncedSearch){
      handleSearch(debouncedSearch)
    }else{
      setSuggestions([])
    }
  }, [debouncedSearch])
console.log('header', header);

console.log('user',user);

useEffect(() => {
    
      fetchGuitarists();
    
// Listen for the 'guitaristDeleted' event
socket.on('guitaristDeleted', (deletedId) => {
  console.log('Guitarist deleted with ID:', deletedId.id);
  setGuitarristas((prevGuitarristas) =>
    prevGuitarristas.filter((guitarrista) => guitarrista._id !== deletedId)
  );
});

// Clean up the socket listener
return () => {
  socket.off('guitaristDeleted');
};
    
  }, []) //;

 
 

  useEffect(() => {
    if(user) {
      setIsLoggedIn(true);
      if(user.role == 'admin') {
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  },[user])

 
 


  const handleAddGuitarrist = async (e) => {
    e.preventDefault();
    const newGuitarist = {
      name,
      description,
      style,
      albums,
      imageUrl: image,
      owner: {
        userId: user._id,
        username: user.username,
      },
     

    };

    try {
      await axios.post('http://localhost:3000/guitarists', newGuitarist,
        { headers:{'authorization':auth}}
      );
      setName('');
      setDescription('');
      setStyle('');
      setAlbums('');
      setImage('');
      setError('');
      fetchGuitarists(); // Refresh the list after adding
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        // Handle specific error like duplicate guitarist
        setError(err.response.data || 'el guitarrista ya existe');
      } else {
        setError('Un error inesperado ha ocurrido');
      }
      
    }
  };
console.log("guitarrist", guitarristas)
  const handleGuitaristSaved = () => {
    fetchGuitarists(); // Refresh the list after saving the guitarist
  };

  const handleEditGuitarist = (guitarist) => {
    setCurrentGuitarrista(guitarist);
    setGuitaristId(guitarist._id);
    setShowModal(true);
  };

  const handleDeleteGuitarist = async (id) => {
    
    try {
      setShowConfirmationModal(false);
       await axios.delete(`http://localhost:3000/guitarists/${id}`, 
       { headers:{'authorization':auth}});
       setGuitarristas(prev => prev.filter(guitarist => guitarist._id !== id)); // Update local state


        // Refrescar la lista con los datos actualizados del backend
        //fetchGuitarists();
        //window.location.reload();
        
        
     
    } catch (error) {
      console.error('Error al eliminar guitarrista:', error);
    }
    // setShowConfirmationModal(false); // Close the confirmation modal after deletion
    
    // await fetchGuitarists(); 

};

  const handleDeleteConfirmation = (guitarist) => {
    console.log('the guitarist: ',guitarist.albums);
    setGuitaristToDelete(guitarist._id); // Set the guitarist ID to be deleted
    setShowConfirmationModal(true); // Show the confirmation modal
    fetchGuitarists();
  };


  const handleCancelDelete = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
    setGuitaristToDelete(null); // Clear the guitarist ID
  };


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    //fetchGuitarists();
  };

  const handleSearch = async (searchTerm) => {
    console.log(searchTerm);
    try {
      const res = await axios.get('http://localhost:3000/guitarists', {
        params: {
          name: searchTerm
        }
        
      });
      setGuitarristas(res.data);
      //console.log('res porque se me canta', res);
      setSuggestions(res.data);
      // Refresh the list after adding
    } catch (err) {
      console.error(err);
    }
  }



const handleSuggestionClick = (suggestion) => {
  setSearch(suggestion);
  handleSearch(suggestion);
}


  return (
    <>
<Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>
    <div className="container container-fluid">
      
      {user ? <h1>Bienvenido {capitalizeFirstLetter(user.name)}</h1> : <h1>Bienvenido</h1>}
      {error && <h3 className="alert alert-danger">{error}</h3>}
      <p>Esta es una de las mejores bases de datos de guitarristas</p>
      
      {isLoggedIn ? (
  (user?.role === 'admin' || user?.role === 'contributor') ? (
    <>
    <p>Busca entre los guitarristas disponibles o agrega mas</p>
    <GuitaristForm
      name={name}
      style={style}
      albums={albums}
      image={image}
      description={description}
      setName={setName}
      setStyle={setStyle}
      setAlbums={setAlbums}
      setImage={setImage}
      setDescription={setDescription}
      handleSubmit={handleAddGuitarrist}
    /></>
  ) : (
    <p>Busca entre los guitarristas disponibles</p>
  )
) : (
  <p>Inicie sesión para poder ver los detalles o agregar un nuevo guitarrista si eres administrador o contribuidor.</p>
)}


      <h1>LISTA DE GUITARRISTAS</h1>
      <form className="search-bar-container">
  <div className="input-group mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Buscar guitarrista..."
      value={search}
      onChange={handleSearchChange}
    />
    
  </div>
  {suggestions.length > 0 && (
    <ul className="list-group search-suggestions">
      {suggestions.map((suggestion) => (
        <li
          className="list-group-item"
          key={suggestion._id}
          onClick={() => handleSuggestionClick(suggestion.name)}
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  )}
</form>

      {showModal && (
        <ModalGuitarra
          guitarist={currentGuitarrista}
          guitaristId={guitaristId}
          onGuitaristSaved={handleGuitaristSaved}
          auth={auth}
          onClose={() => setShowModal(false)}
        />
      )}

{isLoggedIn ? (
  <div className="row">
    {guitarristas.map((guitarrista) => (
      <div key={guitarrista._id} className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <img
            src={guitarrista.imageUrl || 'default-image.jpg'} // Imagen predeterminada si no hay imagen
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover', objectPosition: 'top' }} // Ajustar la imagen
          />
          <div className="card-body">
            <h5 className="card-title">{guitarrista.name}</h5>
            <p className="autor">Autor: {guitarrista.owner.username}</p>
          {/*Mostrar botonr¿es solo si el rol es admin*/}
            {user && user.role === 'admin' && (
              <div className="d-flex justify-content-between">
              <button
                className="btn btn-warning "
                onClick={() => handleEditGuitarist(guitarrista)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger "
                onClick={() => handleDeleteConfirmation(guitarrista)}
              >
                Eliminar
              </button>
            </div>

            )}{/*Admin*/}

      {user && (user.role === 'contributor' && user.username === guitarrista.owner.username) && (
              <div className="d-flex justify-content-between">
                
              <button
                className="btn btn-warning "
                onClick={() => handleEditGuitarist(guitarrista)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger "
                onClick={() => handleDeleteConfirmation(guitarrista)}
              >
                Eliminar
              </button>
            </div>

            )}{/*contributor*/}




            {/* Botón para ver detalles siempre */}
            <Link to={`/guitarristas/${guitarrista._id}`} className="btn btn-info mt-2">
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="row">
    {guitarristas.map((guitarrista) => (
      <div key={guitarrista._id} className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <img
            src={guitarrista.imageUrl || 'default-image.jpg'}
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">{guitarrista.name}</h5>
            <p className="autor">Autor: {guitarrista.owner.username}</p>

            {/* <Link to={`/guitarristas/${guitarrista._id}`} className="btn btn-info mt-2">
              Ver detalles
            </Link> */}
          </div>
        </div>
      </div>
    ))}
  </div>
)}



        
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={() => handleDeleteGuitarist(guitaristToDelete)}
          onCancel={handleCancelDelete}
          subject={"guitarrista"}
          albums={guitarristas.find(g=>g._id === guitaristToDelete)?.albums || []}
        />
      ) 
    }

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/albumsLista/')}
      >
        Lista de Albumes
      </button>
    </div></>
  );
};

export { Home };
