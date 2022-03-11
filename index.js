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
function init() {
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
          {
            name: "Add an employee",
            value: "ADD_EMPLOYEES",
          },
          {
            name: "Quit",
            value: "QUIT",
          },
        ],
        message: "What would you like to do?",
      },
    ])
    .then((answers) => {
      if (answers.list === "VIEW_EMPLOYEES") {
        viewEmployees();
      } else if (answers.list === "VIEW_DEPARTMENTS") {
        viewDepartments();
      } else if (answers.list === "ADD_EMPLOYEES") {
        createEmployee();
      }
    });
}

function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
    init();
  });
}

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
}

function viewRoles() {
  db.query("SELECT * FROM roles", function (err, results) {
    console.table(results);
  });
}

function createEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What's the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What's the employee's last name?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM roles", function (err, results) {
        const roles = results.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "id",
            message: "What is the employee's role?",
            choices: roles,
          })
          .then((role) => {
            db.query(
              "SELECT * FROM employee where manager_id is null",
              function (err, results) {
                const managers = results.map(({ id, last_name }) => ({
                  name: last_name,
                  value: id,
                }));
                inquirer
                  .prompt({
                    type: "list",
                    name: "id",
                    message: "What is the manager's name?",
                    choices: managers,
                  })
                  .then((manager) => {
                    db.query(
                      "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)",
                      [answers.firstName, answers.lastName, role.id, manager.id]
                    );
                    init();
                  });
              }
            );
          });
      });
    });
}
// Inquirer prompt to ask for first, last name
// .then query roles table
// Inquirer prompt for role they want to choose
// .then ask who the manager is

init();
