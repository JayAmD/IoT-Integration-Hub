import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
// import { endpointCreateSchema, endpointGetSchema, endpointListSchema, endpointUpdateSchema, endpointDeleteSchema } from "../validation/endpoint.schemas.js";
//TODO: ADD validate schemas
import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createEndpoint from "../controllers/endpoint/create.js";
import listEndpoints from "../controllers/endpoint/list.js";
import getEndpointDetail from "../controllers/endpoint/getDetail.js";
import deleteEndpoint from "../controllers/endpoint/delete.js";
import updateEndpoint from "../controllers/endpoint/update.js";

const endpointRouter = Router();

endpointRouter.post("/", authenticate, authorizeTenant(["owner", "admin"]), createEndpoint);

endpointRouter.get("/", authenticate, authorizeTenant(["owner", "admin", "viewer"]), listEndpoints);

endpointRouter.get("/:id", authenticate, authorizeTenant(["owner", "admin", "viewer"]), getEndpointDetail);

endpointRouter.patch("/:id", authenticate, authorizeTenant(["owner", "admin"]), updateEndpoint);

endpointRouter.delete("/:id", authenticate, authorizeTenant(["owner", "admin"]), deleteEndpoint);

export default endpointRouter;
