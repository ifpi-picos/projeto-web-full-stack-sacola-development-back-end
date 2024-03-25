import app from "./app.js";

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});