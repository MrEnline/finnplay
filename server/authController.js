const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users } = require("./Users");
const fs = require("fs");
const ApiError = require("./api-error");
const data = require("./data.json");

const generateTokens = (id, adminRole) => {
    const payLoad = {
        id,
        adminRole,
    };
    const accessToken = jwt.sign(payLoad, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "12h",
    });
    const refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "72h",
    });
    return {
        accessToken,
        refreshToken,
    };
};

class authController {
    async login(req, res) {
        const { username, password } = req.body;
        const user = await Users[username];
        if (!user) {
            throw ApiError.UnauthorizedError();
        }
        const validPassword = password === user.password;
        if (!validPassword) {
            throw ApiError.UnauthorizedError();
        }
        const tokens = generateTokens(user.id, user.adminRole);
        const adminRole = user.adminRole;
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        fs.writeFileSync("refreshToken.txt", tokens.refreshToken);
        return res.json({ ...tokens, adminRole });
    }

    async checkAuth(req, res) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            fs.writeFileSync("refreshToken.txt", "");
            throw ApiError.UnauthorizedError();
        }
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const refreshTokenFromDB = fs.readFileSync("refreshToken.txt", "utf-8");
        const isTokensEquals = refreshToken === refreshTokenFromDB;
        if (!user || !isTokensEquals) {
            fs.writeFileSync("refreshToken.txt", "");
            throw ApiError.UnauthorizedError();
        }
        const tokens = generateTokens(user.id, user.adminRole);
        const adminRole = user.adminRole;
        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        fs.writeFileSync("refreshToken.txt", tokens.refreshToken);
        return res.json({ ...tokens, adminRole });
    }

    async getData(req, res) {
        try {
            if (data) {
                return res.json(data);
            }
        } catch (error) {}
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            fs.writeFileSync("refreshToken.txt", "");
            res.clearCookie("refreshToken");
            const token = "";
            return res.json(token);
        } catch (e) {
            res.status(400).json({ message: "Logout error", e: error.message });
        }
    }
}

module.exports = new authController();
