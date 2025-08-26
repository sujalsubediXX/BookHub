import User from "../modules/users.module.js";
import Borrow from "../modules/borrowBook.module.js";
import bcrypt from "bcrypt"




export const info = async (req, res) => {
  try {
    const users = await User.find().select("-password");  
    res.status(200).json(users);
  } catch (error) {
    console.error('Error occurred while fetching user: ', error); // Log entire error
    res.status(500).json({ message: 'An error occurred while fetching user.', error: error.message });
  }
};



export const userInfo = async (req, res) => {
    // const { username } = req.body;
    // console.log('Received username:', username);
    // const userData = { username: username };
    // res.json(userData);
  try {
  
    const { username } = req.body;

    // Check if username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find the user in the database
    const user = await User.findOne({ username });

    // Check if user was found
    if (user) {

      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(`Error occurred while fetching user data: ${error.message}`);
    res.status(500).json({ message: "An error occurred fetching user data." });
  }
};


export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const randomDigits = Math.floor(100 + Math.random() * 900); 
    const cardId = `680${randomDigits}`;
      const createdUser = new User({
        username: username,
        librarycardnumber:cardId,
        email: email,
        password: hashedPassword,
      });
      await createdUser.save();
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: createdUser._id,
          username: createdUser.username,
          email: createdUser.email,
          image:createdUser.image||null,
        },
      });
    }
  } catch (error) {
    console.log(`Error occurred in user controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          image:user.image||null,
        },
      });
    }
  } catch (error) {
    console.log(`Error occurred in user controller: ${error.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const checkcard = async (req, res) => {
  try {
    const { userId } = req.params;
    const numericUserId = Number(userId);
    const card = await User.findOne({ librarycardnumber:numericUserId});
    if (!card) {
      return res.status(404).json({ error: "User with this library card number not found." });
    } else {
      return res.status(200).json({ available: true });
    }
  } catch (err) {
    // Handle server errors
    console.error(err);
    res.status(500).json({ error: "Server error in checkcard function" });
  }
};


export const issuebook =async(req,res)=>{
  try{
    const {  isbn,bookTitle,userId,userName,issueDate,returnDate,notes}=req.body;
    const issueBook=new Borrow({
      userId:userId,
      name:userName,
      bookTitle:bookTitle,
      isbn:isbn,
      borrowedDate:issueDate,
      returnDate:returnDate,
      Notes:notes,
    });
    await issueBook.save();
    res.status(201).json({message:"Book issued successfully."})
  } catch (err) {
  console.error("Error in issuing book:", err.message);
  res.status(500).json({ message: err.message });
}

}