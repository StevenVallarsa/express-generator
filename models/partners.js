const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnersSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      require: true,
    },
    featured: {
      type: Boolean,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Partners = mongoose.model("Partners", partnersSchema);
module.exports = Partners;
