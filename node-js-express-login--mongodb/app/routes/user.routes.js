const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept, Authorization"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);
    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
    app.get("/api/test/IT", [authJwt.verifyToken, authJwt.isIT], controller.ITBoard);
    app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
    app.get("/api/user/profile", [authJwt.verifyToken], controller.userProfile);

    app.get("/api/auth/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getUsers);
    app.get("/api/auth/roles", [authJwt.verifyToken, authJwt.isAdmin], controller.getRoles);
    app.post("/api/auth/users", [authJwt.verifyToken, authJwt.isAdmin], controller.createUser);
    app.put("/api/auth/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
    app.delete("/api/auth/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
    app.put("/api/auth/users/:id/roles", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUserRoles);
};
