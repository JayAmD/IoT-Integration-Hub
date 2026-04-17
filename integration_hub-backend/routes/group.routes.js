import { Router } from "express";

//import validate from "../middlewares/validate.middleware.js";
//import { groupCreateSchema, groupGetSchema, groupListSchema, groupUpdateSchema, groupDeleteSchema } from "../validation/group.schemas.js";
// TODO add validate
import authenticate from "../middlewares/auth.middleware.js";

import createGroup from "../controllers/group/create.js";
import listGroups from "../controllers/group/list.js";
import getGroupDetail from "../controllers/group/getDetail.js";
import deleteGroup from "../controllers/group/delete.js";
import updateGroup from "../controllers/group/update.js";

const groupRouter = Router();

groupRouter.get("/",  authenticate, listGroups);

groupRouter.get("/:id",  authenticate, getGroupDetail);

groupRouter.post("/",  authenticate, createGroup);

groupRouter.patch("/:id",  authenticate, updateGroup);

groupRouter.delete("/:id",  authenticate, deleteGroup);

export default groupRouter;
