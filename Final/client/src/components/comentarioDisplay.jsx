import React from "react";

const ComentarioDisplay = ({comments}) => {
    return (
      <div className="comments-section mt-4">
    {comments.length > 0 ? (
      comments.map((comment, index) => (
        <div key={index} className="card bg-dark text-light mb-3">
          <div className="card-body text-start">
            <p className="card-text">{comment.content}</p>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-white">
                <i className="bi bi-person-circle"></i> Escrito por: <strong>{comment.user.name}</strong>
              </small>
              <small className="text-white">
                <i className="bi bi-clock"></i> {new Date(comment.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-white">No hay comentarios todavía.</p>
    )}
  </div>
    )


    
};

export default ComentarioDisplay;