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
  const [error, setError] =useState("");
  const {user, auth, logoutUser} = useContext(AuthContext);


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
    
    

    //handleSearch('Angus');
  }, [showConfirmationModal]) //;


  useEffect(() =>{
    if(user) {
      setIsLoggedIn(true);
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
      await axios.post('http://localhost:3000/guitarists', newGuitarist);
      setName('');
      setDescription('');
      setStyle('');
      setAlbums('');
      setImage('');
      fetchGuitarists(); // Refresh the list after adding
    } catch (err) {
      console.error(err);
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
      
      setShowConfirmationModal(false); // Refresh
       await axios.delete(`http://localhost:3000/guitarists/${id}`);
     
        // Refrescar la lista con los datos actualizados del backend
        fetchGuitarists();
        
      
     
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
<Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn}/>
    <div className="container container-fluid">
      
      {user ? <h1>Bienvenido {capitalizeFirstLetter(user.name)}</h1> : <h1>Bienvenido</h1>}
      {error && <h3>{error}</h3>}
      <p>Esta es una de las mejores bases de datos de guitarristas</p>
      
      {isLoggedIn ? (
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
        />
      ) : (
        <p>Inicie sesión para poder ver los detalles o agregar un nuevo guitarrista si eres administrador.</p>
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
          onClose={() => setShowModal(false)}
        />
      )}

{isLoggedIn ? (
  <div className="row">
    {guitarristas.map((guitarrista) => (
      <div key={guitarrista._id} className="col col-md-4 col-lg-3 mb-4">
        <div className="card">
          <img
            src={guitarrista.imageUrl || 'default-image.jpg'} // Imagen predeterminada si no hay imagen
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }} // Ajustar la imagen
          />
          <div className="card-body">
            <h5 className="card-title">{guitarrista.name}</h5>
          {/*Mostrar botonr¿es solo si el rol es admin*/}
            {user && user.role === 'admin' && (
              <div className="d-flex justify-content-between">
              <button
                className="btn btn-warning"
                onClick={() => handleEditGuitarist(guitarrista)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteConfirmation(guitarrista)}
              >
                Eliminar
              </button>
            </div>

            )}
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
      <div key={guitarrista._id} className="col-md-4 col-lg-3 mb-4">
        <div className="card">
          <img
            src={guitarrista.imageUrl || 'default-image.jpg'}
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">{guitarrista.name}</h5>
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
