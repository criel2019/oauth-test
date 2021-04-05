import { IMongoDBUser } from "src/interfaces/user";

declare global {
  namespace Express {
      // tslint:disable-next-line:no-empty-interface
      interface AuthInfo {}
      // tslint:disable-next-line:no-empty-interface
      interface User extends IMongoDBUser {}

      interface Request {
          authInfo?: AuthInfo;
          user?: User;

          // These declarations are merged into express's Request type
          login(user: User, done: (err: any) => void): void;
          login(user: User, options: any, done: (err: any) => void): void;
          logIn(user: User, done: (err: any) => void): void;
          logIn(user: User, options: any, done: (err: any) => void): void;

          logout(): void;
          logOut(): void;

          isAuthenticated(): this is AuthenticatedRequest;
          isUnauthenticated(): this is UnauthenticatedRequest;
      }

      interface AuthenticatedRequest extends Request {
          user: User;
      }

      interface UnauthenticatedRequest extends Request {
          user?: undefined;
      }
  }
}

const googleCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }

  const kakaoCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }


const naverCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }



const getuser = (req, res) => {
  res.send(req.user);
}

const logout = (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
}
export default {getuser, logout, googleCallback, kakaoCallback, naverCallback}