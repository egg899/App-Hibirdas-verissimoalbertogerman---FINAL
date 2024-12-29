import React from "react";
import "../styles/estilo.scss"
const ComentarioGuit = ({ message, content, setContent, handleCommentSubmit }) => {
  return (
    <div className="container mt-5">
      <div
        className="card p-4 border-0 rounded-3"
        style={{ backgroundColor: "#2c2c2c", color: "#f5f5f5" }}
      >
        <h2 className="text-center mb-4" style={{ color: "#00d8ff" }}>
          Agregar comentario aquí
        </h2>

        {message && (
          <div
            className={`alert ${
              message.toLowerCase().includes("error") ? "alert-danger" : "alert-success"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form>
          <div className="mb-3">
            <label
              htmlFor="content"
              className="form-label fw-semibold"
              style={{ color: "#cccccc" }}
            >
              Tu comentario
            </label>
            <textarea
              id="content"
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Excribe tu comentario aqui..."
              rows="4"
             
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4 py-2"
              style={{
                backgroundColor: "#00d8ff",
                border: "none",
                color: "#1e1e1e",
                fontWeight: "bold",
                borderRadius: "8px",
              }}
              onClick={handleCommentSubmit}
            >
             Comentar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComentarioGuit;
