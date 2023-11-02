const errors = require("restify-error");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (server) => {
  // Register the user
  server.post("/register", async (req, res) => {
    try {
      // check if JSON is available
      if (!req.is("application/json")) {
        return res.send(400, {
          data: new errors.invalidContentError(err),
          message: 'Expected "application/json"',
        });
      }

      const { email, password } = req.body;

      // Check if an user with the same email already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.send(409, {
          data: new errors.ConflictError(
            "User with the same email already exists"
          ),
          message: "User with the same email already exists",
        });
      }

      // Create a new user if not exists

      const newUser = new User({ email, password });
      
    //   bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(newUser.password, salt, async (err, hash) => {
    //         // hashed password
    //         newUser.password = hash;
    //         // save user
    //         try {
    //             const user = await newUser.save(); // Save
    //             res.send(201, {
    //                 data: user,
    //                 message: "Successfully created.",
    //               });

    //         } catch (err) {
    //             res.send(500, {
    //                 data: new errors.InternalError(err),
    //                 message: "Failed to create! Please try again.",
    //               });
    //         }

    //     });
    //   })

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hash = await bcrypt.hash(newUser.password, salt);

        // Update user password with the hashed password
        newUser.password = hash;

        // Save user
        const user = await newUser.save();

        res.send(201, {
          data: user,
          message: "Successfully created.",
        });
      }
      catch (err) {
        res.send(500, {
          data: new errors.InternalError(err),
          message: "Failed to create! Please try again.",
        });
      }

    } catch (err) {
        res.send(500, {
            data: new errors.InternalError(err),
            message: "Failed to create! Please try again.",
          });
    }
  });
};
