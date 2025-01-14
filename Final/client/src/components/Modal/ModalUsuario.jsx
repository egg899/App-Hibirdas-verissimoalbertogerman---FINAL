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
    
    const handleSubmit = async (e) => {
        // e.preventDefault();
        // console.log('Enviando: ', {name, username, email, role, image, password});

        // const newInfo = {
        //     name,
        //     username,
        //     email,
        //     role, 
        //     image,
        //     password
        // }

        // try{
        //     if(user){
        //         await axios.put(`http://localhost:3000/usuarios/${userId}`, newInfo);
        //     } else {
        //         await axios.post('http://localhost:3000/usuarios', newInfo);
        //     }

        //     console.log('La info del Usuario ha sido guardada');
        //     onUserSaved();
        //     onClose();

        // } catch(error) {
        //     console.log('Error:', error);
        // }


        e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("role", role);
    if(password){
        formData.append("password", password);
    }
    
    if (image) {
        formData.append("profileImage", image); // Agrega la imagen solo si existe
    }

    try {
        if (user) {
            await axios.put(`http://localhost:3000/usuarios/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } else {
            await axios.post('http://localhost:3000/usuarios', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

        console.log('La info del Usuario ha sido guardada');
        onUserSaved();
        onClose();

    } catch (error) {
        console.log('Error:', error);
    }

    };//handleSubmit

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