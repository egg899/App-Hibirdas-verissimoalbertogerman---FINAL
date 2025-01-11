import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home, Albums, Guitarristas, AlbumsLista, Register, Login, Usuario, GestionarUsuarios, GuardarImg } from './pages'
import ProtectedRoutes from './utils/ProtectedRoutes'

function App() {
 

  return (
    <>
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/albumsLista" element={ <AlbumsLista/> }/>
        <Route path="/guitarristas/:id" element={ <Guitarristas/> } />
        <Route path="/albums/titulo/:titulo" element={ <Albums/> } />
        <Route path="/gestionarUsuarios" element={<GestionarUsuarios/>} />
        <Route path="/register" element={ <Register/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/GuardarImg" element={ <GuardarImg/> } />

        <Route element={<ProtectedRoutes/>}>
        {/* <Route path="/usuarios/nombre/:name" element={ <Usuario/> } /> */}
        <Route path="/usuarios/:id" element={ <Usuario/> } />
        </Route>
      </Routes>
    </>
  )
}

export default App
