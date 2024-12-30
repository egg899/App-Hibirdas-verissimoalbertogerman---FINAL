import React from 'react';
import '../../styles/ConfirmationModalStyles.scss'; 

const DeleteModal = ({ onConfirm, onCancel, userName }) => {
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h3>¿Estás seguro que deseas borrar a {userName}?</h3>
        <p>Esta acción no se puede deshacer.</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-confirm">
            Sí, borrar
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
