// Define your object model
import Realm,{ObjectSchema} from "realm";

export class User extends Realm.Object<User> {
    _id!: string;
    username!: string;
    userpass!: string;
    userphone!: string;
    usergmail?: string;
    userprofile?: string;
    time!: Date;
  
    static schema: ObjectSchema = {
      name: 'User',
      primaryKey: '_id',
      properties: {
        _id: "string",
        username: 'string',
        userpass: 'string',
        userphone: 'string',
        usergmail: 'string',
        userprofile: 'string',
        time: 'date'
      },
    };
  }
  
