const {
  add_Customer_orderDetails,
  addSalesorderProduct,
  getSalesById,
  getAllSales,
  getMaxSoldsItems,
  getMinSoldsItems,
  getRecentSalesByWeek,
  getSalesPerCategory
} = require("./Sales.service");
const _ = require("lodash");

module.exports = {
  //creating sales
  createSales: (req, res) => {
    add_Customer_orderDetails(req, (err, results) => {
      console.log(results);
      if (results == undefined) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else if (results[3][0].status == null) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else if (results[3][0].status == 0) {
        return res.status(400).json({
          success: "0",
          message: "Bad request error!"
        });
      } else {
        console.log(results[5][0]);
        var orderid = results[5][0].orderid;
        addSalesorderProduct(req, orderid, (err, resultss) => {
          console.log(err);
          if (err) {
            return res.status(500).json({
              success: "0",
              message: "Internal server error!"
            });
          } else {
            return res.status(200).json({
              success: "1",
              message: "order done successfully"
            });
          }
        });
      }
    });
  },
  //Getting all the order by passing order id and company id
  GetSalesOrderById: (req, res) => {
    let orderid = "";
    let companyid = "";
    if (typeof req.query.orderid != "undefined") {
      orderid = req.query.orderid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..customer order id is missing "
      });
    }
    if (typeof req.query.companyid != "undefined") {
      companyid = req.query.companyid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..company id is missing "
      });
    }
    getSalesById(orderid, companyid, (err, results) => {
      console.log(results);
      if (err) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else {
        return res.status(200).json({
          success: "1",
          data: results
        });
      }
    });
  },
  //get all the sales by passing country in body
  GetSales: (req, res) => {
    var response = [];
    console.log(req.body.companyid);
    let companyid = "";
    if (typeof req.body.companyid != "") {
      companyid = req.body.companyid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "company id cannot be null!"
      });
    }
    getAllSales(companyid, (err, results) => {
      //console.log(results);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: "0",
          message: "Internal Server Error",
          error: err
        });
      }
      if (results.length == 0) {
        return res
          .status(404)
          .json({ success: "0", message: " Resource does not exist." });
      } else {
        if (typeof req.query.CustomerOrderId != "undefined") {
          results.filter(function(result) {
            if (
              result.CustomerOrderId.toString() == req.query.CustomerOrderId
            ) {
              response.push(result);
            }
          });
        }

        if (typeof req.query.Date != "undefined") {
          results.filter(function(result) {
            var str = result.Date.toString();
            if (_.includes(str, req.query.Date)) {
              response.push(result);
            }
          });
        }
        // de-duplication: by product id
        response = _.uniqBy(response, "CustomerOrderId");

        // in case no filtering has been applied, respond with all stores
        if (Object.keys(req.query).length === 0) {
          response = results;
        }

        return res.status(200).json({
          success: "1",
          data: response
        });
      }
    });
  },
  GetHighestSoldProduct: (req, res) => {
    let companyid = "";
    if (typeof req.query.companyid != "undefined") {
      companyid = req.query.companyid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..company id is missing "
      });
    }

    getMaxSoldsItems(companyid, (err, results) => {
      console.log(results);
      if (err) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else {
        if (results.length == 0) {
          return res
            .status(404)
            .json({ success: "0", message: " Resource does not exist." });
        }
        return res.status(200).json({
          success: "1",
          data: results
        });
      }
    });
  },

  GetLeastSoldProduct: (req, res) => {
    let companyid = "";
    if (typeof req.query.companyid != "undefined") {
      companyid = req.query.companyid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..company id is missing "
      });
    }

    getMinSoldsItems(companyid, (err, results) => {
      console.log(results);
      if (err) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else {
        if (results.length == 0) {
          return res
            .status(404)
            .json({ success: "0", message: " Resource does not exist." });
        }
        return res.status(200).json({
          success: "1",
          data: results
        });
      }
    });
  },
  // Get recent Sales By this week --------------------------------------->

  GetRecentSalesByWeek: (req, res) => {
    let CompanyId = "";
    if (typeof req.query.CompanyId != "undefined") {
      companyid = req.query.CompanyId;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..CompanyId is missing "
      });
    }

    getRecentSalesByWeek(CompanyId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      } else {
        return res.status(200).json({
          success: "1",
          data: results
        });
      }
    });
  },
  GetSalsePerCategory: (req, res) => {
    let companyid = "";
    if (typeof req.query.companyid != "undefined") {
      companyid = req.query.companyid;
    } else {
      return res.status(400).json({
        success: "0",
        message: "Invalid request..company id is missing "
      });
    }

    getSalesPerCategory(companyid, (err, results) => {
      console.log(results);
      if (err) {
        return res.status(500).json({
          success: "0",
          message: "Internal server error!"
        });
      }
      if (results.length == 0) {
        return res
          .status(404)
          .json({ success: "0", message: " Resource does not exist." });
      } else {
        return res.status(200).json({
          success: "1",
          data: results
        });
      }
    });
  }
};
