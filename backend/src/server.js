
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import ngoActivitiesRoutes from './routes/ngoActivities.js';
import ngoVolunteersRoutes from './routes/ngoVolunteers.js';
import authRoutes from './routes/auth.js';

import activitiesRoutes from './routes/activities.js';
import volunteersRoutes from './routes/volunteers.js';
import registrationsRoutes from './routes/registrations.js';


const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use((req, _res, next) => {
    const q = Object.keys(req.query || {}).length ? `?${new URLSearchParams(req.query).toString()}` : '';
    console.log(`[REQ] ${req.method} ${req.originalUrl}${q}`);
    if (req.body && Object.keys(req.body).length) {
        console.log('[REQ BODY]', JSON.stringify(req.body));
    }
    next();
});



app.get('/', (_req, res) => res.json({ ok: true, service: 'ManosUni API' }));


app.use('/api/auth', authRoutes);
app.use('/api/ngo/activities', ngoActivitiesRoutes);
app.use('/api/ngo/volunteers', ngoVolunteersRoutes);

app.use('/api/activities', activitiesRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/registrations', registrationsRoutes);



app.use((_req, res) => res.status(404).json({ ok: false, error: 'Not Found' }));


app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err);
    res.status(500).json({ ok: false, error: 'Internal Server Error', detail: err.message });
});

export default app;
