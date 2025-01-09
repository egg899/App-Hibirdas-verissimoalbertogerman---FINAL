function validateBody(req, res, next) {
    if ((req.method === "POST" || req.method === "PUT") && req.is('multipart/form-data') === false) {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ mensaje: "El cuerpo de la solicitud no puede estar vacio" });
        }
    }
    next();
}

export default validateBody;
