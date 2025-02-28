const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});

router.get("/logout",(req,res) => {
    res.clearCookie("token").redirect("/");   
})

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        console.error(error); // Logs the error for debugging
        return res.render("signup", {
            error: "Error creating account. Please try again.",
        });
    }
});

module.exports = router;
