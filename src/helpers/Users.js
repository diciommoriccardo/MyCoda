import Users from '../models/user.model'

class UsersHelper {
    createUser( userInfo ) {
        return new Promise((resolve, reject) => {
            Users.findOne({ email: userInfo.email})
            .then((doc) => {
                if (doc) return resolve(doc);
                var userRecord = new User({
                    username: userInfo.username,
                    email: userInfo.email,
                    hash: userInfo.hash,
                }); 
                return userRecord.save();
            })
            .then((doc) => {
                return resolve(doc);
            })
            .catch((error) => { reject(error); })
        }) 
    }
}

export default UsersHelper;