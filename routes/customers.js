const errors = require("restify-error");
const Customer = require("../models/Customer");
module.exports = (server) => {
  //GET /customers
  server.get("/customers", async (req, res) => {
    try {
      const customerList = await Customer.find({});
      res.send(200, {
        data: customerList,
        message: "Success",
      });
    } catch (err) {
      res.send(400, {
        data: new errors.invalidContentError(err),
        message: "Error while getting customers",
      });
    }
  });

  // GET /customers/:id
  server.get("/customers/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const customer = await Customer.findById(id);
      res.send(200, {
        data: customer,
        message: "Success",
      });
    } catch (err) {
      res.send(404, {
        data: new errors.ResourceNotFoundError(err),
        message: "Error while getting customer with id: " + id,
      });
    }
  });

  // POST /customers
  server.post("/customers", async (req, res) => {
    try {
      // check if JSON is available
      if (!req.is("application/json")) {
        res.send(400, {
          data: new errors.invalidContentError(err),
          message: 'Expected "application/json"',
        });
      }

      const { name, email, balance } = req.body;

      // Check if a customer with the same name and email already exists
      const existingCustomer = await Customer.findOne({ name, email });

      if (existingCustomer) {
        return res.send(409, {
          data: new errors.ConflictError(
            "Customer with the same name and email already exists"
          ),
          message: "Customer with the same name and email already exists",
        });
      }

      // Create a new customer if not exists

      const newCustomer = new Customer({ name, email, balance });
      const customer = await newCustomer.save(); // Save the customer

      res.send(201, {
        data: customer,
        message: "Customer " + customer.name + "'s record is now created",
      });
    } catch (err) {
      res.send(500, {
        data: new errors.InternalError(err),
        message: "Failed to create! Please try again.",
      });
    }
  });

  // PUT /customers/:id
  server.put("/customers/:id", async (req, res) => {
    id = req.params.id;
    try {
      // check if JSON is available
      if (!req.is("application/json")) {
        res.send(400, {
          data: new errors.invalidContentError(err),
          message: 'Expected "application/json"',
        });
      }

      // update existing
      const customer = await Customer.findOneAndUpdate({ _id: id }, req.body);

      res.send(200, {
        data: customer,
        message: "Customer with id " + id + " is now updated successfully.",
      });
    } catch (err) {
      res.send(404, {
        data: new errors.ResourceNotFoundError(err),
        message: "Failed to update! Please try again.",
      });
    }
  });

  // DELETE /customers/:id
  server.del("/customers/:id", async (req, res) => {
    id = req.params.id;
    try {
      // delete existing
      await Customer.findOneAndDelete({ _id: id });

      res.send(204, {
        data: '',
        message: "Customer with id " + id + " is now deleted successfully.",
      });
    } catch (err) {
      res.send(404, {
        data: new errors.ResourceNotFoundError(err),
        message: "Failed to update! Please try again.",
      });
    }
  });
};
