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
            name: "Add a department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "Add a role",
            value: "ADD_ROLE",
          },
          {
            name: "Update an employee role",
            value: "UPDATE_ROLE",
          },
          {
            name: "Quit",
            value: "QUIT",
            message: "Ok, you're all done!"
          },
        ],
        message: "What would you like to do?",
      },
    ])
    .then((answers) => {
      // console.log(answers);
      if (answers.list === "VIEW_EMPLOYEES") {
        viewEmployees();
      } else if (answers.list === "VIEW_DEPARTMENTS") {
        viewDepartments();
      } else if (answers.list === "VIEW_ROLES") {
        viewRoles();
      } else if (answers.list === "ADD_EMPLOYEES") {
        createEmployee();
      } else if (answers.list === "ADD_DEPARTMENT") {
        createDepartment();
      } else if (answers.list === "ADD_ROLE") {
        createRole();
      } else if (answers.list === "UPDATE_ROLE") {
        updateRole();
      } else if (answers.list === "QUIT") {
        return "Ok, you're all done!";
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
    init();
  });
}

function viewRoles() {
  db.query("SELECT * FROM roles", function (err, results) {
    console.table(results);
    init();
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

function createDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What's the department you'd like to add?",
      },
    ])
    .then((answers) => {
      db.query(
        "INSERT INTO department(department_name) values(?)",
        answers.departmentName
      );

      init();
    });
}

function createRole() {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "What's the role you'd like to add?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What's the salary for the role?",
      },
    ])
    .then((answers) => {
      db.query("SELECT * FROM department", function (err, results) {
        const department = results.map(({ id, department_name }) => ({
          name: department_name,
          value: id,
        }));
        inquirer
          .prompt({
            type: "list",
            name: "id",
            message: "What department does this role belong in?",
            choices: department,
          })
          .then((department) => {
            db.query(
              "INSERT INTO roles(title, salary, department_id) values(?,?,?)",
              [answers.roleName, answers.roleSalary, department.id]
            );
            init();
          });
      });
    });
}

function updateRole() {
  db.query("SELECT * FROM employee", function (err, results) {
    const employees = results.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    db. query("SELECT * FROM roles", function (err, results) {
      const roles = results.map(({id, title}) => ({
        name: title,
        value: id
      }))
      inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employees,
        },
        {
          name: "newRole",
          type: "list",
          message: "What is the employee's new role?",
          choices: roles,
        },
      ])
      .then((answers) => {
        db.query("UPDATE employee SET role_id = ? where id = ?", [answers.newRole, answers.employeeId], function (err, results) {
        })
        init();
      });
    });

  });
  // db.query("SELECT * FROM employee", function (err, results) {
  //   const employee = results.map(
  //     ({ id, first_name, last_name, role_id, manager_id }) => ({
  //       name: title,
  //       value: id,
  //     })
  //   );
  //   inquirer
  //     .prompt({
  //       type: "list",
  //       name: "id",
  //       message: "What is the employee's role?",
  //       choices: roles,
  //     })
  //     .then((role) => {
  //       db.query(
  //         "SELECT * FROM employee where manager_id is null",
  //         function (err, results) {
  //           const managers = results.map(({ id, last_name }) => ({
  //             name: last_name,
  //             value: id,
  //           }));
  //           inquirer
  //             .prompt({
  //               type: "list",
  //               name: "id",
  //               message: "What is the manager's name?",
  //               choices: managers,
  //             })
  //             .then((manager) => {
  //               db.query(
  //                 "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)",
  //                 [answers.firstName, answers.lastName, role.id, manager.id]
  //               );
  //               init();
  //             });
  //         }
  //       );
  //     });
  // });
}


init();
