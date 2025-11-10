import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Rutas existentes
import ngoActivitiesRoutes from './routes/ngoActivities.js';
import ngoVolunteersRoutes from './routes/ngoVolunteers.js';
import authRoutes from './routes/auth.js';

// 🔹 NUEVA RUTA DE VALIDACIONES
import validationRoutes from './routes/validationRoutes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Middleware para mostrar requests en consola
app.use((req, _res, next) => {
  const q = Object.keys(req.query || {}).length
    ? `?${new URLSearchParams(req.query).toString()}`
    : '';
  console.log(`[REQ] ${req.method} ${req.originalUrl}${q}`);
  if (req.body && Object.keys(req.body).length) {
    console.log('[REQ BODY]', JSON.stringify(req.body));
  }
  next();
});

// Endpoint base
app.get('/', (_req, res) => res.json({ ok: true, service: 'ManosUni API' }));

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/ngo/activities', ngoActivitiesRoutes);
app.use('/api/ngo/volunteers', ngoVolunteersRoutes);

// 🔹 NUEVA RUTA
app.use('/api/validations', validationRoutes);

// Middleware para errores 404
app.use((_req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));

// Middleware para manejo de errores internos
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
});

export default app;
