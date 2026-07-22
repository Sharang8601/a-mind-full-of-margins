import { Request, Response, NextFunction } from "express";
import { getToken } from "@auth/core/jwt";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // We pass a mock request object that @auth/core/jwt can read cookies from
    const secureCookie = process.env.NODE_ENV === "production";
    const salt = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
    
    const token = await getToken({
      req: req as any,
      secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "",
      secureCookie,
      salt,
    });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No valid session token found." });
    }

    // Attach token to request for use in controllers
    (req as any).user = token;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
};
