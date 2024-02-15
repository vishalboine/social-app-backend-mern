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

        res.status(201).json({
            success:true,
            user
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