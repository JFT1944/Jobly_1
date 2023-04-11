const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// The purpose of this function is to exchange js objects to sql ready queries.

// data to update => will be the entered object

// jsToSql => Is the sql that it needs to be attached to.

// sqlforPartialUpdates takes partial information for an update and updates a sql string with the correct items filled out. 
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  
  
  if (!dataToUpdate || !jsToSql|| typeof(dataToUpdate) !== "object" || typeof(jsToSql) !== "object"){
    return 'no data'
  }

  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
