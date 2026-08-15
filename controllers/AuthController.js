const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


// ==================== LOGIN ====================

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        isLoggedIn: false,
        errorMessages: [],
        oldInput: {
            Email: ""
        },
        user: {}
    });
};


exports.postLogin = async (req, res, next) => {


    const { Email, Password } = req.body;

    console.log("Entered Email:", Email);

    try {

        // Database me lowercase field "email" hai
        const user = await User.findOne({
            Email: Email
        });

        console.log("Found User:", user);

        // User nahi mila
        if (!user) {
            return res.render("auth/login", {
                pageTitle: "Login",
                isLoggedIn: false,
                errorMessages: ["Invalid Email"],
                oldInput: {
                    Email: Email
                },
                user: {}
            });
        }

        // Password compare
        const isMatch = await bcrypt.compare(
            Password,
            user.Password
        );

        // Password galat hai
        if (!isMatch) {
            return res.render("auth/login", {
                pageTitle: "Login",
                isLoggedIn: false,
                errorMessages: ["Invalid Password"],
                oldInput: {
                    Email: Email
                },
                user: {}
            });
        }

        // Login successful
        req.session.isLoggedIn = true;
req.session.user = user;
console.log("Session user set:", req.session.user);

        await req.session.save();

        res.redirect("/store");

    } catch (err) {

        console.log("Error while logging in:", err);
        next(err);

    }
};


// ==================== LOGOUT ====================

exports.postLogout = (req, res, next) => {

    req.session.destroy(() => {
        res.redirect("/login");
    });

};


// ==================== SIGN UP PAGE ====================

exports.getSignUp = (req, res, next) => {

    res.render("auth/signup", {
        pageTitle: "Sign Up",
        isLoggedIn: false,

        errorMessages: [],

        oldInput: {
            FirstName: "",
            LastName: "",
            Email: "",
            UserType: ""
        },

        user: {}
    });

};


// ==================== SIGN UP ====================

exports.postSignUp = [

    // ---------- First Name ----------

    check("FirstName")
        .notEmpty()
        .withMessage("First Name is required")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First Name must be at least 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First Name should contain only alphabets"),


    // ---------- Last Name ----------

    check("LastName")
        .notEmpty()
        .withMessage("Last Name is required")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Last Name must be at least 2 characters long")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Last Name should contain only alphabets"),


    // ---------- Email ----------

    check("Email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid Email")
        .normalizeEmail(),


    // ---------- Password ----------

    check("Password")
        .isLength({ min: 8 })
        .withMessage("Password should be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password should contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password should contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password should contain at least one number")
        .matches(/[!@&]/)
        .withMessage("Password should contain at least one special character")
        .trim(),


    // ---------- Confirm Password ----------

    check("ConfirmPassword")
        .trim()
        .custom((value, { req }) => {

            if (value !== req.body.Password) {
                throw new Error("Passwords do not match");
            }

            return true;
        }),


    // ---------- User Type ----------

    check("UserType")
        .notEmpty()
        .withMessage("Please select user type")
        .isIn(["Guest", "Host"])
        .withMessage("Invalid user type"),


    // ---------- Terms & Conditions ----------

    check("TC")
        .notEmpty()
        .withMessage("Please accept the terms and conditions"),


    // ---------- Final Handler ----------

    async (req, res, next) => {

        const {
            FirstName,
            LastName,
            Email,
            Password,
            UserType
        } = req.body;


        const errors = validationResult(req);


        // Validation errors
        if (!errors.isEmpty()) {

            return res.status(422).render("auth/signup", {

                pageTitle: "Sign Up",

                isLoggedIn: false,

                errorMessages: errors
                    .array()
                    .map(error => error.msg),

                oldInput: {
                    FirstName,
                    LastName,
                    Email,
                    UserType
                },

                user: {}
            });
        }


        try {

            // ---------- Check existing user ----------

            const existingUser = await User.findOne({
                email: Email
            });

            if (existingUser) {

                return res.status(422).render("auth/signup", {

                    pageTitle: "Sign Up",

                    isLoggedIn: false,

                    errorMessages: [
                        "An account with this Email already exists"
                    ],

                    oldInput: {
                        FirstName,
                        LastName,
                        Email,
                        UserType
                    },

                    user: {}
                });
            }


            // ---------- Hash Password ----------

            const hashedPassword = await bcrypt.hash(
                Password,
                12
            );


            // ---------- Create User ----------

            const user = new User({
    FirstName: FirstName,
    LastName: LastName,
    Email: Email,
    Password: hashedPassword,
    UserType: UserType
});


            // ---------- Save User ----------

            await user.save();

            console.log("User registered successfully");


            // ---------- Signup Successful ----------

            res.redirect("/login");


        } catch (err) {

            console.log("Error while signing up:", err);

            return res.status(422).render("auth/signup", {

                pageTitle: "Sign Up",

                isLoggedIn: false,

                errorMessages: [err.message],

                oldInput: {
                    FirstName,
                    LastName,
                    Email,
                    UserType
                },

                user: {}
            });

        }

    }

];