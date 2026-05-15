const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ---------- Env ----------
dotenv.config();

// ---------- App ----------
const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use('/api', routes);

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
