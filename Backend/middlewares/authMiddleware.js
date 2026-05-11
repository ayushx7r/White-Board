import jwt from 'jsonwebtoken'

export const checkToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const user = jwt.verify(token, "KEY");
        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({message : "Invalid or Expired token"});
    }
}