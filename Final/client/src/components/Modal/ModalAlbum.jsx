import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.scss';
//import '../../styles/estilo.scss';

const ModalAlbum = ({ album, albumId, onClose, onAlbumSaved }) => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [guitaristName, setGuitaristName] = useState(''); // Storing guitarist name
    const [guitaristId, setGuitaristId] = useState(''); // Storing guitarist 
    const [artist, setArtist] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    // Populate form fields if editing an existing guitarist
    useEffect(() => {
        if (album) {
            setTitle(album.title);
            setDescription(album.description);
            setArtist(album.artist.name); // Set guitarist name
            setGuitaristId(album.artist._id); // Set guitarist ID
            setImage(album.imageUrl);
            setYear(album.year);
        }
    }, [album]);

    // Fetch guitarist ID based on guitarist's name
    useEffect(() => {
        if (guitaristName) {
            const fetchGuitaristId = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/guitarists/id/${guitaristName}`);
                    setGuitaristId(response.data); // Set guitarist ID when found
                } catch (error) {
                    console.error("Error fetching guitarist:", error);
                    setGuitaristId(''); // Reset if no guitarist found
                }
            };

            fetchGuitaristId();
        }
    }, [guitaristName]); // Trigger when the name changes
console.log('GuitaristId', guitaristId);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', { title, description, artist, year, image });

        const newInfo = {
            title,
            description,
            artist:guitaristId,
            year,
            imageUrl: image  // Correct field name based on the object structure
        };

        try {
            
            if (album) {
                console.log("Updating album:", newInfo);
                console.log("Album ID being passed:", albumId);

                // Edit existing album
                await axios.put(`http://localhost:3000/albums/${albumId}`, newInfo);
            } else {
                // Add new album
                await axios.post('http://localhost:3000/albums', newInfo);
            }

            // Close modal after submit
            console.log('Album info saved');
            onAlbumSaved();  // Trigger parent component to update guitarists list
            onClose();
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modalWrapper">
            <div className="modal-content ">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>{album ? 'Editar Álbum' : 'Nuevo Álbum'}</h2>
                <form className="form" onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        placeholder="Titulo del Álbum"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                        
                   
                    <input
                        type="text"
                        placeholder="Año del Álbum"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Ártista"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Link de la imagen"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />

                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <button type="submit">{album ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>
        </div>
    );
};

export default ModalAlbum;
