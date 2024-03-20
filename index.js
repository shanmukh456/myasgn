const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = "mydatabase.db"

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/Api/ticker=:ticker&column=:columns&period=:period", async (request, response) => {
  const { ticker, columns, period } = request.params;

  const columnNames = columns.split(',');

  const currentDate = new Date();
  let startDate = new Date();
  switch (period) {
      case '5y':
          startDate.setFullYear(currentDate.getFullYear() - 5);
          break;
      case '2y':
          startDate.setFullYear(currentDate.getFullYear() - 2);
          break;
     
      default:
        
          response.status(400).send('Invalid or unsupported period');
          return;
  }

 
  const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

  
  let sqlQuery = `SELECT  `;
  columnNames.forEach((column, index) => {
      if (index !== columnNames.length - 1) {
          sqlQuery += `${column}, `;
      } else {
          sqlQuery += `${column} `;
      }
  });
  sqlQuery += `FROM tickerdata WHERE ticker='${ticker}' AND date >= '${formattedStartDate}'`;

  try {
      const dt = await db.all(sqlQuery);
      response.send(dt);
  } catch (error) {
      console.error("Error executing SQL query:", error);
      response.status(500).send("Internal Server Error");
  }
});

