import mongoose from "mongoose";

//const uri = "mongodb+srv://test123:Conestoga@cestar-node.wzsxe.mongodb.net/car_craze?retryWrites=true&w=majority";
const uri =
  "mongodb+srv://capstone:Conestoga@cluster0.nhgxcfa.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      "===============================Connected to Mongodb Successfully !!!============================="
    );
  })
  .catch((err) => {
    console.log(
      `######### not Connected due to the error below ##########\n${err}`
    );
  });

const ProductsSchema = mongoose.Schema({
  Product_name: { type: String, required: true },
  Product_price: { type: Number, required: true },
  Product_description: { type: String, required: true },
  Product_image: { type: String, required: true },
  Category: { type: String }
});

const ProductModel = mongoose.model("Products", ProductsSchema);

export default ProductModel;
