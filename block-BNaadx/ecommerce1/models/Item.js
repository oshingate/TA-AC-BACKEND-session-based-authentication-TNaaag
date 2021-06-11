let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let itemSchema = new Schema({
  name: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: Number, require: true },
  image: { type: String },
  likes: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

// itemSchema.pre('save', function (next) {
//   this.createdBy = req.session.userId;
//   next();
// });

let Item = mongoose.model('Item', itemSchema);

module.exports = Item;
