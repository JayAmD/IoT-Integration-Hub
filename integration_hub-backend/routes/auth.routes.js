import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { signUpSchema, logInSchema } from "../validation/auth.schemas.js";

import signUp from "../services/auth/signUp.js";
import logIn from "../services/auth/logIn.js";

const authRouter = Router();

authRouter.post('/signup', validate(signUpSchema), signUp);
authRouter.post('/login', validate(logInSchema), logIn);

export default authRouter;