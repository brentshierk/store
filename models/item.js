"use strict"

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

mongoosePaginate.paginate.options = {
    limit:3,
}

const ItemSchema = new Schema({
    name:{type:String,required:true},
    serialNumber: {type: Number,required:true},
    stock: {type:Number,required:true},
    description:{type:String,minlength:30,required:true},
    cost:{type:Number,required:true},
    picUrl: {type:String},
    picUrlSq: {type:String},
    avatarUrl:{type:String,required:true},


},{
    timestamps:true
});

ItemSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Item',ItemSchema);
