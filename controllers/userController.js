const fs = require("fs");

const filePath = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users
    });
}

exports.postUser = (req, res) => {
    res.status(200).json({
        status: "success",
    });
}
exports.getUserById = (req, res) => {
}
exports.patchUserById = (req, res) => {
}
exports.deleteUserById = (req, res) => {
}
