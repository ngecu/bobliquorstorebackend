import Banner from '../models/bannerModel.js';

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private
const createBanner = async (req, res) => {
  try {
    const { url } = req.body;
    console.log(url)
    // Create a new banner instance
    const banner = new Banner({
      url,
    });

    // Save the banner to the database
    const createdBanner = await banner.save();

    res.status(201).json(createdBanner);
  } catch (error) {
    res.status(500).json({ message: `Error creating banner ${error}` });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getAllBanners = async (req, res) => {
  try {
    // Fetch all banners from the database
    const banners = await Banner.find();

    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving banners' });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the banner by ID and delete it
    const deletedBanner = await Banner.findByIdAndRemove(id);

    if (deletedBanner) {
      res.json({ message: 'Banner deleted' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner' });
  }
};

// @desc    Get a single banner by ID
// @route   GET /api/banners/:id
// @access  Public
const getBannerById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the banner by ID
      const banner = await Banner.findById(id);
  
      if (banner) {
        res.json(banner);
      } else {
        res.status(404).json({ message: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving banner' });
    }
  };
  
  // @desc    Update a banner
  // @route   PUT /api/banners/:id
  // @access  Private/Admin
  const updateBanner = async (req, res) => {
    try {
      const { id } = req.params;
      const { url } = req.body;
  
      // Find the banner by ID
      const banner = await Banner.findById(id);
  
      if (banner) {
        banner.url = url;
  
        // Save the updated banner to the database
        const updatedBanner = await banner.save();
  
        res.json(updatedBanner);
      } else {
        res.status(404).json({ message: 'Banner not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating banner' });
    }
  };
  
  export { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner };