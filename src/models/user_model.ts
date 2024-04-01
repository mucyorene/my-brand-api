import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    names: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true})

export const UserModel = mongoose.model("User", UserSchema)
export const users = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({email: email});
// export const getUserBySessionToken = (sessionToken: String) => UserModel.findOne({'token': sessionToken});
export const getUserById = (id: String) => UserModel.findById({_id: id});

export const removeUser = (id: String) => UserModel.findOneAndDelete({_id: id})
export const createUser = (values: Record<any, any>) => new UserModel(values).save().then((user) => user.toObject())
export const editUserModel = (id: String, values: Record<any, any>) => UserModel.findOneAndUpdate({_id: id}, values)
export const User = mongoose.model("Users", UserSchema)