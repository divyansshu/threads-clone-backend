import { createHmac, randomBytes } from "crypto";
import { prisma } from "../lib/db";
import jwt from 'jsonwebtoken';


const secret = "1234@abcd"

export interface createUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface getUserTokenPayload {
  email: string;
  password: string;
}

class userServices {
  private static generateHash(password: string, salt: string) {
    const hashPassworrd = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashPassworrd;
  }
  public static createUser(payload: createUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashPassworrd = userServices.generateHash(password, salt);
    return prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashPassworrd,
      },
    });
  }

  private static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  public static  async getUserToken(email: string, password: string) {
    // const { email, password } = payload;
    const user = await userServices.getUserByEmail(email);
    if (!user) throw new Error("user not found");

    const userSalt = user.salt;
    const userHashPassword = userServices.generateHash(password, userSalt);

    if (userHashPassword !== user.password) {
      throw new Error("Incorrect password");
    }

    //generate token
    const token = jwt.sign({id: user.id, email: user.email}, secret);
    return token;
  }

  public static decodeJwtToken(token: string) {
    return jwt.verify(token, secret);
  }

  public static getUserById(id: string) {
    return prisma.user.findUnique({where: {id}});
  }
}

export default userServices;
