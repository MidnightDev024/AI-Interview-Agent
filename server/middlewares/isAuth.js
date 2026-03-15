import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if(!token) {
            return res.status(401).json({message: "unauthorized"});
        }

        const verifyToken = jwt.verify(token , process.env.JWT_SECRET_KEY);

        if(!verifyToken){
            return res.status(401).json({message:"user does not have valid token "})
        }

        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        return res.status(401).json({message: "invalid or expired token"});
    }
};

export default isAuth;