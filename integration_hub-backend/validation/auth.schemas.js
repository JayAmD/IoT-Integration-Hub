import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain uppercase letter, lowercase letter, and a number",
      ),
  }),
});

export const logInSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
});
