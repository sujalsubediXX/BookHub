import express from 'express'
const router = express.Router();
import { signup ,login, info, issuebook, checkcard} from "../controller/user.controller.js";
import { googleUser } from '../controller/googlelogin.controller.js';
router.post("/signup",signup);
router.post("/login",login);
router.get("/info",info);
router.post("/borrowbook",issuebook);
router.get("/check-card/:userId",checkcard);
router.post("/auth/google-login",googleUser);




export default router