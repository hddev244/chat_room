import { jwtVerify,SignJWT } from "jose";

interface UserJwtPayload {
    jti: string;
    iat: number;
}

export const getJwtSecretKey =  () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error('JWT_SECRET is not defined');
    }
    return secret;
}

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token,new TextEncoder().encode(getJwtSecretKey()));
        return verified.payload as UserJwtPayload;
    } catch (error) {
        console.log('Token is invalid' + error);
        throw new Error('Token is invalid');
    }
}