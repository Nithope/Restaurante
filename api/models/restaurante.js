const mongoose = require('mongoose');

const restauranteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String,required: true},
    phone:{type: String, required:true},
    cnpj:{type: String, required:true},
    specialty:{type: String,
         enum: ['Pizzaria','Arabe','Brasileira','Lanchonete','Outros'],
         required:true
        }

});

module.exports = mongoose.model('Restaurante', restauranteSchema);