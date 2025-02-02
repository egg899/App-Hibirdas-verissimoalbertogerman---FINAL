import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Nav from '../../components/Nav';
import ComentarioGuit from '../../components/comentarioGuit';
import ComentarioDisplay from '../../components/comentarioDisplay';
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
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);






  const fetchGuitaristsDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists/${id}`);

      // const response = await axios.get(`http://localhost:3000/guitarists/${id}`);
      setTimeout(() => {
        setGuitarrista(response.data);
        setLoading(false);
      }, 1000);

      
    //Validar la existencia del album
    const albumPromises = response.data.albums.map((album) =>
      axios
        // .get(`http://localhost:3000/albums/titulo/${album}`)
        .get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/albums/titulo/${album}`)

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
        guitarist:id

      }; //New Comment
      const response = await axios.post(`https://app-hibirdas-verissimoalbertogerman.onrender.com/comentarios/`, newComment);

      //const response = await axios.post(`http://localhost:3000/comentarios/`, newComment);
      setMessage("Comentario adherido con exito");
      setContent("");
      fetchComments();

    } catch (error) {
      console.error('Error al comentar:', error.message);
      setMessage("Hubo un error al enviar el comentario.");
    }

  }//handleCommentSubmit


const fetchComments = async () => {
    try{
      const response = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/comentarios/${id}`);

      // const response = await axios.get(`http://localhost:3000/comentarios/${id}`);
      setComments(response.data);
    }
    catch (error) {
      console.error('Error para encontrar los comentarios: ', error.message);
    }
}// fetchComments




  useEffect(() => {
    fetchGuitaristsDetails();
    
  }, []);

  useEffect(() => {
   
    fetchComments();
  }, []);
  
  console.log('Los comentarios :', comments );
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
              // src={
              //   '../../src/assets/images/guitarists/' + guitarrista.image ||
              //   'https://via.placeholder.com/300x300?text=Imagen+no+disponible'
              // }
              src={
                 guitarrista.image ||
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


      
        </div>
      </div>

     <div className="col">

      <ComentarioGuit message={message} content={content} setContent={setContent} handleCommentSubmit={handleCommentSubmit}/>
     <ComentarioDisplay comments={comments}/>
     



     </div> 

      
    </div></>
  );
};

export { Guitarristas };
