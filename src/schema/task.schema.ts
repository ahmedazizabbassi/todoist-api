import { TypeOf, date, number, object, string } from "zod";

/**
 * @openapi
 * components:
 *   schema:
 *     Task:
 *       type: object
 *       required:
 *        - title
 *       properties:
 *         title:
 *           type: string
 *           default: "Refactor code for better performance"
 *         description:
 *           type: string
 *           default: "We have array's maps and filters that we don't need. We have to get rid of them. Also, we have to refactor the code to use the new library that we have installed."
 *     taskResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         dueDate:
 *           type: Date
 *         priority:
 *           type: 1 | 2 | 3 | 4
 *         completed:
 *           type: boolean
 *         hasReminder:
 *           type: boolean
 *         taskId:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         __v:
 *           type: number
 *
 */

const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    priority: number().int().gte(1).lte(4).optional(),
    dueDate: date().min(new Date()),
  }),
};

const params = {
  params: object({
    taskId: string({
      required_error: "taskId is required",
    }),
  }),
};

export const createTaskSchema = object({
  ...payload,
});

export const updateTaskSchema = object({
  ...payload,
  ...params,
});

export const deleteTaskSchema = object({
  ...params,
});

export const getTaskSchema = object({
  ...params,
});

export type CreateTaskInput = TypeOf<typeof createTaskSchema>;
export type UpdateTaskInput = TypeOf<typeof updateTaskSchema>;
export type ReadTaskInput = TypeOf<typeof getTaskSchema>;
export type DeleteTaskInput = TypeOf<typeof deleteTaskSchema>;
