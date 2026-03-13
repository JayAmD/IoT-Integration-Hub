import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
import { signUpSchema, logInSchema } from "../validation/auth.schemas.js";

import signUp from "../services/auth/signUp.js";

const authRouter = Router();

authRouter.post('/signup', validate(signUpSchema), signUp);
authRouter.post('/login', validate(logInSchema), (req, res) => res.send('Login route'));
authRouter.post('/logout', (req, res) => res.send('Logout route'));

export default authRouter;