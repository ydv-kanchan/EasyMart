const { body, validationResult } = require("express-validator");

const commonValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const customerValidations = [
  body("houseNo").notEmpty().withMessage("House number is required"),
  body("landmark").notEmpty().withMessage("Landmark is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("pincode").isPostalCode("IN").withMessage("Invalid pincode"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match")
];

const vendorValidations = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("businessName").notEmpty().withMessage("Business name is required"),
  body("storeName").notEmpty().withMessage("Store name is required"),
  body("storeDescription").notEmpty().withMessage("Store description is required"),

];

const validateSignup = (role) => {
  return [
    ...commonValidations,
    ...(role === "customer" ? customerValidations : vendorValidations),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

module.exports = validateSignup;
