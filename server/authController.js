const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users } = require("./Users");

const generateTokens = (id, adminRole) => {
    const payLoad = {
        id,
        adminRole,
    };
    const accessToken = jwt.sign(payLoad, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "115s",
    });
    const refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "24h",
    });
    return {
        accessToken,
        refreshToken,
    };
};

let refreshTokenFromDB = "";

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
            const validPassword = password === user.password;
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: "Wrong password entered" });
            }
            const tokens = generateTokens(user.id, user.adminRole);
            const adminRole = user.adminRole;
            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            //const token = tokens.accessToken;
            refreshTokenFromDB = tokens.refreshToken;
            return res.json({ ...tokens, adminRole });
        } catch (error) {
            res.status(400).json({ message: "Login error", e: error.message });
        }
    }

    async checkAuth(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const user = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET,
            );
            const tokenFromDb = refreshToken === refreshTokenFromDB;
            if (!user || !tokenFromDb) {
                return res
                    .status(400)
                    .json({ message: "Login error", e: error.message });
            }

            const tokens = generateTokens(user.id, user.adminRole);

            const adminRole = user.adminRole;

            res.cookie("refreshToken", tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            //const token = tokens.accessToken;

            refreshTokenFromDB = tokens.refreshToken;
            return res.json({ ...tokens, adminRole });
        } catch (e) {
            res.status(400).json({ message: "Login error", e: error.message });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            refreshTokenFromDB = "";
            res.clearCookie("refreshToken");
            const token = "";
            return res.json(token);
        } catch (e) {
            res.status(400).json({ message: "Logout error", e: error.message });
        }
    }
}

module.exports = new authController();
