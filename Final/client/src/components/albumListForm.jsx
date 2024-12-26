import React from 'react';


const AlbumListForm = ({
    title,
    year,
    artist,
    image,
    description,
    setTitle,
    setYear,
    setArtist,
    setImage,
    setDescription,
    handleSubmit

}) => {
    return (
        <>
        <h2>Agregar Album</h2>
        <form className="form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Título del Album"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Año de Publicación"
                value={year}
                onChange={(e) => setYear(e.target.value)}/>

                <input
                type="text"
                placeholder="Artista"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
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
            />
                
            <button type="submit">Agregar Album</button>
        </form>
        </>
    )
}

export default AlbumListForm;