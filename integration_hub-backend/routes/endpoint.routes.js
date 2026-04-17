import { Router } from "express";

import validate from "../middlewares/validate.middleware.js";
// import { endpointCreateSchema, endpointGetSchema, endpointListSchema, endpointUpdateSchema, endpointDeleteSchema } from "../validation/endpoint.schemas.js";
//TODO: ADD validate schemas
import authenticate from "../middlewares/auth.middleware.js";

import createEndpoint from "../controllers/endpoint/create.js";
import listEndpoints from "../controllers/endpoint/list.js";
import getEndpointDetail from "../controllers/endpoint/getDetail.js";
import deleteEndpoint from "../controllers/endpoint/delete.js";
import updateEndpoint from "../controllers/endpoint/update.js";

const endpointRouter = Router();

endpointRouter.post("/",  authenticate, createEndpoint);

endpointRouter.get("/", authenticate, listEndpoints);

endpointRouter.get("/:id",  authenticate, getEndpointDetail);

endpointRouter.patch("/:id", authenticate, updateEndpoint);

endpointRouter.delete("/:id",  authenticate, deleteEndpoint);

export default endpointRouter;
