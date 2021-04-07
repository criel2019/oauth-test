
import { IMongoDBUser } from "src/interfaces/user";
declare global {
    namespace Express {
        interface User extends IMongoDBUser {}
        interface Request {
            user?: User;
        }
    }
}