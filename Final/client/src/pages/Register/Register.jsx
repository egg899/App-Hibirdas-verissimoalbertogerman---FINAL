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
    role: "user", // Valor por defecto
  });

  const [file, setFile] = useState(null); // Para la vista previa de la imagen
  const [image, setImage] = useState(null); // Para almacenar el archivo seleccionado
  const [error, setError] = useState({});
  const [imgError, setImgError] = useState(''); 
  const [regError, setRegError] = useState(''); 
  const { user, auth, logoutUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(URL.createObjectURL(selectedFile)); // Vista previa
    setImage(selectedFile); // Almacena el archivo seleccionado
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let newErrors = {};

  if (!userData.name) {
    newErrors.name = "Por favor, ingrese su nombre.";
  }
  if (!userData.username) {
    newErrors.username = "Por favor, ingrese un nombre de usuario.";
  }
  if (!userData.email) {
    newErrors.email = "Por favor, ingrese su correo electrónico.";
  } else if (!emailRegex.test(userData.email)) {
    newErrors.email = "Por favor, ingrese un email válido.";
  }
  if (!userData.password) {
    newErrors.password = "Por favor, ingrese una contraseña.";
  }

  // Si hay errores, actualiza el estado y sal de la función
  if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;  // Esto evita continuar si hay errores
  }

  setError({}); //Limpiar errores si todo está bien

    // Subir la imagen a Cloudinary
    let imageUrl = "";
    if (image) {
        const imageFormData = new FormData();
        imageFormData.append("file", image);
        imageFormData.append("upload_preset", "app-hib"); // Asegúrate de usar tu preset

        try {
            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/dkk4j1f0q/image/upload`,
                imageFormData
            );
            imageUrl = cloudinaryRes.data.secure_url;
        } catch (error) {
            console.error("Error al subir imagen:", error);
            setImgError("Error al subir imagen");
            return;
        }
    }

    // Crear FormData con la URL de la imagen
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", userData.role);
    formData.append("imageUrl", imageUrl); // Ahora se envía la URL

    try {
      const res = await axios.post("https://app-hibirdas-verissimoalbertogerman.onrender.com/usuarios/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        // const res = await axios.post("http://localhost:3000/usuarios/register", formData, {
        //     headers: { "Content-Type": "multipart/form-data" },
        // });
        console.log(res.data);
        navigate("/login");
    } catch (error) {
        console.error(error);
        setRegError(error.response?.data || "Error en el registro");
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
          <form onSubmit={handleRegister} encType="multipart/form-data" noValidate>
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
                {error.name && <div className="alert alert-danger mt-3">{error.name}</div>}

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
               {error.username && <div className="alert alert-danger mt-3">{error.username}</div>}

            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                
              />
        {error.email && <div className="alert alert-danger mt-3">{error.email}</div>}

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
       {error.password && <div className="alert alert-danger mt-3">{error.password}</div>}

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
            
           
          {imgError && <div className="alert alert-danger">{imgError}</div>}

          {regError && <div className="alert alert-danger">{regError}</div>}

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
