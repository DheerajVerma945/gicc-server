import Admin from "../models/admin.model.js";

export const login = async(req,res)=>{
    try {
        
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const isMatch = admin.password === password;
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        return res.status(200).json({message:"Login Successful"})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
}