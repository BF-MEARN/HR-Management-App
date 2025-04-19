import cors from 'cors';
import express from 'express';

import userRouter from './routers/UserRouter.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:4200', 'http://localhost:5173'],
    credentials: true,
  })
);

// Common routes
// Allow anyone to login/register
app.use('/api/user', userRouter);

// app.all('*', (_req: Request, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

export default app;
