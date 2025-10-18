const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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