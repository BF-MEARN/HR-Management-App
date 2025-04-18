import express from 'express'
import cors from 'cors'
import userRouter from './routers/UserRouter.js'

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);

// app.all('*', (_req: Request, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });


export default app
