import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AlbumListForm from '../../components/albumListForm';
import '../../styles/estilo.scss';
import ModalAlbum from '../../components/Modal/ModalAlbum';
import ConfirmationModal from '../../components/Confirmation/ConfirmationModal';
import { AuthContext } from '../../context/AuthContext';
import Nav from '../../components/Nav';
const AlbumsLista = () => {
  const navigate = useNavigate();

  const [albumsList, setAlbumsList] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]); // To store search results
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentAlbum, setCurrentAlbum] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/albums');
      setTimeout(() => {
        setAlbumsList(response.data);
        setFilteredAlbums(response.data); // Initialize filtered list
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };
console.log('albumsList', albumsList);
  useEffect(() => {
    fetchAlbums();
    
  }, [showConfirmationModal]);
//console.log('Artista elegido: ', artist);

  const {user, auth, logoutUser} = useContext(AuthContext);
  
  
 
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

 

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter albums based on the search query
    const filtered = albumsList.filter((album) =>
      album.title.toLowerCase().includes(query)
    );
    setFilteredAlbums(filtered);
  };

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('User not logged in');
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/guitarists/id/${artist}`
      );
      const artistId = response.data;

      if (!artistId) {
        console.error('Artista no encontrado');
        return;
      }

      const newAlbum = {
        title,
        year,
        artist: artistId || null,
        description,
        imageUrl: image,
        owner: {
          userId: user._id || null,
          username: user.username || null,
        },
      };

      await axios.post('http://localhost:3000/albums', newAlbum);

      setTitle('');
      setYear('');
      setArtist('');
      setDescription('');
      setImage('');
      fetchAlbums();
    } catch (error) {
      console.error('Error al agregar el álbum:', error);
    }
  };

  const handleEditAlbum = (album) => {
    setCurrentAlbum(album);
    setAlbumId(album._id);
    setShowModal(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    
    try {
      setShowConfirmationModal(false);
      await axios.delete(`http://localhost:3000/albums/${albumId}`);
      fetchAlbums();
    } catch (error) {
      console.error('Error al eliminar el álbum:', error);
    }
    
    
  };

  const handleDeleteConfirmation = (id) => {
    setAlbumToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setAlbumToDelete(null);
  };

  if (loading)
    return (
      <div>
        <figure>
          <img
            className="albums rounded-circle bounce-animation"
            alt="collage de albums"
            style={{
              width: '60%',
              display: 'block',
              margin: '0 auto',
            }}
            src="https://townsquare.media/site/295/files/2021/04/Final2.jpg?w=980&q=75"
          />
        </figure>
      </div>
    );

  return (
    <>
<Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn} isAdmin={isAdmin}/>

    <div className="container container-fluid ">
      <p>Aqui podras buscar los albumes relacionados con los artistas.
      </p>
      {isLoggedIn ? (
  (user?.role === 'admin' || user?.role === 'contributor') ? (
    <>
    <p>Busca entre los Albumes disponibles o agrega mas</p>
   <AlbumListForm
          title={title}
          year={year}
          artist={artist}
          image={image}
          description={description}
          albums ={filteredAlbums}
          setTitle={setTitle}
          setYear={setYear}
          setArtist={setArtist}
          setImage={setImage}
          setDescription={setDescription}
          handleSubmit={handleAddAlbum}
        /></>
  ) : (
    <p>Busca entre los Albumes disponibles</p>
  )
) : (
  <p>Inicie sesión para poder ver los detalles o agregar un nuevo Album si eres administrador o contribuidor.</p>
)}

      <h1>LISTA DE ALBUMES</h1>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar álbum por título..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {showModal && (
        <ModalAlbum
          album={currentAlbum}
          albumId={albumId}
          onAlbumSaved={fetchAlbums}
          onClose={() => setShowModal(false)}
        />
      )}






{isLoggedIn ? (
  <div className="row">
    {filteredAlbums.map((album) => (
      <div key={album._id} className="col-md-6 col-lg-6 mb-4">
        <div className="card">
          <img
            src={album.imageUrl || 'default-image.jpg'} // Default image if no URL
            alt={album.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }} // Adjust image
          />
          <div className="card-body">
            <h5 className="card-title">{album.title}</h5>
            <p className="autor">Autor: {album.owner.username}</p>
            {/* Show buttons only if role is admin */}
            {user && user.role === 'admin' && (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditAlbum(album)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteConfirmation(album._id)}
                >
                  Eliminar
                </button>
              </div>
            )}
            {/* Contributor can edit/delete their own albums */}
            {user && (user.role === 'contributor' && user.username === album.owner.username) && (
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditAlbum(album)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteConfirmation(album._id)}
                >
                  Eliminar
                </button>
              </div>
            )}
            {/* Button to view details, always shown */}
            <Link to={`/albums/titulo/${album.title}`} className="btn btn-info mt-2">
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="row">
    {filteredAlbums.map((album) => (
      <div key={album._id} className="col-md-6 col-lg-4 mb-4">
        <div className="card">
          <img
            src={album.imageUrl || 'default-image.jpg'}
            alt={album.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">{album.title}</h5>
            <p className="autor">Autor: {album.owner.username}</p>
            {/* Optionally add a button to view details here */}
            {/* <Link to={`/albums/${album._id}`} className="btn btn-info mt-2">
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
          onConfirm={() => handleDeleteAlbum(albumToDelete)}
          onCancel={handleCancelDelete}
          subject={'Album'}
        />
      )}

      <button
        className="btn btn-secondary  mt-3"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
    </>
  );
};

export { AlbumsLista };
