const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database instance
const db = new sqlite3.Database('mydatabase.db');

// Create a table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tickerdata (
        ticker TEXT, 
        date DATE, 
        revenue INTEGER,
        gp INTEGER,
        fcf INTEGER,
        capex INTEGER
    )`);
});

// Close the database connection
db.close();
