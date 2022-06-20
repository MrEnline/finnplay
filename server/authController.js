const Role = require('./models/Role.js');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require('./config.js');

const generateAccessToken = (id, roles) => {
    const payLoad = {
        id,
        roles,
    };
    return jwt.sign(payLoad, secret, { expiresIn: '24h' });
};

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: 'Error on registration' });
            }
            const { username, password } = req.body; //получаем имя и пароль из тела запроса
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({
                    message: 'A user with the same name already exists',
                });
            }
            const hashPassword = bcrypt.hashSync(password, 7); //хэширование пароля
            const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save(); //сохранение пользователя в БД
            return res.json({
                message: 'User successfully registered',
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Registration error',
                e: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username }); //пытаемся получить пользователя из БД
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `${user} with this name not found` });
            }
            //сравнение пароля, которое ввел пользователь и тем, который расположен в БД
            const validPassword = await bcrypt.compareSync(
                password,
                user.password
            );
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: 'Wrong password entered' });
            }
            //генерация токена, который затем будет отправлен пользователю
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ username, token });
        } catch (error) {
            res.status(400).json({ message: 'Login error', e: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            //добавление ролей в БД. Таким путем лучше не делать никогда
            // const userRole = new Role();
            // const adminRole = new Role({ value: 'ADMIN' });
            // await userRole.save();
            // await adminRole.save();
            const users = await User.find();
            res.json(users);
        } catch (error) {}
    }
}

module.exports = new authController();
