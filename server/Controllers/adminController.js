const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const data = require("../data.json");

class AuthController {
    async getData(req, res) {
        try {
            const dataJSON = await JSON.parse(fs.readFileSync("data.json", "utf8"));
            if (dataJSON) {
                return res.json(dataJSON);
            }
        } catch (error) {
            res.status(400).json({ message: "Get data error", e: error.message });
        }
    }

    async deleteGroup(req, res) {
        const { idDeleteGroup, idMoveGroup } = req.body;
        if (idMoveGroup > 0) {
            const indexDeleteGroup = dataJSON.groups.findIndex((group) => group.id === idDeleteGroup);
            const indexMoveGroup = dataJSON.groups.findIndex((group) => group.id === idMoveGroup);
            dataJSON.groups[indexMoveGroup].games.push(...dataJSON.groups[indexDeleteGroup].games);
        }
        dataJSON.groups = dataJSON.groups.filter((group) => group.id !== idDeleteGroup);
        return res.json(dataJSON);
    }

    async editGroup(req, res) {
        const { idEditGroup, nameEditGroup, idsGames } = req.body;
        const indexEditGroup = dataJSON.groups.findIndex((group) => group.id === idEditGroup);
        if (idsGames.length > 0) {
            dataJSON.groups = dataJSON.groups.map((group, index) => {
                if (index === indexEditGroup) {
                    group.games = idsGames;
                    group.name = nameEditGroup;
                    return group;
                }
                return group;
            });
        } else {
            dataJSON.groups = dataJSON.groups.filter((group) => group.id !== idEditGroup);
        }
        return res.json(dataJSON);
    }

    async addGroup(req, res) {
        const { nameAddGroup, idsGames } = req.body;
        dataJSON.groups.length === 0
            ? dataJSON.groups.push({ id: 1, name: nameAddGroup, games: idsGames })
            : dataJSON.groups.push({
                  id: dataJSON.groups[dataJSON.groups.length - 1].id + 1,
                  name: nameAddGroup,
                  games: idsGames,
              });
        return res.json(dataJSON);
    }
}

module.exports = new AuthController();
