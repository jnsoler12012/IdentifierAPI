import { Router } from "express"
import { getStopID } from "../controllers/busStop/index.js";


const stopBusRouter = Router();

stopBusRouter.get("/infoById/:idBusStop", getStopID)

export default stopBusRouter;