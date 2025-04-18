import cors from 'cors';
import express from 'express';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// app.all('*', (_req: Request, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

export default app;
