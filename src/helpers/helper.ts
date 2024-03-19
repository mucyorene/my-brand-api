import jwt, {Secret} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

interface LoggedUserRequest extends Request {
    user?: any;
}

export const authenticatedUser = (
    req: LoggedUserRequest,
    res: Response,
    next: NextFunction
) => {
    const headers = req.headers["authorization"];
    const token = headers && headers.split(" ")[1]; // Extract token from bearer header
    if (!token) {
        return res.status(401).json({message: "Authentication required."});
    }
    try {
        req.user = jwt.verify(token, "mucyorene" as Secret); // Store decoded user information in request object
        next(); // Pass control to the next middleware
    } catch (error) {
        res.status(400).json({message: "Token is not valid"});
    }
};