import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.scss';


const ModalUsuario = ({ user, userId, onClose, onUserSaved}) => {
    const [ name, setName ] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
   

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
        e.preventDefault();
        console.log('Enviando: ', {name, username, email, role, password});

        const newInfo = {
            name,
            username,
            email,
            role, 
            password
        }

        try{
            if(user){
                await axios.put(`http://localhost:3000/usuarios/${userId}`, newInfo);
            } else {
                await axios.post('http://localhost:3000/usuarios', newInfo);
            }

            console.log('La info del Usuario ha sido guardada');
            onUserSaved();
            onClose();

        } catch(error) {
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