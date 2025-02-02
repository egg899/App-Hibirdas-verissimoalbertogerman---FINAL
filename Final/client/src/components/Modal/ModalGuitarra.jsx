import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.scss';
//import '../../styles/estilo.scss';

const ModalGuitarra = ({ guitarist, guitaristId, onClose, onGuitaristSaved, auth }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('');
    const [albums, setAlbums] = useState('');
    const [image, setImage] = useState('');

    const [file, setFile] = useState(null);
    const [guitImage, setguitImage] = useState(null);
    const [error, setError] = useState("");


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(URL.createObjectURL(selectedFile));
        setguitImage(selectedFile);
        
    }


    // Populate form fields if editing an existing guitarist
    useEffect(() => {
        if (guitarist) {
            setName(guitarist.name);
            setDescription(guitarist.description);
            setStyle(guitarist.style);
            setAlbums(guitarist.albums.join(', '));
            //setImage(guitarist.imageUrl);  // Assuming `imageUrl` field is the one to be used
            
        }
    }, [guitarist]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting desde el Modal:', { name, description, style, albums, image });
        const albumsString = albums.split(',').map(album => album.trim()).join(',');

        let imageUrl = guitarist?.image;
        let publicId = null;
        const urlParts = guitarist.image.split('/');
        const publicIdFromUrl = urlParts[urlParts.length - 1].split('.')[0]; // Extraemos el public_id de la URL
        
        publicId = publicIdFromUrl;
        console.log('publicId loco: ', publicId);
        console.log('La imagen mi amigazo: ', guitImage);


        if(guitImage && guitImage !== 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738173415/default-profile_yrvw0s.jpg' ) {
            // Primero, eliminamos la imagen anterior (si hay una)
                if (publicId) {
                    try {
                        await axios.delete('http://localhost:3000/delete-image', {
                            data: { public_id: publicId }
                        });
                        // alert("Imagen anterior eliminada.");
                    } catch (error) {
                        console.error("Error eliminando la imagen anterior:", error);
                    }
                }
                const formData = new FormData();
                formData.append('file', guitImage);
                formData.append("upload_preset", "app-hib"); // Asegúrate de usar tu preset
        
        
                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/dkk4j1f0q/image/upload`,
                        formData
                    );
                    imageUrl = response.data.secure_url;
                } catch(error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    setError('Error uploading image to Cloudinary');
                    return;
                }
        
        
            }//image


        const formData = {
            name,
            description,
            style,
            albums:albumsString,
            image: imageUrl  // Correct field name based on the object structure
        };

        // const formData = new FormData();
        // formData.append('name', name);
        // formData.append('description', description);
        // formData.append('style', style);
        // formData.append('albums', albumsString);
        // if(guitImage) {
        //     formData.append('guitaristImage', guitImage);
        // }
        // console.log('albumsArray: ',albumsString);

        try {
            
            if (guitarist) {
                // Edit existing guitarist
                // await axios.put(`http://localhost:3000/guitarists/${guitaristId}`, formData, { headers:{'authorizartion':auth}});
                await axios.put(`https://app-hibirdas-verissimoalbertogerman.onrender.com/${guitaristId}`, formData, { headers:{'authorizartion':auth}});

            } else {
                // Add new guitarist
                // await axios.post('http://localhost:3000/guitarists', formData);
                await axios.post('https://app-hibirdas-verissimoalbertogerman.onrender.com/guitarists', formData);

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
                        onChange={handleFileChange}
                    />
                    {file && <img src={file} alt="preview" style={{ marginTop: "20px", marginBottom: "20px", width: "300px" }} />}

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
