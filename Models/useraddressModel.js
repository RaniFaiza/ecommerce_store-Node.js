const mongooseVar = require('mongoose');

const useraddressSchema = new mongooseVar.Schema({
    user_id:{
        type: mongooseVar.Schema.Types.ObjectId,
        ref:'user',
        required: true,
    },
    address_id: {
        type: mongooseVar.Schema.Types.ObjectId,
        ref: 'address',
        requried: true
    }
});

const useraddressModel = mongooseVar.model('useraddresses',useraddressSchema);
module.exports = {
    useraddressModel
}