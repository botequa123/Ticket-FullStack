const { authJwt } = require("../middlewares");
const controller = require("../controllers/ticket.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept, Authorization"
        );
        next();
    });

    // Create a new Ticket
    app.post("/api/tickets", [authJwt.verifyToken], controller.create);

    // Retrieve all Tickets
    app.get("/api/tickets", [authJwt.verifyToken], controller.findAll);

    // Retrieve a single Ticket with id
    app.get("/api/tickets/:id", [authJwt.verifyToken], controller.findOne);

    // Update a Ticket with id
    app.put("/api/tickets/:id", [authJwt.verifyToken, isIT], controller.update);

    // Delete a Ticket with id
    app.delete("/api/tickets/:id", [authJwt.verifyToken, isIT], controller.delete);
};
