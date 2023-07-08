import mongoose from 'mongoose';



const bannerSchema =mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
