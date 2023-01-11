require("console.table");
const mysql = require("mysql2");


const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sample_db",
  password: "password123",
});

const rolesList = () => {
  conn.promise().query("SELECT * FROM roles").then(([data]) => {
    const roleData = data.map(({id, title}) => ({name:title, id:id})) 
    return roleData;
  })
};

const EmployeeList = () => {
    conn.promise().query("SELECT * FROM employees").then(([data]) => {
        const employeeData = data.map(({id, first_name, last_name}) => ({name:`${first_name} ${last_name}` , id:id})) 
        return employeeData;
    })
}

const allDepartments = () => {
  conn
    .promise()
    .query("SELECT * FROM departments")
    .then(([data]) => console.table(data));
};

const allRoles = () => {
  conn
    .promise()
    .query("SELECT * FROM roles")
    .then(([data]) => console.table(data));
};

const allEmployees = () => {
  conn
    .promise()
    .query("SELECT * FROM employees")
    .then(([data]) => console.table(data));
};


const addEmployee = (data) => {
  conn
    .promise()
    .query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(${data.first}, ${data.last}, ${data.role}, ${data.manager})`
    )
    .then(() => console.log("Employee added!"));
};

const updateEmployee = (data) => {
    conn.promise().query(`UPDATE employees SET role_id = ${data.roleId} WHERE id = ${data.employeeId}`).then(() => console.log("Employee role updated"))
}

const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const options = [
  {
    type: "rawlist",
    name: "menuOption",
    message: "What would you like to do?",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
      "exit"
    ],
  },
];

const employeeQuestions = (data) => [
  {
    type: "input",
    name: "fist",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "last",
    message: "What is the employee's last name?",
  },
  {
    type: "rawlist",
    name: "role",
    message: "What is the employee's role?",
    // choices: data.map(role => role.name),
  },
]

const menu = () => {
  prompt(options).then((data) => {
    const option = data.menuOption;
    if (option === "view all departments") {
      allDepartments();
    } else if (option === "view all roles") {
      allRoles();
    } else if (option === "view all employees") {
      allEmployees();
    } else if (option === "add a department") {

    } else if (option === "add a role") {

    } else if (option === "add an employee") {
       rolesList().then((data) => console.log(data));
    }
  });
};
menu();
