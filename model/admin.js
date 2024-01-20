const mongoose = require('mongoose')



const adminSchema= new mongoose.Schema({
    FullName:{type:String,required:true},
    Password:{type:String , required :true},
    adminId:{type:String,required:true},
   
})


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
