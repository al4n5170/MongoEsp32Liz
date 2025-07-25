// Importar módulos
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // importante para permitir conexiones desde ESP32

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión MongoDB Atlas
const dbURI = "mongodb+srv://alan:Alan2005@cluster0.aifnqqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.log(err));

// Esquema y modelo
const sensorSchema = new mongoose.Schema({
  temperatura: Number,
  humedad: Number
});

const SensorData = mongoose.model('DHT11', sensorSchema);

// POST /temperatura - guardar datos
app.post('/temperatura', (req, res) => {
  const { temperatura, humedad } = req.body;
  const nuevaLectura = new SensorData({ temperatura, humedad });
  nuevaLectura.save()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET /dht11 - obtener última lectura
app.get('/dht11', async (req, res) => {
  try {
    const ultimaLectura = await SensorData.findOne().sort({ _id: -1 });
    if (!ultimaLectura) return res.status(404).json({ message: "No hay datos disponibles" });
    res.json(ultimaLectura);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos", error });
  }
});

// GET /lecturas - todas las lecturas
app.get('/lecturas', async (req, res) => {
  try {
    const lecturas = await SensorData.find().sort({ _id: -1 });
    res.json(lecturas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener lecturas", error });
  }
});

// PUT /lecturas/:id - actualizar por ID
app.put('/lecturas/:id', async (req, res) => {
  try {
    const lecturaActualizada = await SensorData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lecturaActualizada) return res.status(404).json({ message: "Lectura no encontrada" });
    res.json(lecturaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar lectura", error });
  }
});

// DELETE /lecturas/:id - eliminar por ID
app.delete('/lecturas/:id', async (req, res) => {
  try {
    const resultado = await SensorData.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).json({ message: "Lectura no encontrada" });
    res.json({ message: "Lectura eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar lectura", error });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
