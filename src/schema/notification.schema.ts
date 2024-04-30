import { TypeOf, object, string } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Notification:
 *       type: object
 *       required:
 *        - task
 *       properties:
 *         task:
 *           type: string
 *         isRead:
 *           type: boolean
 *           default: false
 *     notifResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         _id:
 *           type: string
 *         task:
 *           type: string
 *         isRead:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         __v:
 *           type: number
 *        
 *          
 *
 */

const params = {
  params: object({
    userId: string({
      required_error: "user is required",
    }),
  }),
};

export const getNotifSchema = object({
  ...params,
});

export type ReadNotifInput = TypeOf<typeof getNotifSchema>;
