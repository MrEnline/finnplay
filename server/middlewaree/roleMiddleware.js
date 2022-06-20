const jwt = require('jsonwebtoken');
const { secret } = require('../config.js');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next(); //функция, которая вызывает следующую функцию middleware
        }

        try {
            //вид токена 'bearer dssfadfads.sdfafasfd'. получаем вторую часть через пробел
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: 'User not autorized' });
            }
            //расшифровывает токен и получает из него список ролей в виде массива
            const { roles: userRoles } = jwt.verify(token, secret);
            let hasRole = false;
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res
                    .status(403)
                    .json({ message: 'You dont have access' });
            }
            next(); //вызывает по цепочке следующий middleware
        } catch (error) {
            console.log(error);
            return res
                .status(403)
                .json({ message: 'User not autorized', error: error.message });
        }
    };
};
