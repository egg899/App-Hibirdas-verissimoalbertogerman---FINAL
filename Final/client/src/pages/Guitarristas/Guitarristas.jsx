import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Nav from '../../components/Nav';
const Guitarristas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user, auth, logoutUser} = useContext(AuthContext);
  console.log('user',user);

  const [guitarrista, setGuitarrista] = useState({
    name: '',
    description: '',
    style: [],
    albums: [],
    imageUrl: '',
  });

  const [validAlbums, setValidAlbums] = useState([]); // To store valid albums
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);






  const fetchGuitaristsDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/guitarists/${id}`);
      setTimeout(() => {
        setGuitarrista(response.data);
        setLoading(false);
      }, 1000);

      
    //Validar la existencia del album
    const albumPromises = response.data.albums.map((album) =>
      axios
        .get(`http://localhost:3000/albums/titulo/${album}`)
        .then((res) => res.data.length > 0 && album) // Devuleve el album si existe
        .catch(() => null) // Ignora errores
    );
        const resolvedAlbums = await Promise.all(albumPromises);
        setValidAlbums(resolvedAlbums.filter((album) => album));// solamente mantiene los validos
    


        

    } catch (error) {
      console.error('Error fetching guitarist details:', error);
      setLoading(false);
    }
  };

  console.log('GuitarristaId', guitarrista._id)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if(!content) {
      setMessage("Por favor, escriba un comentario.");
      return;
    }

    try { 
      const newComment  = {
        content,
        user: user._id,
        guitarist:guitarrista._id

      }; //New Comment
      
      const response = await axios.post(`http://localhost:3000/comentarios/`, newComment);
      setMessage("Comentario adherido con exito");
      setContent("");

    } catch (error) {
      console.error('Error submitting comment:', error.message);
      setMessage("Hubo un error al enviar el comentario.");
    }

  }//handleCommentSubmit

  useEffect(() => {
    fetchGuitaristsDetails();
  }, []);
 
  console.log("validAlbums", validAlbums);
  useEffect(() =>{
    if(user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  },[user])

  if (loading)
    return (
  
      <div>
        <figure>
          <img
            className="guitarrista rounded-circle bounce-animation"
            alt="loading guitarrista"
            style={{
              width: '60%',
              display: 'block',
              margin: '0 auto',
            }}
            src="https://png.pngtree.com/png-vector/20240322/ourlarge/pngtree-rock-star-guitar-player-png-image_12179637.png"
          />
        </figure>
      </div>
    );

  return (
    <>
<Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn}/>
    <div className="container container-fluid" style={{ minHeight: '100vh' }}>
      <h1>{guitarrista.name || 'Nombre no disponible'}</h1>

      <div className="row mt-5">
        <div className="col-sm-6">
          <figure>
            <img
              className="guitarrista img-thumbnail"
              alt={guitarrista.name || 'Guitarrista'}
              style={{
                width: '60%',
                display: 'block',
                margin: '0 auto',
              }}
              src={
                guitarrista.imageUrl ||
                'https://via.placeholder.com/300x300?text=Imagen+no+disponible'
              }
            />
          </figure>
          <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate(-1) || navigate('/')}
      >
        Volver
      </button>
        </div>
        <div className="col-sm-6 ">
          <p className="text-justify">
            {guitarrista.description || 'Descripción no disponible'}
          </p>


          <p>
        <strong>Estilo:</strong>
      </p>
      <p>
        {guitarrista.style && guitarrista.style.length > 0
          ? guitarrista.style.join(', ')
          : 'Estilo no disponible'}
      </p>

      <p>
  <strong>Álbumes:</strong>
</p>
{guitarrista.albums && guitarrista.albums.length > 0 ? (
  <ul className="list">
    {guitarrista.albums.map((album, index) => {
      // If album is an object, access the title field
      const albumTitle = album.title || album; // Assuming the album is an object with a title or just a string

      return validAlbums.includes(albumTitle) ? (
        <li key={index}>
          <Link to={`/albums/titulo/${albumTitle}`}>{albumTitle}</Link>
        </li>
      ) : (
        <li key={index}>{albumTitle} (Información no disponible)</li>
      );
    })}
  </ul>
) : (
  <p>No hay álbumes disponibles</p>
)}

<h2>Comentarios</h2>
{message && <p>{message}</p>}
  <form>
    <div>
      <label htmlFor="content">Comentario</label>
      <textarea 
        id="content"
        value ={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Escribe ti comentario aqui'>
    </textarea>
    </div>
    <button type="submit" onClick={handleCommentSubmit}>Adherir Comentario</button>
  </form>
      
        </div>
      </div>

      

      
    </div></>
  );
};

export { Guitarristas };
