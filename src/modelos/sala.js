/**
 * config de esquema da base de dados
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var SalaSchema = new Schema({
   name: String,
   lotacao: Number
 });

 module.exports = mongoose.model("Sala", SalaSchema);
