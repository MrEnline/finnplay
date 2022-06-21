//const Role = require('./models/Role.js');
//const User = require('./models/User.js');
//const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { validationResult } = require('express-validator');
const { secret } = require('./config.js');
const { Users } = require('./Users');

const generateAccessToken = (id, role) => {
    const payLoad = {
        id,
        role,
    };
    return jwt.sign(payLoad, secret, { expiresIn: '24h' });
};

class authController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await Users[username];
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `${user} with this name not found` });
            }
            const validPassword = await (password === user.password);
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: 'Wrong password entered' });
            }
            const token = generateAccessToken(user.id, user.adminRole);
            const role = user.adminRole;
            return res.json({ token, role });
        } catch (error) {
            res.status(400).json({ message: 'Login error', e: error.message });
        }
    }

    async checkAuth(req, res) {}

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new authController();
