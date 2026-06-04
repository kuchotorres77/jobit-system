import "dotenv/config"
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/routes';
import db from "./config/mongo"
// import { router } from "./routes/prestador";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
db()
    .then(() => {
        console.log('Conexión a la base de datos exitosa')
    })
    .catch((error: any) => {
        console.log('Error al conectar a la base de datos: ', error)
    });

// Rutas
app.use('/api', routes);
// app.use('/api', router);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});