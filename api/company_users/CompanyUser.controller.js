const {
  getUserByUserEmail,
  createCompany_User
} = require("./CompanyUser.service");

//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
module.exports = {
  authcompanyuser: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
      console.log(body.password);
      // const result = compareSync(body.password, results.Password);

      const result = true;
      debugger;
      if (result) {
        debugger;
        results.Password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "1d"
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
          data: results
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
    });
  },

  // Inserting Company User and Company Details ------------>
  createCompany: (req, res) => {
    createCompany_User(req, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          data: err
        });
      } else if (results[15][0]["status"] == null) {
        return res.json({
          success: 0,
          message: "Internal server error!"
        });
      } else if (results[15][0]["status"] == "0") {
        return res.json({
          success: 0,
          message: results[16][0]["Err_msg"]
        });
      } else {
        return res.json({
          success: 1,
          message: "Company Profile created Successfully"
        });
      }
    });
  }
};