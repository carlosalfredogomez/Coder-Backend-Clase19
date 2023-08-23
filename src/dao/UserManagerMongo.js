const UserModel = require('../dao/models/userModel');

class UserManagerMongo {
    async createUser(name, email, password) {
        try {
            const newUser = new UserModel({
                name,
                email,
                password,
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserManagerMongo;
