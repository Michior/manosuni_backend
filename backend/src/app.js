import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;