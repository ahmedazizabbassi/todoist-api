import { Request, Response } from "express";
import { ReadNotifInput } from "../schema/notification.schema";
import { getNotifs } from "../service/notification.service";
import logger from "../utils/logger";

export async function getNotifsHandler(
  req: Request<{}, {}, ReadNotifInput>,
  res: Response
) {
  console.log(req.body)
  try {
    const notifs = await getNotifs(req.body);
    return res.send(notifs);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message);
  }
}
