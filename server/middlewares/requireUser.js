const jwt=require('jsonwebtoken')
const {error}=require('../utils/responseWrapper');
module.exports=async(req, res, next)=>{

    // console.log("i am inside middleware");

    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        // return res.status(401).send("Authorization header is required");
        return res.send(error(401, "Authorization header is required"));

    }

    const accessToken=req.headers.authorization.split(" ")[1];

    // console.log(accessToken);

    //checking if access token is valid or not

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
        req._id = decoded._id;
        next();
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid Access key.")
        return res.send(error(401, "Invalid Access key."));

    }

    


    next();
};