const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// configurar middlewares
app.use(express.json());

// CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// rotas
const FuelRoutes = require('./src/routes/FuelRoutes');
const UsersRoutes = require('./src/routes/UserRoutes');
app.use('/fuels', FuelRoutes);
app.use('/users', UsersRoutes);

app.listen(PORT, (err) => {
  if (err) { return console.log(err); }
  console.log(`Rodando na porta ${PORT}`);
});