import express from 'express';
import { getComment ,postComment,editComment,deleteComment} from '../controller/comment.controller.js';

const Router = express.Router();

Router.get('/getcomments', getComment);
Router.post('/setcomments', postComment);
Router.put('/editcomments', editComment);
Router.delete('/deletecomments', deleteComment);

export default Router