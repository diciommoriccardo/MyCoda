import User from '../models/user.model'
import randomString from '../utils/string/random';
import { REFRESH_TOKEN } from '../config/constants';

const getRefreshToken = () => {
    return randomString(REFRESH_TOKEN.LENGTH);
}

class UsersHelper {
    constructor(userInformation) {
        this._id = userInformation._id;
        this.username = userInformation.username;
        this.email = userInformation.email;
        this.password = userInformation.password;
        this.refresh_token = userInformation.refresh_token || getRefreshToken();
    }

    login() {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({ username: this.username }, { refresh_token: this.refresh_token }, {new: true})
                .then((doc) => { resolve(doc ? doc : this.user.save()); })
                .catch((error) => { reject(error); });
        });
    }

    findById() {
        return new Promise((resolve, reject) => {
            User.findById(this._id)
                .then((doc) => { doc ? resolve(doc) : reject(new Error('User not found')); })
                .catch((error) => { reject(error); });
        });
    }

    findByRefreshToken() {
        return new Promise((resolve, reject) => {
            User.findOne({ refresh_token: this.refresh_token })
                .then((doc) => { doc ? resolve(doc) : reject(new Error('User not found')); })
                .catch((error) => { reject(error); });
        });
    }
}

export default UsersHelper;