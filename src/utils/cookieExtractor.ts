import { Request } from 'express';

// Extracts the jwt from a cookie
const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }

  return token;
};

export default cookieExtractor;
