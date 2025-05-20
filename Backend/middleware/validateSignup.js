const { body, validationResult } = require("express-validator");

const commonValidations = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
    body("phone")
  .isLength({ min: 10, max: 10 })
  .withMessage("Phone number must be exactly 10 digits")
  .isNumeric()
  .withMessage("Phone number must contain only numbers"),
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
    .withMessage("Passwords must match"),
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("First name must contain only letters"),
  body("lastName")
    .notEmpty().withMessage("Last name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only letters"),
    body("middleName")
    .matches(/^[A-Za-z\s]+$/).withMessage("Middle name must contain only letters"),
];

const vendorValidations = [
   body("first_name")
    .notEmpty().withMessage("First name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("First name must contain only letters"),
  body("last_name")
    .notEmpty().withMessage("Last name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only letters"),
  body("middle_name")
    .notEmpty().withMessage("Last name is required")
    .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only letters"),
  
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
