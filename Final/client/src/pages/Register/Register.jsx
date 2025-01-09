import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",  // Establece un valor por defecto en 'user'
  });
  const [error, setError] = useState("");
  const {user, auth, logoutUser} = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

   const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    // Generate a preview URL
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
   };


   const handleUpload = async (event) => {
    event.preventDefault();
    console.log('image: ', file);
    if (!file) {
      setUploadMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    if(file){
      console.log('File to upload:', file);
      formData.append("image", file);    
    }
    
    
    try {
      console.log('formData: ', formData);
       for (let [key, value] of formData.entries()) {
         console.log('formData',`${key}:`, value);
       }
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log('File uploaded:', response.data);
      setUploadMessage(response.data.message);
    }catch(error) {
      console.error("Error uploading file", error.response ? error.response.data : error.message);
      setUploadMessage("Failed to upload file");
    }



   }//handleUpload

  console.log("user Logged", user);

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/usuarios/register', userData)
      .then((res) => {
        console.log(res);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  }

  useEffect(() => {
    if(user){
      if(user.role == 'admin') {
      setIsAdmin(true);
    }else{
      setIsAdmin(false);
    }
    }
    
  }, [user]);

 
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-lg-12">
        
        {/* <div style={{ textAlign:"center", marginTop: "50px"  }}>
          <h1>Image Upload</h1>
            <form onSubmit={handleUpload}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
            {preview && <img src={preview} alt="preview" style={{ marginTop: "20px", width: "300px" }} />}
            {uploadMessage && <p>{uploadMessage}</p>}

        </div> */}



           <h1 className="text-center">Registrarse</h1>
          <p className="text-center">Crea una cuenta para comenzar a usar nuestra plataforma.</p>
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
              />
            </div>

            {isAdmin && (
              <div className="form-group mb-3">
                <label htmlFor="role">Rol</label>
                <select
                  id="role"
                  className="form-control"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="contributor">Contribuidor</option>
                </select>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
          </form> 
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/')}
      >
        Volver
      </button>
    </div>
  );
};

export { Register };
