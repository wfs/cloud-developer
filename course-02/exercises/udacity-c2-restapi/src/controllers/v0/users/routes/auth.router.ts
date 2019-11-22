import { Router, Request, Response } from "express";

import { User } from "../models/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { NextFunction } from "connect";

import * as EmailValidator from "email-validator";
import { config } from "../../../../config/config";

const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string> {
  //@TODO Use Bcrypt to Generated Salted Hashed Passwords
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds); // use 'await' on async functions so executes next code line only AFTER genSalt() returns.
  const hash = await bcrypt.hash(plainTextPassword, salt);
  return hash;
}

async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
  //return jwt.sign(user.short(), "hello")
  return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: User): string {
  //@TODO Use jwt to create a new JWT Payload containing
  return jwt.sign(user.short(), "hello")
  //return jwt.sign(user, config.jwt.secret);
}

/**
 * Each protected endpoint adds a middleware function requireAuth which is defined in the auth.router.ts file.
 * This method will check if the authorization header exists and is a valid JWT.
 * If yes, it allows the endpoint to continue processing.
 * If no, it rejects the request and sends appropriate HTTP status codes.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("*** Entered requireAuth function ...");
  //return next();
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: "No authorization headers." });
  }

  // spliting on first space (' ') as is in format "Bearer <token>" e.g. "Bearer haksdhfkdjshfjkdshfjkdshfkjshdfjdhsfkdsh"
  const token_bearer = req.headers.authorization.split(" ");
  if (token_bearer.length != 2) {
    console.log("token_bearer: ", token_bearer);
    return res.status(401).send({ message: "Malformed token." });
  }

  // we know the token should be the 1st item of our array when it is zero-indexed
  const token = token_bearer[1];

  return jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate." });
    }
    return next();
  });
}

router.get(
  "/verification",
  requireAuth,
  async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: "Authenticated." });
  }
);

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email)) {
    return res
      .status(400)
      .send({ auth: false, message: "Email is required or malformed" });
  }
  // check email password valid
  if (!password) {
    return res
      .status(400)
      .send({ auth: false, message: "Password is required" });
  }

  const user = await User.findByPk(email);
  // check that user exists
  if (!user) {
    return res.status(401).send({ auth: false, message: "Unauthorized" });
  }

  // check that the password matches
  const authValid = await comparePasswords(password, user.password_hash);

  if (!authValid) {
    return res.status(401).send({ auth: false, message: "Unauthorized" });
  }

  // Generate JWT
  const jwt = generateJWT(user);

  res.status(200).send({ auth: true, token: jwt, user: user.short() });
});

/*
 * register a new user
 *
 * aka the "/" in "router.post('/'," below refers to the built up URL of "/api/v0/users/auth/"
 * defined in server.ts -> index.router.ts -> user.router.ts.
 * See generated dependencygraph.png for connections above.
 */
router.post("/", async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email)) {
    return res
      .status(400)
      .send({ auth: false, message: "Email is required or malformed" });
  }

  // check email password valid
  if (!plainTextPassword) {
    return res
      .status(400)
      .send({ auth: false, message: "Password is required" });
  }

  // find the user
  const user = await User.findByPk(email);
  // check that user doesnt exists
  if (user) {
    return res
      .status(422)
      .send({ auth: false, message: "User may already exist" });
  }

  const password_hash = await generatePassword(plainTextPassword);

  const newUser = await new User({
    email: email,
    password_hash: password_hash
  });

  let savedUser;
  try {
    savedUser = await newUser.save();
  } catch (e) {
    throw e;
  }

  // Generate JWT
  //const jwt = generateJWT(savedUser);
  let jwt;
  try {
    jwt = generateJWT(savedUser);
  } catch (e) {
    throw e;
  }

  res.status(201).send({ token: jwt, user: savedUser.short() });
});

router.get("/", async (req: Request, res: Response) => {
  res.send("auth");
});

export const AuthRouter: Router = router;
