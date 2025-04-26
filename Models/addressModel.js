const mongooseVar = require('mongoose');

const addressSchema = new mongooseVar.Schema({
    street:{
        type: String,
        required: [true,'Street address is required.']
    },
    town:{
        type:String,
        required: [true,'Town is required.']
    },
    postal_code:{
        type: String
    },
    country_id: {
        type: mongooseVar.Schema.Types.ObjectId,
        required: [true, 'Country is required.']
    }
});

const addressModel = mongooseVar.model('addresses', addressSchema);
module.exports = {
    addressModel
}