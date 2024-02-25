const User = require('../models/User');

exports.register = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        let user = await User.findOne({email})
        if(user)
            return res
                .status(400)
                .json({success:false, message: 'Email already exist'})
        
        user = await User.create({name, email, password, avatar:{public_id: 'sample', url:'sampleurl'}});
        const options = {
            expires: new Date(Date.now() + (90*24*60*60*1000)),
            httpOnly: true
        }
        const token = await user.generateToken();
            res.status(201).cookie("token",token, options).json({
            success: true,
            user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) =>{
    try{
        const {email, password}  = req.body;
        let user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            })
        }
        const isMatchPass = await user.matchPassword(password);
        if(!isMatchPass){
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        const options = {
            expires: new Date(Date.now() + (90*24*60*60*1000)),
            httpOnly: true
        }
        const token = await user.generateToken();
            res.status(200).cookie("token",token, options).json({
            success: true,
            user,
            token
        })
    }catch(error){
            res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200)
        .cookie("token",null,{expires: new Date(Date.now()), httpOnly: true})
        .json({
            success: true,
            message: "Logged out"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.followUser = async (req, res) =>{
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    

    if(req.params.id.toString() === req.user._id.toString()){
        return res.status(400).json({
            success: false,
            message: "You can't follow yourself"
        })
    }

    if(!userToFollow){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    const isAlreadyFollowed = userToFollow.followers.filter((item) => item._id.toString() === loggedInUser._id.toString())
    if(isAlreadyFollowed.length){
        const indexFollowing =  loggedInUser.followings.indexOf(userToFollow._id);
        const indexFollower =  userToFollow.followers.indexOf(loggedInUser._id);
        loggedInUser.followings.splice(indexFollowing, 1);
        userToFollow.followers.splice(indexFollower, 1);
        await loggedInUser.save();
        await userToFollow.save();
        return res.status(200).json({
            success: true,
            message: "User Unfollowed"
        })
    }else{
        loggedInUser.followings.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);
        await loggedInUser.save();
        await userToFollow.save();
        res.status(200).json({
            success: true,
            message: "User Followed"
        })
    }
}

exports.updatePassword = async(req, res) => {
    try {
        const {oldPassword, newPassword, newConfirmPassword} = req.body;
        const user = await User.findById(req.user._id).select("+password");
        const isMatchPass = await user.matchPassword(oldPassword);
        if(!oldPassword || !newPassword || !newConfirmPassword){
            return res.status(400).json({
                success: false,
                message: "Please provide old password, new password and confirm password"
            })
        }
        if(!isMatchPass){
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }
        if(newPassword !== newConfirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords don't match"
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}