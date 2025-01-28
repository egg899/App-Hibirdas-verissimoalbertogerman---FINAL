import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


// const Register = () => {
//   const navigate = useNavigate();
  
//   const [userData, setUserData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     password: "",
//     role: "user",  // Establece un valor por defecto en 'user'
//   });
//   const [error, setError] = useState("");
//   const {user, auth, logoutUser} = useContext(AuthContext);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [file, setFile] = useState(null);
//   const [image, setImage] = useState(null); // For storing the selected file
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null); 

//    const handleFileChange = (event) => {
//     console.log("handleFileInput working!!!");
//     const selectedFile = event.target.files[0];
//     setFile(URL.createObjectURL(selectedFile)); // Preview the selected file
//     setImage(selectedFile); // Store the file for upload
//     setSelectedFile(selectedFile); // Store the selected file
//    // formData.append('my-image-file', selectedFile);
//    console.log('Selected file:', selectedFile);
   
//    };


//    const handleUpload = async (event) => {
//     event.preventDefault();
//     console.log('image: ', file);
    

//     const formData = new FormData();
//     formData.append("file", image); 
    
//      // Logging to ensure formData is populated correctly
//      console.log('formData before sending:', formData);
    
//     try {
//       console.log('formData: ', formData);
//        for (let [key, value] of formData.entries()) {
//          console.log('formData',`${key}:`, value);
//        }
//       const response = await axios.post("http://localhost:3000/image-upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log('File uploaded:', response.data);
//       setUploadMessage(response.data.message);
//     }catch(error) {
//       console.error("Error uploading file", error.response ? error.response.data : error.message);
//       setUploadMessage("Failed to upload file");
//     }



//    }//handleUpload

//   console.log("user Logged", user);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     await axios.post('http://localhost:3000/usuarios/register', userData)
//       .then((res) => {
//         console.log(res);
//         navigate('/login');
//       })
//       .catch((error) => {
//         console.log(error);
//         setError(error.response.data.message);
//       });
//   }

//   useEffect(() => {
//     if(user){
//       if(user.role == 'admin') {
//       setIsAdmin(true);
//     }else{
//       setIsAdmin(false);
//     }
//     }
    
//   }, [user]);

 
//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col col-lg-12">
        
//         <div style={{ textAlign:"center", marginTop: "50px"  }}>
//           <h1>Image Upload</h1>
//             <form onSubmit={handleUpload}>
//               <input type="file" accept="image/*" onChange={handleFileChange} />
//               <button type="submit">Upload</button>
//             </form>
//             {file && <img src={file} alt="preview" style={{ marginTop: "20px", width: "300px" }} />}
//             {uploadMessage && <p>{uploadMessage}</p>}

//         </div>



//            <h1 className="text-center">Registrarse</h1>
//           <p className="text-center">Crea una cuenta para comenzar a usar nuestra plataforma.</p>
//           <form onSubmit={handleRegister}>
//             <div className="form-group mb-3">
//               <label htmlFor="name">Nombre</label>
//               <input
//                 type="text"
//                 id="name"
//                 className="form-control"
//                 value={userData.name}
//                 onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                
//               />
//             </div>

//             <div className="form-group mb-3">
//               <label htmlFor="username">Nombre de usuario</label>
//               <input
//                 type="text"
//                 id="username"
//                 className="form-control"
//                 value={userData.username}
//                 onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                
//               />
//             </div>

//             <div className="form-group mb-3">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 className="form-control"
//                 value={userData.email}
//                 onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                
//               />
//             </div>

//             <div className="form-group mb-3">
//               <label htmlFor="password">Contraseña</label>
//               <input
//                 type="password"
//                 id="password"
//                 className="form-control"
//                 value={userData.password}
//                 onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                
//               />
//             </div>

//             {isAdmin && (
//               <div className="form-group mb-3">
//                 <label htmlFor="role">Rol</label>
//                 <select
//                   id="role"
//                   className="form-control"
//                   value={userData.role}
//                   onChange={(e) => setUserData({ ...userData, role: e.target.value })}
//                 >
//                   <option value="user">Usuario</option>
//                   <option value="admin">Administrador</option>
//                   <option value="contributor">Contribuidor</option>
//                 </select>
//               </div>
//             )}

//             {error && <div className="alert alert-danger">{error}</div>}

//             <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
//           </form> 
//           <p className="mt-3 text-center">
//             ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
//           </p>
//         </div>
//       </div>
//       <button
//         className="btn btn-secondary mt-3"
//         onClick={() => navigate('/')}
//       >
//         Volver
//       </button>
//     </div>
//   );
// };

// export { Register };

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user", // Valor por defecto
  });

  const [file, setFile] = useState(null); // Para la vista previa de la imagen
  const [image, setImage] = useState(null); // Para almacenar el archivo seleccionado
  const [error, setError] = useState("");
  const { user, auth, logoutUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(URL.createObjectURL(selectedFile)); // Vista previa
    setImage(selectedFile); // Almacena el archivo seleccionado
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", userData.role);

    // Agregar la imagen solo si fue seleccionada
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      // const res = await axios.post("http://localhost:3000/usuarios/register", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const res = await axios.post("https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Error en el registro");
    }
  };

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "admin");
    }
  }, [user]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-lg-12">
          <h1 className="text-center">Registrarse</h1>
          <p className="text-center">Crea una cuenta para comenzar a usar nuestra plataforma.</p>
          <form onSubmit={handleRegister} encType="multipart/form-data">
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

            <div className="form-group mb-3">
              <label htmlFor="profileImage">Imagen de perfil (opcional)</label>
              <input
                type="file"
                id="profileImage"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {file && <img src={file} alt="preview" style={{ marginTop: "20px", width: "300px" }} />}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block">
              Registrarse
            </button>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
        Volver
      </button>
    </div>
  );
};

export { Register };
