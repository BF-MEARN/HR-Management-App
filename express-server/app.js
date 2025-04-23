import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { requireEmployee, requireHR, userAuth } from './middlewares/AuthMiddlewares.js';
import errorHandler from './middlewares/ErrorHandler.js';
import employeeFacilityReportRouter from './routers/EmployeeFacilityReportRouter.js';
import employeeHousingRouter from './routers/EmployeeHousingRouter.js';
import employeeOnboardingRouter from './routers/EmployeeOnboardingRouter.js';
import hrOnboardingRouter from './routers/HrOnboardingRouter.js';
import hrTokenRouter from './routers/HrTokenRouter.js';
import userRouter from './routers/UserRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
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
app.use('/api/onboarding', employeeOnboardingRouter);

// HR specific routes
app.use('/api/hr/token', userAuth, requireHR, hrTokenRouter);
app.use('/api/hr/onboarding', userAuth, requireHR, hrOnboardingRouter);

// Employee specific routes
app.use('/api/employee/facilityReport', userAuth, requireEmployee, employeeFacilityReportRouter);
app.use('/api/employee/housing', employeeHousingRouter);

// Fallback route
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  res.status(404).send('Not Found');
});

// Global error handler
app.use(errorHandler);

export default app;
