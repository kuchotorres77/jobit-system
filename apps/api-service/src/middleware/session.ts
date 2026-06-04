import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";
import { RequestExt } from "../interfaces/Ireq-ext";

const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || '';
        const jwt = jwtByUser.split(' ').pop();
        const isUser = verifyToken(`${jwt}`) as { id: string };
        // console.log(isUser);
        if (!isUser) {
            res.status(401).send("NO_TIENES_UN_JWT_VALIDO")
        } else {
            req.user = isUser
            // console.log({ jwtByUser });
            next();
        }
    } catch (e) {
        console.log({ e })
        res.status(400).send("SESSION_NO_VALIDA");
    }
};
export { checkJwt };