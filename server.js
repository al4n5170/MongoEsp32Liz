// Importar los módulos necesarios
const express = require('express'); // Framework para crear servidores web
const mongoose = require('mongoose'); // Biblioteca para interactuar con MongoDB
const bodyParser = require('body-parser'); // Middleware para manejar datos JSON en el cuerpo de las solicitudes

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000; // Puerto en el que correrá el servidor

// Middleware
app.use(bodyParser.json()); // Configura el middleware para parsear JSON en las solicitudes

// Conexión a MongoDB Atlas
const dbURI = "mongodb+srv://alan:Alan2005@cluster0.aifnqqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas')) // Mensaje si la conexión es exitosa
  .catch((err) => console.log(err)); // Mensaje si hay un error en la conexión

// Definir el esquema de los datos del sensor
const sensorSchema = new mongoose.Schema({
  temperatura: Number, // Campo para la temperatura, tipo número
  humedad: Number, // Campo para la humedad, tipo número
  // timestamp: { type: Date, default: Date.now } // Opcional: Fecha y hora de la lectura
});

// Crear el modelo basado en el esquema
const SensorData = mongoose.model('DHT11', sensorSchema); // Nombre de la colección: DHT11

// Ruta para recibir datos del ESP32 (API)
app.post('/temperatura', (req, res) => {
  const { temperatura, humedad } = req.body; // Extraer temperatura y humedad del cuerpo de la solicitud
  console.log("Datos recibidos:", req.body); // Mostrar datos por consola

  const nuevaLectura = new SensorData({ temperatura, humedad }); // Crear nueva entrada
  nuevaLectura.save() // Guardar en la base de datos
    .then(data => res.json(data)) // Respuesta con los datos guardados
    .catch(error => res.status(500).json({ message: error })); // Respuesta en caso de error
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`); // Confirmar que el servidor está activo
});
