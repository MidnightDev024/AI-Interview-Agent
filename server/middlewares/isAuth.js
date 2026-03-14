import jwt from JsonWebToken


const isAuth = async (req, res, next) => {
    try {
        let {token} = req.cookies;

        if(!token) {
            return res.status(400).json({message: "user does not exist"});
        }

        const verifyToken = jwt.veriify(token , process.env.JWT_SECRET_KEY);

        if(!verifyToken){
            return res.status(400).json({message:"user does not have valid token "})
        }
        req.userId = verifyToken.userId;

    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}