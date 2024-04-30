import { Express, Request, Response } from "express";
import { getNotifsHandler } from "./controller/notification.controller";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import {
  createTaskHandler,
  deleteTaskHandler,
  getAllTasksHandler,
  getTaskHandler,
  updateTaskHandler,
} from "./controller/task.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  updateTaskSchema,
} from "./schema/task.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  /**
   * @openapi
   * '/api/sessions':
   *  get:
   *    tags:
   *    - Session
   *    summary: Get all sessions
   *    responses:
   *      200:
   *        description: Get all sessions for current user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/GetSessionResponse'
   *      403:
   *        description: Forbidden
   *  post:
   *    tags:
   *    - Session
   *    summary: Create a session
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/CreateSessionInput'
   *    responses:
   *      200:
   *        description: Session created
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateSessionResponse'
   *      401:
   *        description: Unauthorized
   *  delete:
   *    tags:
   *    - Session
   *    summary: Delete a session
   *    responses:
   *      200:
   *        description: Session deleted
   *      403:
   *        description: Forbidden
   */
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  /**
   * @openapi
   * '/api/tasks':
   *  post:
   *     tags:
   *     - Tasks
   *     summary: Create a new task
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schema/Task'
   *     responses:
   *       200:
   *         description: Task created
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/taskResponse'
   *           example:
   *             "user": "642a0de05f16e6dad68efdad"
   *             "title": "Refactor code for better performance"
   *             "description": "We have array's maps and filters that we don't need. We have to get rid of them. Also, we have to refactor the code to use the new library that we have installed."
   *             "dueDate": "2023-04-03T00:25:32.189Z"
   *             "priority": 4
   *             "completed": false
   *             "hasReminder": false
   *             "_id": "642a1cfcc1bec76d8a2e7ac2"
   *             "taskId": "task_xxqm8z3eho"
   *             "createdAt": "2023-04-03T00:25:32.189Z"
   *             "updatedAt": "2023-04-03T00:25:32.189Z"
   *             "__v": 0
   *  get:
   *    tags:
   *    - Tasks
   *    summary: Get all tasks (with filter option)
   *    responses:
   *      200:
   *        description: Tasks listed
   *        content:
   *          application/json:
   *            schema:
   *               $ref: '#/components/schema/taskResponse'
   *            example:
   *              [
   *                {
   *                 "user": "642a0de05f16e6dad68efdad",
   *                 "title": "Refactor code for better performance",
   *                 "description": "We have array's maps and filters that we don't need. We have to get rid of them. Also, we have to refactor the code to use the new library that we have installed.",
   *                 "dueDate": "2023-04-03T00:25:32.189Z",
   *                 "priority": 4,
   *                 "completed": false,
   *                 "hasReminder": false,
   *                  "_id": "642a1cfcc1bec76d8a2e7ac2",
   *                  "taskId": "task_xxqm8z3eho",
   *                "createdAt": "2023-04-03T00:25:32.189Z",
   *                 "updatedAt": "2023-04-03T00:25:32.189Z",
   *               },
   *              { "user": "642a0de05asfd16e6dad68efgad",
   *               "title": "Do other things hyyy",
   *              "description": "We have array's maps and filters that we don't need. We have to get rid of them. Also, we have to refactor the code to use the new library that we have installed.",
   *             "dueDate": "2023-04-03T00:25:32.189Z",
   *           "priority": 4,
   *        "completed": false,
   *            "hasReminder": false,
   *                  "_id": "642a1cfcc1bec76d8a2e7ac2",
   *                "taskId": "task_xxqm8z3eho",
   *               "createdAt": "2023-04-03T00:25:32.189Z",
   *             "updatedAt": "2023-04-03T00:25:32.189Z",
   * }
   *             ]
   */
  app.post(
    "/api/tasks",
    [requireUser, validateResource(createTaskSchema)],
    createTaskHandler
  );
  app.get("/api/tasks", requireUser, getAllTasksHandler);

  /**
   * @openapi
   * '/api/tasks/{taskId}':
   *  get:
   *     tags:
   *     - Tasks
   *     summary: Get a single task by the taskId
   *     parameters:
   *      - name: taskId
   *        in: path
   *        description: The id of the task
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/taskResponse'
   *       404:
   *         description: Task not found
   *  put:
   *     tags:
   *     - Tasks
   *     summary: Update a single task
   *     parameters:
   *      - name: taskId
   *        in: path
   *        description: The id of the task
   *        required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schema/Task'
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schema/taskResponse'
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Task not found
   *  delete:
   *     tags:
   *     - Tasks
   *     summary: Delete a single task
   *     parameters:
   *      - name: taskId
   *        in: path
   *        description: The id of the task
   *        required: true
   *     responses:
   *       204:
   *         description: Task deleted
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Task not found
   */
  app.put(
    "/api/tasks/:taskId",
    [requireUser, validateResource(updateTaskSchema)],
    updateTaskHandler
  );

  app.get(
    "/api/tasks/:taskId",
    validateResource(getTaskSchema),
    getTaskHandler
  );

  app.delete(
    "/api/tasks/:taskId",
    [requireUser, validateResource(deleteTaskSchema)],
    deleteTaskHandler
  );

  /**
   * @openapi
   * '/api/notifs/{userId}':
   *  get:
   *    tags:
   *    - Notifications
   *    summary: Get users notifications
   *    parameters:
   *      - name: userId
   *        in: path
   *        description: The id of the user
   *        required: true
   *    responses:
   *      200:
   *        description: Get all notifications for current user
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schema/notifResponse'
   *              example:
   *                [
   *                  {
   *                    user: "642a0de05f16e6dad68efdad",
   *                    task: "642a1cfcc1bec76d8a2e7ac2",
   *                    isRead: false,
   *                    _id: "642a1cfcc1bec76d8a2e7ac2",
   *                    createdAt: "2023-04-03T00:25:32.189Z",
   *                    updatedAt: "2023-04-03T00:25:32.189Z",
   *                  }
   *                ]
   *      403:
   *        description: Forbidden
   */
  app.get("/api/notifs/:userId", requireUser, getNotifsHandler);
}

export default routes;
