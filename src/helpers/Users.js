import User from '../models/user.model'

class UsersHelper {
    constructor({ _id, username, email, password }) {
        this.user = new User({
            _id,
            username,
            email,
            password,
        });
    }

    findOrSave() {
        return new Promise((resolve, reject) => {
            User.findOne({ username: this.user.username })
                .then((doc) => { resolve(doc ? doc : this.user.save()); })
                .catch((error) => { reject(error); });
        });
    }

    findById() {
        return new Promise((resolve, reject) => {
            User.findById(this.user._id)
                .then((doc) => { doc ? resolve(doc) : reject(new Error('User not found')); })
                .catch((error) => { reject(error); });
        });
    }

    updateById() {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(this.user._id, this.user)
                .then((doc) => { doc ? resolve(doc) : reject(new Error('User not found')); })
                .catch((error) => { reject(error); });
        });
    }
}

export default UsersHelper;