import React,  { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AlbumListForm = ({
    title,
    year,
    artist,
    albumImage,
    description,
    setTitle,
    setYear,
    setArtist,
    setAlbumImage,
    setDescription,
    albums,
    file,
    handleFileChange,
    handleSubmit,

    

}) => {

    const [guitarristas, setGuitarristas] = useState([]); 
    const [selectedGuitaristAlbums, setSelectedGuitaristAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);

    const fetchGuitarists = async () => {
        try {
            const response = await axios.get('http://localhost:3000/guitarists');
            setGuitarristas(response.data);

        } catch (err) {
            console.error('Error al agarrar informacion los guitarristas' ,err);
        }
    }//fetchGuitarists

    // console.log('Guitarristas desde el album: ', guitarristas);
    // console.log('Album de Guitarrista Seleccionado ', selectedGuitaristAlbums);
    // console.log('Albums en la lista: ', albums);
    // console.log('Albumes filtrados', filterdAlbums);
    // console.log('artista: ',artist);
    useEffect(() => {
        fetchGuitarists();
        
    }, [selectedGuitaristAlbums]);
    
    return (
        <>
        <h2>Agregar Album</h2>
        <form className="form" onSubmit={handleSubmit}>

        <label htmlFor="artist" hidden>Artista</label>
            <select name="artist" value={artist} onChange={(e)=>
               
                {
                    

                    let selectedGuitarist = guitarristas.find(
                        (guitarrista) => guitarrista.name === e.target.value
                    )

                    let albumesDisponibles = albums.map((album) => {
                      return album.title;   
                    });

                    // setFilterdAlbums(albumesDisponibles);

                    setArtist(e.target.value); 
                    console.log('Selected Guitarist ', selectedGuitarist);
                    console.log('Albumes Disponibles ', albumesDisponibles);


                    let diferencias = selectedGuitarist.albums.filter((item)=>!albumesDisponibles.includes(item));
                    console.log('Diferencias ', diferencias);
                    setSelectedGuitaristAlbums(diferencias);
                }
                }>
                <option value="">Seleccione a un artista</option>  {/* En caso de que no se haya seleccionado ninguno */}
                
                {
                    guitarristas.map((guitarrista,i) =>{
                        return (
                            <option key={guitarrista._id} value={guitarrista.name}>{i+1} - {guitarrista.name}</option>
                        )
                    })
                }
            </select>  

            <label htmlFor="title" hidden>Titulo del Album</label>
            <select name="title" value={title} onChange={(e)=>{
                setTitle(e.target.value)
            }
                
                
                }>
                <option value="">Seleccione a un titulo</option>  {/* En caso de que no se haya seleccionado ninguno */}
               {
                selectedGuitaristAlbums.map((album, i) =>{
                    return (
                        <option key={i} value={album}>{album}</option>
                    )
                })
                
 
               }
            </select>  





            {/* <input
                type="text"
                placeholder="Título del Album"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            /> */}
            <input
                type="text"
                placeholder="Año de Publicación"
                value={year}
                onChange={(e) => setYear(e.target.value.trim())}/>

                {/* <input
                type="text"
                placeholder="Artista"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
            /> */}
                 
            {/* <input
                type="text"
                placeholder="Link de la imagen"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            /> */}

        <input 
            type="file"
            className="form-control mb-2"
            accept="image/*"
            onChange ={handleFileChange}

        />
        {file && <img src={file} alt="preview" style={{ marginTop: "20px", marginBottom: "20px", width: "300px" }} />}

            <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
                
            <button type="submit">Agregar Album</button>
        </form>
        </>
    )
}

export default AlbumListForm;