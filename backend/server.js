const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas (a implementar)
app.use('/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
  res.send('API de To-Do List funcionando ');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});