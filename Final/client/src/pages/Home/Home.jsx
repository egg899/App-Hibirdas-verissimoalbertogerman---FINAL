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

  //Parametros para la imagen
  const [file, setFile] = useState(null);
  const [guitImage, setGuitImage] = useState(null);
  const [imageError, setImageError] = useState("");



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
  const [usuariosConectados, setUsuariosConectados] = useState({ test: 'testUser' });

  const [isAdmin, setIsAdmin] = useState(false);
  //const socket = io('http://localhost:3000');//Conectado al servidor
  const socket = io('https://app-hibirdas-verissimoalbertogerman.onrender.com');//Conectado al servidor

//console.log('auth',auth);


  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchGuitarists = async () => {
    try {
      const response = await axios.get('https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists',{

      //const response = await axios.get('http://localhost:3000/guitarists',{
        params: {
          name:search,
          sortBy:sort,
          page,
          limit
          
        },
      // const response = await axios.get('https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists',{
      //   params: {
      //     name:search,
      //     sortBy:sort,
      //     page,
      //     limit
          
      //   },
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
    if (user) {
      
      // socket.on('userLoggedIn', (userId) => {
      //   console.log('Informacion del usuario logueado: ', userId);
        
      //   setUsuariosConectados((prev) => ({
      //     ...prev,
      //     [socket.id]: userId,
      //   }));
      //   console.log('Usuarios conectados', usuariosConectados); 






      // });
  
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
  
      // return () => {
      //   socket.off('userLoggedIn');
      // };
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);
  

  useEffect(() => {
    console.log('Usuarios conectados (effect):', usuariosConectados);
  }, [usuariosConectados]);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('IMAGEN POR SER SUBIDA: ', selectedFile);
    setFile(URL.createObjectURL(selectedFile));//Vista Previa
    setGuitImage(selectedFile); //Almacenar el archivo seleccionado
  }


  const handleAddGuitarrist = async (e) => {
    e.preventDefault();

     // Check if any required field is empty
  if (!name || !description || !style || !albums ) {
    setError("Por favor llene todos los campos.");
    return; // Prevent form submission
  }

  let imageUrl="";
  if(guitImage) {
    const imageFormData = new FormData();
    imageFormData.append("file", guitImage);
    imageFormData.append("upload_preset", "app-hib");
  

  try {
    const cloudinaryRes = await axios.post(`https://api.cloudinary.com/v1_1/dkk4j1f0q/image/upload`,
      imageFormData
  );
  imageUrl = cloudinaryRes.data.secure_url;

  } catch(error) {
    console.error(error);
    setError("Hubo un error al subir la imagen.");
    return;
  }
}


    // const newGuitarist = {
    //   name,
    //   description,
    //   style,
    //   albums,
    //   imageUrl: image,
    //   owner: {
    //     userId: user._id,
    //     username: user.username,
    //   },
     

    // };


    const newGuitarist = new FormData();
    newGuitarist.append('name', name);
    newGuitarist.append('description', description);
    newGuitarist.append('style', style);
    newGuitarist.append('albums', albums);
    newGuitarist.append('imageUrl', imageUrl);
    //newGuitarist.append('guitaristImage', guitImage);
    newGuitarist.append("owner[userId]", user._id);
    newGuitarist.append("owner[username]", user.username);


    // for (let pair of newGuitarist.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }
    // console.log('guitaristImage:', guitImage);
    // console.log('guitaristImage name:', guitImage.name);
    // console.log('guitaristImage type:', guitImage.type);
    // console.log('guitaristImage size:', guitImage.size);

    try {
       //await axios.post('http://localhost:3000/guitarists', newGuitarist,
      await axios.post('https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists', newGuitarist,
        { headers:{'authorization':auth}}
      );
      setName('');
      setDescription('');
      setStyle('');
      setAlbums('');
      //setImage('');
      setGuitImage(null);
      setError('');
        // Vaciar el input
      document.getElementById("guitaristImage").value = "";
    // Reiniciar el estado del archivo
      setFile(null);
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
    if(id) {
    //  const responseGuit = await axios.get(`http://localhost:3000/guitarists/${id}`);
    const responseGuit = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists/${id}`);

     console.log('El guitarrista: ', responseGuit.data.image);

      let publicId = null;
      const urlParts = responseGuit.data.image.split('/');
      const publicIdFromUrl = urlParts[urlParts.length - 1].split('.')[0]; // Extraemos el public_id de la URL
      publicId = publicIdFromUrl;
      console.log('PublicId HOME: ', publicId);

      if(responseGuit.data.image && responseGuit.data.image !== 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738344600/default-profile_ktxzmv.jpg') {
        if(publicId) {
          try{
            await axios.delete('https://app-hibirdas-verissimoalbertogerman.onrender.com/delete-image', {
            //await axios.delete('http://localhost:3000/delete-image', {
              data: { public_id: publicId }
          });
          }
          catch (error){
            console.error('Error al eliminar la imagen en Cloudinary:', error);
          }
        } 
      }


    }//if id



    try {
      setShowConfirmationModal(false);
       //await axios.delete(`http://localhost:3000/guitarists/${id}`, 
       await axios.delete(`https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists/${id}`,
       { headers:{'authorization':auth}});
       setGuitarristas(prev => prev.filter(guitarist => guitarist._id !== id)); // Update local state


        // Refrescar la lista con los datos actualizados del backend
        //fetchGuitarists();
        //window.location.reload();
        
        
     
    } catch (error) {
      console.error('Error al eliminar guitarrista:', error);
    }
    setShowConfirmationModal(false); // Close the confirmation modal after deletion
    
    await fetchGuitarists(); 

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
      const res = await axios.get('https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists', {
      //const res = await axios.get('http://localhost:3000/guitarists', {
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
<Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn} isAdmin={isAdmin} id={user?._id || null}/>
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
      //image={image}
      description={description}
      setName={setName}
      setStyle={setStyle}
      setAlbums={setAlbums}
      //setImage={setImage}
      setDescription={setDescription}
      file ={file}
      handleFileChange = {handleFileChange}
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
      <div key={guitarrista._id} className="col-md-6 col-lg-6 mb-4">
        <div className="card">
          {/* <img
            src={guitarrista.image === 'default-profile.jpg'
              ?'../../src/assets/images/uploads/' + guitarrista.image
              : '../../src/assets/images/guitarists/' + guitarrista.image} // Imagen predeterminada si no hay imagen
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover', objectPosition: 'top' }} // Ajustar la imagen
          /> */}

<img
            src={guitarrista.image === 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738344600/default-profile_ktxzmv.jpg'
              ?  guitarrista.image
              :   guitarrista.image} // Imagen predeterminada si no hay imagen
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
      <div key={guitarrista._id} className="col-md-6 col-lg-6 mb-4">
        <div className="card">
        <img
            src={guitarrista.image === 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738344600/default-profile_ktxzmv.jpg'
              ? guitarrista.image
              : guitarrista.image} // Imagen predeterminada si no hay imagen
            alt={guitarrista.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover', objectPosition: 'top' }} // Ajustar la imagen
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
