import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import sendEmail from '../utils/sendEmail.js'
import Token from '../models/tokenModel.js'
import crypto from 'crypto';
import fs from 'fs';
import handlebars from 'handlebars'
import useragent from 'useragent'




const templateFilePath = "backend/controllers/email-template.hbs"

// Function to read the contents of the HTML template file
const readHTMLFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf-8' }, (error, htmlContent) => {
      if (error) {
        reject(error);
      } else {
        resolve(htmlContent);
      }
    });
  });
};

// Function to compile and render the email template
const renderEmailTemplate = (template, data) => {
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishlist:user.wishlist,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      wishlist:user.wishlist
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  console.log("user")
  
  if (user) {
    console.log(user)
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const addToWish = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error('User not found');
    }

    const { productId } = req.body;

    if (user.wishlist.includes(productId)) {
      throw new Error('Product already exists in the wishlist');
    }

    user.wishlist.push(productId);
    await user.save();

    // Populate wishlist products
    await user.populate('wishlist');
    console.log("wishlist is ",user.wishlist)
    res.json(user.wishlist);
  } catch (error) {
    console.error('Failed to add product to wishlist:', error.message);
    res.status(400).json({ error: error.message });
  }
});

const userWishlist = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Populate wishlist products
    await user.populate('wishlist');
    console.log("wishlist is ",user.wishlist)
    res.json(user.wishlist);
  } catch (error) {
    console.error('Failed to add product to wishlist:', error.message);
    res.status(400).json({ error: error.message });
  }
});

const removeFromWish = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error('User not found');
    }

    const { productId } = req.body;

    if (!user.wishlist.includes(productId)) {
      throw new Error('Product does not exist in the wishlist');
    }

    user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);
    await user.save();

    // Populate wishlist products
    await user.populate('wishlist');
    console.log("wishlist is ", user.wishlist);
    res.json(user.wishlist);
  } catch (error) {
    console.error('Failed to remove product from wishlist:', error.message);
    res.status(400).json({ error: error.message });
  }
});


const sendRestPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (user) {
    let token = await Token.findOne({ userId: user._id });

		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}



    const url = `${process.env.BASE_URL}new-password/${user._id}/${token.token}/`;

    // Example user agent string
    const userAgentString = req.headers['user-agent'];

    // Parse the user agent string
    const agent = useragent.parse(userAgentString);

    // Retrieve the browser name
    const browserName = agent.family;

    // Retrieve the operating system
    const operatingSystem = agent.os.toString();

    console.log(userAgentString)
    console.log(operatingSystem)

    readHTMLFile(templateFilePath)
  .then((templateContent) => {
    // Define the data for the template variables
    const templateData = {
      name: user.name,
      email: user.email,
      browserName,
      operatingSystem,
      action_url:url
    };

    // Render the email template with the data
    const renderedTemplate = renderEmailTemplate(templateContent, templateData);

    // Send the email
    sendEmail(user.email, "Reset Email", renderedTemplate)
      .then(() => {
        console.log('Email sent successfully');
        res.status(200).send({ message: "Password reset link sent to your email account" });

      })
      .catch((error) => {
        console.log('Failed to send email:', error);
      });
  })
  .catch((error) => {
    console.log('Failed to read template file:', error);
  });
  } else {
    res.status(401)
    throw new Error('User Does Not Exist')
  }
})

const verifyResetPassword = asyncHandler(async (req,res)=>{
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });
    console.log(user._id.toString())
    const resetPasswordLink = `http://localhost:3000/new-password/${user._id.toString()}/${token.token}`;
    res.redirect(resetPasswordLink);
    // res.status(200).send(`http://localhost:3000/new-password/${user._id.toString()}/${token.token}`);
	} catch (error) {
    console.log(error)
		res.status(500).send({ message: "Internal Server Error ",error });
	}
})

const setNewPassword = asyncHandler(async (req, res) => {
	try {

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		// if (!user.verified) return res.status(400).send({ message: "Invalid link" });
    // $2a$10$NkwMc8U5nV214hHBIQVNau6POGP2R4mv49Lb9cirTLY/Cb96I9sGi
    if (req.body.password) {
      user.password = req.body.password
    }

    // const updatedUser = await user.save()

		// const salt = await bcrypt.genSalt(Number(process.env.SALT));
		// const hashPassword = await bcrypt.hash(req.body.password, salt);

		// user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})


export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToWish,
  removeFromWish,
  userWishlist,
  sendRestPassword,
  verifyResetPassword,
  setNewPassword
}
