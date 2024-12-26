import React from 'react';
import '../../styles/ConfirmationModalStyles.scss'; 

const ConfirmationModal = ({ onConfirm, onCancel, subject, albums }) => {
  


  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>¿Estás seguro que deseas borrar este {subject}?</h3>
        {albums && albums.length > 0 && (
          <p>
            Además, se eliminarán también los siguientes álbumes:
            {albums.map((album, index) => (
              <span key={index}>{album}, </span>
            ))}
          </p>
        )}



        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-confirm">Si</button>
          <button onClick={onCancel} className="btn-cancel">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
