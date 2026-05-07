import { Router } from "express";

//import validate from "../middlewares/validate.middleware.js";
//import { groupCreateSchema, groupGetSchema, groupListSchema, groupUpdateSchema, groupDeleteSchema } from "../validation/group.schemas.js";
// TODO add validate
import authenticate from "../middlewares/auth.middleware.js";
import authorizeTenant from "../middlewares/tenant.middleware.js";

import createGroup from "../controllers/group/create.js";
import listGroups from "../controllers/group/list.js";
import getGroupDetail from "../controllers/group/getDetail.js";
import deleteGroup from "../controllers/group/delete.js";
import updateGroup from "../controllers/group/update.js";

const groupRouter = Router();

groupRouter.get("/", authenticate, authorizeTenant(["owner", "admin", "viewer"]), listGroups);

groupRouter.get("/:id", authenticate, authorizeTenant(["owner", "admin", "viewer"]), getGroupDetail);

groupRouter.post("/", authenticate, authorizeTenant(["owner", "admin"]), createGroup);

groupRouter.patch("/:id", authenticate, authorizeTenant(["owner", "admin"]), updateGroup);

groupRouter.delete("/:id", authenticate, authorizeTenant(["owner", "admin"]), deleteGroup);

export default groupRouter;
