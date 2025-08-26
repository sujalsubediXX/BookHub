import Comment from "../modules/comment.module.js";

export const getComment = async (req, res) => {
    try {
        const userComment = await Comment.find();
        res.status(200).json(userComment);
        console.log(userComment);
        
    } catch (error) {
        console.error(`Error while fetching Comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error while fetching comments.' });
    }
};


export const postComment = async (req, res) => {
try {
    const {userId,username, comment} = req.body;
    if (!userId || !username || !comment) {
        return res.status(400).json({ message: "All fields are required" });
      }
    const setcomment = await Comment.create({userId,username, comment});
    if(setcomment){
        res.status(201).json({ message: 'Comment added successfully' });
    }else{
        res.status(400).json({ message: 'Error adding comment' });
    }
} catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
}

}
export const editComment = async (req, res) => {
    try{

    }catch(error){
        console.error(`Error while editing Comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error while editing comments.' });
    }
}
export const deleteComment = async (req, res) => {
    try{
        const deleteComment = await Comment.findByIdAndDelete(req.params.id);

    }catch(error){
        console.error(`Error while deleting Comment: ${error.message}`);
        res.status(500).json({ message: 'Internal server error while deleting comments.' });
    }
}