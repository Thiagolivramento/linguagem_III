/**
 * config de esquema da base de dados
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var UserSchema = new Schema({
    name: String,
    sobrenome: String,
    /*senha: String*/
 });

 module.exports = mongoose.model("User", UserSchema);
