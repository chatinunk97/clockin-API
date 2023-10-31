const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const { createUserSchema } = require("../validators/authUser-validator.js");
const createError = require("../utils/create-error");

exports.createUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      throw createError(400, error.message);
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...value,
        password: hashedPassword,
      },
    });

    const token = generateAuthToken(newUser);

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// exports.updateUser = async (req, res, next) => {
//   try {
//     const userId = await prisma.user.findFirst({
//       where: {
//         id: +req.params.userId,
//       },
//     });
//     const { email, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { email, password: hashedPassword },
//     });

//     res.json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// };

exports.getUserById = async (req, res, next) => {
  try {
    const userId = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUsers = async (req, res, next) => {
  try {
    const userId = await prisma.user.findFirst({
      where: {
        id: +req.params.userId,
      },
    });

    // if (userId !== req.user.Id) {
    //   return next(
    //     createError("You can only delete your own user account", 403)
    //   );
    // }

    if (!userId) {
      return next(createError("user is not exist", 404));
    }
    console.log(userId);
    const deletedUser = await prisma.user.delete({
      where: {
        id: +req.params.userId,
      },
    });

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    next(error);
  }
};

function generateAuthToken(user) {
  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "1h",
  });
  return token;
}
