import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as v1 } from './v1';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', v1);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

export default app;

