import dotenv from "dotenv";

const genToken = async (userId) => {
    try {
        const token = jwt.sign({userId}, process.env.jwtSecret, {expiresIn: "7d"});
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
}


export default genToken