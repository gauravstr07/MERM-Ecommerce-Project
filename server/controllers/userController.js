const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const User = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require('../utils/sendEmail')

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilePicUrl",
    },
  });

  sendToken(user, 201, res);

  // const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   message: `welcome to e-commerce🛒 ${user.name}😍`,
  //   token,
  // });
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email or Password"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 201, res);

  // const token = user.getJWTToken();
  // res.status(201).json({
  //   success: true,
  //   message: `${user.name} loggedin successfully...😍`,
  //   token,
  // });
});

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "LoggedOut user",
  });
});

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery by Gaurav-Sutar😎`,
      message,
    });

    res.status(200).json({
      seccess: true,
      message: `Email sent to ${user.email} seccessfully `,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resultPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});
