const mongoose = require("mongoose");
const User = require("./user");

const HomeSchema = new mongoose.Schema({
    HouseName: { type: String, required: true },
    Price: { type: Number, required: true },
    Location: { type: String, required: true },
    Rating: { type: Number, required: true },
    PhotoURL: String,
    Description: String,
});

HomeSchema.pre("findOneAndDelete", async function() {
    console.log("Came to pre hook while deleting a home");
    const homeId = this.getQuery()._id;
    await User.updateMany(
        { favourites: homeId },
        { $pull: { favourites: homeId } }
    );
});

module.exports = mongoose.model("Home", HomeSchema);