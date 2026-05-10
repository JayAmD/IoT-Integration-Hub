import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updatePasswordSchema } from "../validation/user.schemas.js";

import getMe from "../controllers/user/getMe.js";
import updatePassword from "../controllers/user/updatePassword.js";
import deleteMe from "../controllers/user/deleteMe.js";

const userRouter = Router();

userRouter.get('/me', authenticate, getMe);
userRouter.patch('/password', authenticate, validate(updatePasswordSchema), updatePassword);
userRouter.delete('/me', authenticate, deleteMe);

export default userRouter;
