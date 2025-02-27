# API - fianl-albertogermanverissimo

Este es el backend de la aplicación, desarrollado con Node.js, Express y MongoDB.

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) (versión recomendada: 18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) o una instancia local de MongoDB
- [Cloudinary](https://cloudinary.com/) para la gestión de imágenes (opcional)

## Instalación

1. Clona este repositorio:
   ```sh
   git clone https://github.com/egg899/App-Hibirdas-verissimoalbertogerman---FINAL

2. Accede al directorio 

cd App-Hibirdas-verissimoalbertogerman---FINAL/Final/api

3. Instala las dependecias
npm install

4. Crea un archivo .env en la raíz del proyecto y agrega tus variables de entorno:
SECRET_KEY=SECRETA


MONGODB_URI='mongodb+srv://albertoverissimo:1234@cluster0.xtczf.mongodb.net/final?retryWrites=true&w=majority'


EXPIRATION=72h

CLOUDINARY_CLOUD_NAME=dkk4j1f0q
CLOUDINARY_API_KEY=439581662584764
CLOUDINARY_API_SECRET=AToGhWlYc7a-x1tXh-oHrV3WQ44



# Dependencias Instaladas

## Este proyecto utiliza las siguientes dependencias:

atob: Decodificación de Base64 en Node.js.
axios: Cliente HTTP para realizar peticiones a APIs.
bcrypt: Librería para el hashing de contraseñas.
cloudinary: Servicio para la gestión y almacenamiento de imágenes en la nube.
core-js: Polyfills para compatibilidad con JavaScript moderno.
cors: Middleware para habilitar CORS en Express.
dotenv: Carga variables de entorno desde un archivo .env.
express: Framework web para Node.js.
jsonwebtoken: Manejo de autenticación con tokens JWT.
jwt-decode: Decodificación de tokens JWT en el cliente.
mongodb: Controlador oficial de MongoDB para Node.js.
mongoose: ODM para trabajar con MongoDB en Node.js.
multer: Middleware para la gestión de archivos en formularios.
nodemon: Herramienta para reiniciar el servidor automáticamente en desarrollo.
socket.io: Comunicación en tiempo real con WebSockets.




## Ejecución del Cliente
# Para iniciar el cliente en modo desarrollo:
npm run dev


# Para compilar el cliente para producción:
npm run build