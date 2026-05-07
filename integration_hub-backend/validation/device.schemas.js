import z from "zod";

export const deviceCreateSchema = z.object({
  params: z.object({
    tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Device name must not be empty")
      .max(255, "Device name must be less than 255 characters long"),

    serialNumber: z
      .number(),

    claimToken: z
      .string()
      .trim(),

    groupIds: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-fA-F]{24}$/,
            "Each group ID must be a valid MongoDB ObjectId",
          ),
      )
      .optional(),
    }),
  });
  
  export const deviceListSchema = z.object({
    params: z.object({
      tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
    }),
    query: z.object({
      sortBy: z.enum(["name", "lastSeen"]).optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
  });

export const deviceGetSchema = z.object({
  params: z.object({
    tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid device ID"),
  }),
});

export const deviceUpdateSchema = z.object({
  params: z.object({
    tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid device ID"),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Device name must not be empty")
      .max(255, "Device name must be less than 255 characters long")
      .optional(),
    groupIds: z
      .array(
        z
          .string()
          .regex(
            /^[0-9a-fA-F]{24}$/,
            "Each group ID must be a valid MongoDB ObjectId",
          ),
      )
      .optional(),
    claimToken: z
      .string()
      .trim()
     
  }),
});

export const deviceDeleteSchema = z.object({
  params: z.object({
    tenantId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid tenant ID"),
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid device ID"),
  }),
});
