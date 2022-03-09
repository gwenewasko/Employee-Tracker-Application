const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "admin3885",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

// Start by asking questions
// View all employees
// Inquirer prompt
inquirer
  .prompt([
    {
      name: "list",
      type: "list",
      choices: [
        {
          name: "View all employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View all departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "View all roles",
          value: "VIEW_ROLES",
        },
      ],
      message: "What would you like to do?",
    },
  ])
  .then((answers) => {
    if (answers.list === "VIEW_EMPLOYEES") {
      viewEmployees();
    } else if (answers.list === "VIEW_DEPARTMENTS") viewDepartments();
  });
function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
}

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
}
