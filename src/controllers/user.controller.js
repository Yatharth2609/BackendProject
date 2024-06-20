const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const User = require("../models/user.model.js");
const uploadOnCloudinary = require("../utils/Cloudinary.js");
const ApiResponse = require("../utils/ApiResponse.js");

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

  const existingUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) throw new ApiError(409, "User Already Exist!");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.fiels?.coverImage[0]?.path;

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
    "-password -refreshToken"
  );

  if (!newUser)
    throw new ApiError(500, "Something went wrong during User Registration");

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User Registered Successfully"));
});

module.exports = registerUser;
