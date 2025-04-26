const mongooseVar = require('mongoose');

const countrySchema = new mongooseVar.Schema({
    country_name:{
        type: String,
        required: [true,'Country name is required.'],
        unique: true
    }
});

const countryModel = mongooseVar.model('countries',countrySchema);

module.exports = {
    countryModel
}