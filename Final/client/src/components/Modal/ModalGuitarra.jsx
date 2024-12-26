import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.scss';
//import '../../styles/estilo.scss';

const ModalGuitarra = ({ guitarist, guitaristId, onClose, onGuitaristSaved }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('');
    const [albums, setAlbums] = useState('');
    const [image, setImage] = useState('');

    // Populate form fields if editing an existing guitarist
    useEffect(() => {
        if (guitarist) {
            setName(guitarist.name);
            setDescription(guitarist.description);
            setStyle(guitarist.style);
            setAlbums(guitarist.albums.join(', '));
            setImage(guitarist.imageUrl);  // Assuming `imageUrl` field is the one to be used
        }
    }, [guitarist]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', { name, description, style, albums, image });
        const albumsArray = albums.split(',').map(album => album.trim());

        const newInfo = {
            name,
            description,
            style,
            albums:albumsArray,
            imageUrl: image  // Correct field name based on the object structure
        };

        try {
            
            if (guitarist) {
                // Edit existing guitarist
                await axios.put(`http://localhost:3000/guitarists/${guitaristId}`, newInfo);
            } else {
                // Add new guitarist
                await axios.post('http://localhost:3000/guitarists', newInfo);
            }

            // Close modal after submit
            console.log('Guitarist info saved');
            onGuitaristSaved();  // Trigger parent component to update guitarists list
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
                <h2>{guitarist ? 'Editar Guitarrista' : 'Nuevo Guitarrista'}</h2>
                <form className="form" onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                        
                   
                    

                    <input
                        type="text"
                        placeholder="Estilo (Si es más de uno, separar por comas)"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Álbumes (Si es más de uno, separar por comas)"
                        value={albums}
                        onChange={(e) => setAlbums(e.target.value)}
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

                    <button type="submit">{guitarist ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>
        </div>
    );
};

export default ModalGuitarra;
