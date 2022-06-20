const Router = require("express");
const authController = require("./authController");
const router = Router();
const { check } = require("express-validator");
const authMiddleware = require("./middlewaree/authMiddleware.js");
const roleMiddleware = require("./middlewaree/roleMiddleware.js");

//данный роутер прослушивает маршруты, отмеченные ниже
//и выполняет методы, которые задаются вторым параметром
//check - функция middlewares, передается в массиве. Может быть больше чем 1
router.post(
    "/registration",
    [
        check("username", "Field cannot be empty").notEmpty(),
        check(
            "password",
            "Password must be more than 4 and less than 12 characters",
        ).isLength(4, 12),
    ],
    authController.registration,
);
router.post("/login", authController.login);
//router.get("/users", authMiddleware, authController.getUsers);
router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers);

module.exports = router;
