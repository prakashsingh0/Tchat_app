import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

const signup = async (req, res) => {
    const { email, fullName, password, profilePic } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "all field are required" });
        } else if (password.length < 6) {
            return res.status(400).json({ message: "Password must be al least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic
        });
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: 'Invailid user data' });
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });

    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invailid Credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invailed Credentials" });
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
    
}
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logged out controller", error.message);
        res.status(500).json({ message: "Internal server Error" })

    }
}
const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        upload_preset: "unsigned_profile_upload", // your unsigned preset name
        folder: "profilePics",
      });
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error in update profile:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

const checkAuth = async (req, res) => {

    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: 'Internal server error' });

    }

}

export { signup, login, logout, updateProfile, checkAuth };