import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import inviteRouter from './routers/InviteRouter.js';
import userRouter from './routers/UserRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ['http://localhost:4200', 'http://localhost:4173'],
    credentials: true,
  })
);

app.use('/api/user', userRouter);
app.use('/api/invite', inviteRouter);

// app.all('*', (_req: Request, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

export default app;
