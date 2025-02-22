import { Router, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

const router = Router();

export const healthRoute = (): Router => {
  router.get("/notification-health", (_req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .send('Notification service is up & running');
  });
  return router;
};
