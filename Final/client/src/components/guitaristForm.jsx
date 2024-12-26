import React from 'react';

const GuitaristForm = ({
name, style, albums, image, description, setName, setStyle, setAlbums, setImage, 
setDescription, handleSubmit
}) => {
    return (

      <>
      <h2>Agregar Guitarrista</h2>


        <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Estilo (Si es mas de uno, separar por comas)"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Álbumes (Si es mas de uno, separar por comas)"
        value={albums}
        onChange={(e) => setAlbums(e.target.value)}
      />
      <input
        type="text"
        placeholder="Link de la imagen"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button type="submit">Agregar</button>
    </form>
    </>
    )
}

export default GuitaristForm;