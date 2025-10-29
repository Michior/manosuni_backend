import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ngoActivitiesRoutes from './routes/ngoActivities.js';
import ngoVolunteersRoutes from './routes/ngoVolunteers.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ngo/activities', ngoActivitiesRoutes);
app.use('/api/ngo/volunteers', ngoVolunteersRoutes);
app.get('/', (req, res) => res.send('API de ManosUni funcionando 🚀'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
