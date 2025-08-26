import User from "../modules/users.module.js";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const googleUser = async (req, res) => {
  try {
    
    const { name, email, picture, given_name, family_name, email_verified } = req.body;

   
    const finduser = await User.findOne({ $or: [{ email }, { given_name }] });

    if (!finduser) {
      const randomDigits = Math.floor(100 + Math.random() * 900); 
      const cardId = `680${randomDigits}`;
      const password = given_name + "googleuser";


      let str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let pass="";
      for (var i = 0; i < 10; i++) {
        const char = Math.floor(Math.random() * str.length);
        pass += str.charAt(char);
      }
      const imagename=given_name+pass+family_name+'.jpg';


      const downloadImage = async () => {
       
        const url = picture;
        const folderPath = path.join(__dirname, '../../frontend/public');
        const outputPath = path.join(folderPath, imagename);
    
        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });
    
        response.data.pipe(fs.createWriteStream(outputPath));
    };
    
    downloadImage().catch(console.error);


      const createuser = await User.create({
        username: given_name,
        librarycardnumber: cardId,
        email,
        password: password,
        image: imagename, 
      });

      // Save the profile image from the Google URL to a local folder
      if (createuser) {
        res.status(200).json({
          message: "Login Successful...",
          user: {
            _id: createuser._id,
            username: createuser.username,
            email: createuser.email,
            image: createuser.image,
          },
        });
      }
    } else {
      // If user exists, return the user data
      res.status(200).json({
        message: "Login Successful...",
        user: {
          _id: finduser._id,
          username: finduser.username,
          email: finduser.email,
          image: finduser.image || null,
        },
      });
    }
  } catch (error) {
    console.log("Error in googlelogin", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
