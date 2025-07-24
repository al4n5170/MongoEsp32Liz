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
const dbURI ="mongodb+srv://alan:Alan2005@cluster0.aifnqqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // URI de conexión a la base de datos MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
// Conectar a MongoDB con opciones de configuración
.then((result) => console.log('Conectado a MongoDB Atlas')) // Mensaje si la conexión es exitosa
.catch((err) => console.log(err)); // Mensaje si hay un error en la conexión
// Definir el esquema de los datos del sensor
const sensorSchema = new mongoose.Schema({
temperatura: Number, // Campo para la temperatura, tipo número
humedad: Number, // Campo para la humedad, tipo número
/*timestamp: { // Comentado, es un campo para la fecha y hora de la
lectura
type: Date,
default: Date.now
}*/
});
module.exports = mongoose.model('Sensores', sensorSchema); // Exportar el modelo basado en el esquema
// Crear el modelo basado en el esquema
const SensorData = mongoose.model('DHT11', sensorSchema);
// Ruta para recibir datos del ESP32
// Creando API y Ruta POST para recibir datos
app.post('/temperatura', (req, res) => {
const { temperatura, humedad } = req.body; // Extraer temperatura y humedad del cuerpo de la solicitud
console.log("datos", req.body); // Imprimir los datos recibidos en la consola
const newhumedad = new SensorData({ temperatura, humedad }); // Crear una nueva instancia del modelo con los datos recibidos
newhumedad.save() // Guardar los datos en la base de datos
.then(data => res.json(data)) // Enviar respuesta exitosa con los datos guardados en formato JSON
.catch(error => res.json({ message: error })); // Enviar respuesta de error si falla el guardado
});
// Iniciar el servidor
app.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`); // Mensaje que indica que el servidor está corriendo
});