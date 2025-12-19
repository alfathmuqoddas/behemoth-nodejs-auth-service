import { Request, Response, NextFunction } from 'express';
import { requestCounter, requestDuration } from '../config/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = requestDuration.startTimer();
  
  res.on('finish', () => {
    const route = req.route ? req.route.path : 'unknown';
    const statusCode = res.statusCode.toString();
    
    requestCounter.inc({ method: req.method, route, status_code: statusCode });
    end({ method: req.method, route, status_code: statusCode });
  });
  
  next();
};
