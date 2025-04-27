import express from 'express';

import { protectRoute } from '../middleware/auth.middleware.js';
import {Posts,MyPost, likeOrDislike, getFollowingPost, DeletePost, getAllpost} from '../controllers/post.controller.js';


const router = express.Router();

router.post("/", protectRoute, Posts);
router.get("/mypost", protectRoute, MyPost);
router.post("/likeordislike/:id",protectRoute,likeOrDislike);
router.get("/getfollowingpost",protectRoute,getFollowingPost);
router.delete('/deletepost/:id',protectRoute,DeletePost);
router.get("/getallpost",protectRoute,getAllpost);



export default router