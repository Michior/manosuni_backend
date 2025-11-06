import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import ngoActivitiesRoutes from './routes/ngoActivities.js';
import ngoVolunteersRoutes from './routes/ngoVolunteers.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, service: 'ManosUni API' }));

app.use('/api/auth', authRoutes);
app.use('/api/ngo/activities', ngoActivitiesRoutes);
app.use('/api/ngo/volunteers', ngoVolunteersRoutes);


app.use((_req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
});

export default app;
