const pool = require("../../Config/database");

module.exports = {
  // Insert Product Details ---------------------------->

  AddProduct: (req, callBack) => {
    let product = req.body;
    let sql = `SET @ProductName=?;SET @SKU=?;SET @Description=?;SET @PurchasePrice=?;SET @RetailPrice=?;SET @CategoryId=?;SET @CountryId=?;SET @Image=?; SET @SupplierId=?;SET @Barcode=?;SET @QtyMimRequired=?;SET @CompanyId=?;CALL AddProduct(@ProductName,@SKU,@Description,@PurchasePrice,@RetailPrice,@CategoryId,@CountryId,@Image,@SupplierId,@Barcode,@QtyMimRequired,@CompanyId,@status,@Err_msg);select @status as status; select @Err_msg as Err_msg;`;

    pool.query(
      sql,
      [
        product.Product_name,
        product.SKU,
        product.Description,
        product.PurchasePrice,
        product.RetailPrice,
        product.CategoryId,
        product.Country_Origin_id,
        product.Image,
        product.SupplierId,
        product.Barcode,
        product.Qty_minimum_required,
        product.CompanyId
      ],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        return callBack(null, results);
      }
    );
  },

  getAllProduct: (CompanyId, callBack) => {
    pool.query(
      "SELECT `product`.`ProductId`,`product`.`Product_name` ,`product`.`SKU`,`product`.`Description`, `ca`.`Category_name` as category, `product`.`Image`,supplier.SupplierName FROM `IMS`.`product` as `product`  inner join category as ca on product.CategoryId = ca.CategoryId  inner join Suppliers as supplier  on  product.SupplierId= supplier.SupplierId where product.CompanyId= ?;",
      [CompanyId],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        console.log(results);
        return callBack(null, results);
      }
    );
  },

  // Delete Product -------------------------------->
  RemoveProduct: (req, callBack) => {
    pool.query(
      "UPDATE product SET IsActive=0 WHERE ProductId=?;",
      [req.body.ProductId],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        console.log(results);
        return callBack(null, results.changedRows);
      }
    );
  },

  // Get Product By Id ------------------------------->

  GetProductById: (CompanyId, ProductId, _callBack) => {
    pool.query(
      "SELECT `product`.`ProductId`,`product`.`Product_name` ,`product`.`SKU`,`product`.`Description`,`product`.`PurchasePrice`,`product`.`RetailPrice`,`product`.`CategoryId`,`product`.`Country_Origin_id`,`product`.`Image`,`product`.`SupplierId`,`product`.`Barcode`,`product`.`Qty_minimum_required`,`product`.`CompanyId`,`product`.`AvailableQty`,`product`.`IsActive` FROM `IMS`.`product` where  `product`.`CompanyId`= ? and `product`.`ProductId`= ? ;",
      [CompanyId, ProductId],

      (error, results, fields) => {
        if (error) {
          return _callBack(error);
        }

        console.log(results);
        return _callBack(null, results);
      }
    );
  },

  // Edit Product ------------------------------------->
  EditProduct: (req, callBack) => {
    let product = req.body;
    let sql = `SET @ProductId=1;SET @ProductName="Adidas updated";SET @Description="Mens sports shoes";SET @PurchasePrice="150";SET @RetailPrice="200";SET @CategoryId="1";SET @Country_Origin_id=1;SET @Image="bjbjkb";SET @SupplierId=2; SET @QtyMinRequired=60;SET @CompanyId =1;SET @AvailableQty=70;CALL EditProduct(@ProductId,@ProductName,@Description,@PurchasePrice,@RetailPrice,@CategoryId,@Country_Origin_id,@Image,@SupplierId,@QtyMinRequired,@AvailableQty,@CompanyId,@status,@Err_msg);select @status as status; select @Err_msg as Err_msg;`;

    pool.query(
      sql,
      [
        product.ProductName,
        product.Description,
        product.PurchasePrice,
        product.RetailPrice,
        product.CategoryId,
        product.Country_Origin_id,
        product.Image,
        product.SupplierId,
        product.QtyMinRequired,
        product.CompanyId,
        product.AvailableQty
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        console.log(results);
        return callBack(null, results);
      }
    );
  }
};
