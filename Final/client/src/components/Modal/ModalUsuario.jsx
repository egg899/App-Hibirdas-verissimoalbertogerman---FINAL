import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.scss';


const ModalUsuario = ({ user, userId, onClose, onUserSaved}) => {
    const [ name, setName ] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
   
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(URL.createObjectURL(selectedFile));
        setImage(selectedFile);
    }

    console.log('user desde Modal', user);
    useEffect(() => {
        if(user){
            setName(user.name);
            setUserName(user.username);
            setEmail(user.email);
            setRole(user.role);
            setPassword(user.password);
        }
    }, [user]);
    
//  const handleSubmit = async (e) => {
        
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("username", username);
//     formData.append("email", email);
//     formData.append("role", role);
//     if(password){
//         formData.append("password", password);
//     }
    
//     if (image) {
//         formData.append("profileImage", image); // Agrega la imagen solo si existe
//     }

//     try {
//         if (user) {
//             await axios.put(`http://localhost:3000/usuarios/${userId}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         } else {
//             await axios.post('http://localhost:3000/usuarios', formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         }

//         console.log('La info del Usuario ha sido guardada');
//         onUserSaved();
//         onClose();

//     } catch (error) {
//         console.log('Error:', error);
//     }

//     };//handleSubmit


const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = user?.image;
    let publicId = null;
    const urlParts = user.image.split('/');
        const publicIdFromUrl = urlParts[urlParts.length - 1].split('.')[0]; // Extraemos el public_id de la URL
        publicId = publicIdFromUrl;
    console.log('publicId loco: ', publicId);
    console.log('La imagen mi amigazo: ', image)


    if(image && image !== 'https://res.cloudinary.com/dkk4j1f0q/image/upload/v1738173415/default-profile_yrvw0s.jpg' ) {
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
        formData.append('file', image);
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

    const userData = {
        name,
        username,
        email,
        role,
        image: imageUrl, // Enviar la URL en lugar del archivo
    };

    if (password) {
        userData.password = password;
    }


    try {
        if (user) {
            await axios.put(`https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios/${userId}`, userData);
        } else {
            await axios.post("https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios", userData);
        }
        // if (user) {
        //     await axios.put(`http://localhost:3000/usuarios/${userId}`, userData);
        // } else {
        //     await axios.post("http://localhost:3000/usuarios", userData);
        // }

        console.log("La info del usuario ha sido guardada");
        onUserSaved();
        onClose();
    } catch (error) {
        console.error("Error:", error);
    }
}///handleSubmit





    return (
        <div className="modalWrapper">
            <div className="modal-content ">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <form className="form" onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                        
                   
                    

                    <input
                        type="text"
                        placeholder="User Name"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {(user?.role === 'admin') ?
                    (<select 
                        value={role}
                        onChange={(e) => setRole( e.target.value )}
                        >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="contributor">Contribuidor</option>
                    </select>): null}
                    
                    <label htmlFor="profileImage" className ="etiqueta">Imagen de perfil (opcional)</label>

                        <input
                            type="file"
                            className='form-control mb-3'
                            accept="image/*"
                            onChange={handleFileChange}
                        />     
                      {file && <img src={file} alt="preview" style={{ marginTop: "20px", width: "300px" }} />}



                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    

                    <button type="submit">{user ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </div>
        </div>
    );

}//ModalUsuario

export default  ModalUsuario;