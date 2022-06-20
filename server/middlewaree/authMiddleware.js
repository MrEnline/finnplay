const jwt = require("jsonwebtoken");
const { secret } = require("../config.js");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next(); //функция, которая вызывает следующую функцию middleware
    }

    try {
        //вид токена 'bearer dssfadfads.sdfafasfd'. получаем вторую часть через пробел
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "User not autorized" });
        }
        const decodedData = jwt.verify(token, secret); //получаем данные payLoad - id, roles из token
        req.user = decodedData;
        next(); //вызывает по цепочке следующий middleware
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ message: "User not autorized", error: error.message });
    }
};
