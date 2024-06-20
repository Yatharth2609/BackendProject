const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/Cloudinary.js");
const ApiResponse = require("../utils/ApiResponse.js");

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong at token generation!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  // Validation - non empty
  // Check if user already exist!!
  // check for images and avatar
  // Upload them to Cloudinary, Avatar
  // Create User Object - create entry in DB
  // Remove password and refresh token field from response
  // Check if User created Successfully
  // Return response

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) throw new ApiError(409, "User Already Exist!");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(408, "Avatar File is Required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(408, "Avatar File is Required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const newUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );

  if (!newUser)
    throw new ApiError(500, "Something went wrong during User Registration");

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> Data
  // Is User Registered
  // Invalid Email or Password Given
  // New User
  // Access and Refresh Token
  // Send Cookies

  const { email, username, password } = req.body;

  if (!username || !email)
    throw new ApiError(400, "Username or Email is Required");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User Does Not Exist!!");

  const passCheck = await user.isPasswordCorrect(password);

  if (!passCheck) throw new ApiError(401, "Invalid User Credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  // Sending Cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshTokens", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User LoggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshTokens: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshTokens")
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

(module.exports = registerUser), loginUser, logoutUser;
