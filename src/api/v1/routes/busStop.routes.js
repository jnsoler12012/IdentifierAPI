import { Router } from "express"
import { getStopID } from "../controllers/busStop/index.js";


const stopBusRouter = Router();

stopBusRouter.get("/getAll", getStopID)

export default stopBusRouter;