const mongoose = require('mongoose')



const userSchema= new mongoose.Schema({
    FullName:{type:String,required:true},
    Password:{type:String , required :true},
    UserId:{type:String,required:true},
    ApprovalStatus:{type:Boolean, default: false},
    Photo:{type:String }
})


const User = mongoose.model('User', userSchema);

module.exports = User;
