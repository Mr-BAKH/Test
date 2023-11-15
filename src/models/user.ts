// Define your object model
import Realm,{ObjectSchema} from "realm";

export class User extends Realm.Object<User> {
    _id!: Realm.BSON.ObjectId;
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
        _id: "objectId",
        username: 'string',
        userpass: 'string',
        userphone: 'string',
        usergmail: {type:'string', default:'...@gmail.com'},
        userprofile: {type:'string', default:''},
        time: 'date'
      },
    };
  }
  
