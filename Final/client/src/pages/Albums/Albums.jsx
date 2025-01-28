import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import Nav from '../../components/Nav'
const Albums = () => {
  const { titulo } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null); // Start with `null` to differentiate no data
  const [guitaristName, setGuitaristName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);


  const {user, auth, logoutUser} = useContext(AuthContext);
  console.log('user',user);


  const fetchAlbumsDetails = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`http://localhost:3000/albums/titulo/${titulo}`);
      const response = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/albums/titulo/${titulo}`);

      setTimeout(() => {
        setAlbum(response.data[0] || null); //  nulo si no hay album
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

useEffect(() => {
  if(album && album.artist) {
    const fetchGuitarristName = async () => {
      try {

       // const response = await axios.get(`http://localhost:3000/guitarists/${album.artist}`);
       const response = await axios.get(`https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists/${album.artist}`);

        setGuitaristName(response.data.name || null);

      } catch (error){
        console.error("Problemas para conseguir el nombre del giitarrista", error);
      }
    };


    fetchGuitarristName();

  }//if
}, [album])





  useEffect(() => {
    fetchAlbumsDetails();
   
  }, []);

  useEffect(() =>{
    if(user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  },[user])

 
console.log("Agarrando el nombre", guitaristName);
  if (loading)
    return (
      <div>
        <figure>
          <img
            className="albums rounded-circle bounce-animation"
            alt="collage de albums"
            style={{
              width: "60%",
              display: "block",
              margin: "0 auto",
            }}
            src="https://townsquare.media/site/295/files/2021/04/Final2.jpg?w=980&q=75"
          />
        </figure>
      </div>
    );

  if (!album) {
    return (
      <div className="container container-fluid" style={{ minHeight: "100vh" }}>
        <h1>El Album no se encuentra en la base de datos</h1>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (

    <>
    <Nav username={user?.name || null} cerrarSesion={logoutUser} isLoggedIn={isLoggedIn}/>

    <div className="container container-fluid" style={{ minHeight: "100vh" }}>
      <h1>{album.title}</h1>
      <div>
        <figure>
          <img
            className="album img-thumbnail"
            alt="Album"
            style={{
              width: "30vw",
              display: "block",
              margin: "0 auto",
            }}
            src={album.image === 'default-profile.jpg'
              ?'../../src/assets/images/uploads/' + album.image
              : '../../src/assets/images/albums/' + album.image}
          />
        </figure>
      </div>
      <p>
        <strong>Año de Publicación: </strong> {album.year}
      </p>
      <p>{album.description}</p>
      <p>
        <strong>Guitarrista: </strong>
        
        {guitaristName ? (
    <a href={`/guitarristas/${album.artist}`}>
      {guitaristName}
    </a>
  ) : (
    "Cargando..." // Show "Cargando..." if the name isn't fetched yet
  )}
        
        
        
      </p>


      
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1) || navigate('/')}>
        Volver
      </button>
    </div>
    </>
  );
};

export { Albums };
