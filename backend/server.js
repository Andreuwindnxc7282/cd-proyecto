const express = require('express');
const cors = require('cors'); // ← Importa cors
const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para todos los orígenes (solo en desarrollo)
app.use(cors());

// Permite que el backend reciba JSON
app.use(express.json());

// Rutas
app.use('/api/tasks', require('./routes/tasks'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend de To-Do List funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});