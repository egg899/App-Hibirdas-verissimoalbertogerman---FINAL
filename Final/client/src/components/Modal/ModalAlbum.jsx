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
    const [error, setError] = useState('');

    const [file, setFile] = useState(null);
    const [albumImage, setAlbumImage] = useState(null);
    const [imageError, setImageError] = useState("");


const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(URL.createObjectURL(selectedFile));
        setAlbumImage(selectedFile);
        //setImageError("");
    }



    // Populate form fields if editing an existing guitarist
    useEffect(() => {
        if (album) {
            setTitle(album.title);
            setDescription(album.description);
            setArtist(album.artist.name); // Set guitarist name
            setGuitaristId(album.artist._id); // Set guitarist ID
            setImage(album.image);
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

        //Validar que el año sea un numero de 4 digitos
            const yearRegex = /^\d{4}$/;
                if(!yearRegex.test(year)) {
                setError("El año debe ser un número de 4 dígitos.");
                return; // Prevent form submission
                } else {
                setError("");
                }




        console.log('albumImage:', albumImage);
        console.log('El Album del modal;', album.image);

        let imageUrl = album?.image;
        let publicId = null;
        const urlParts = album.image.split('/');
        const publicIdFromUrl = urlParts[urlParts.length - 1].split('.')[0]; // Extraemos el public_id de la URL

        publicId = publicIdFromUrl;

        if(albumImage && albumImage !== 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738173415/default-profile_yrvw0s.jpg')
        
        {
             // Primero, eliminamos la imagen anterior (si hay una)
             if (publicId) {
                try {
                    await axios.delete('https://app-hibirdas-verissimoalbertogerman.onrender.com/delete-image', {

                    //await axios.delete('http://localhost:3000/delete-image', {
                        data: { public_id: publicId }
                    });
                    // alert("Imagen anterior eliminada.");
                } catch (error) {
                    console.error("Error eliminando la imagen anterior:", error);
                }
            }
            const formData = new FormData();
            formData.append('file', albumImage);
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


        }//albumImage
        
            const newInfo = {
                    title,
                    description,
                    artist:guitaristId,
                    year,
                    image: imageUrl  // Correct field name based on the object structure
        };

        // const newInfo = new FormData();
        // newInfo.append('title', title),
        // newInfo.append('description', description),
        // newInfo.append('artist', guitaristId),
        // newInfo.append('year', year),
        // newInfo.append('albumImage', albumImage);


        // También puedes probar a imprimir los valores que estás agregando:
            console.log('title:', title);
            console.log('description:', description);
            console.log('artist:', guitaristId);
            console.log('year:', year);
            console.log('image:', albumImage);
       
// if (!albumImage) {
//     console.error('No file selected for albumImage.');
//     return;
// }

        try {
            
            if (album) {
                console.log("Updating album:", newInfo);
                console.log("Album ID being passed:", albumId);

                // Edit existing album
                await axios.put(`https://app-hibirdas-verissimoalbertogerman.onrender.com/albums/${albumId}`, newInfo, {

                // await axios.put(`http://localhost:3000/albums/${albumId}`, newInfo, {
                    headers: {"Content-Type": "multipart/form-data"}
                  });
            } else {
                // Add new album
                await axios.post('https://app-hibirdas-verissimoalbertogerman.onrender.com/albums', newInfo, {

                // await axios.post('http://localhost:3000/albums', newInfo, {
                    headers: {"Content-Type": "multipart/form-data"}
                  });
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
                        onChange={(e) => setYear(e.target.value.trim())}
                    />
                    {error && <h3 className="alert alert-danger mt-3">{error}</h3>}
                    <input
                        type="text"
                        placeholder="Ártista"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
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

                    <button type="submit">{album ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>
        </div>
    );
};

export default ModalAlbum;
