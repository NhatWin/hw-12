require("console.table");
const mysql = require("mysql2");


const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sample_db",
  password: "password123",
});

const rolesList = async () => {
  const roles = await conn.promise().query("SELECT * FROM roles")
  return roles;
};

const employeeList = async () => {
  const roles = await conn.promise().query("SELECT * FROM employees")
  return roles;
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


const addEmployee = (data, roleId, managerId) => {
  conn
    .promise()
    .query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${data.first}", "${data.last}", ${roleId.id}, ${managerId.id});`
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

const employeeQuestions = (roles, managers) => [
  {
    type: "input",
    name: "first",
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
    choices: roles,
  },
  {
    type: "rawlist",
    name: "manager",
    message: "What is the employee's manager?",
    choices: managers,
  }
]

const getTitle = (data) => {
  return [data.title].join("")
}

const getManager = (data) => {
  return [`${data.first_name} ${data.last_name}`].join("")
}

const menu = () => {
  prompt(options).then(async(data) => {
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
      const [roles] = await rolesList();
      const roleList = roles.map(getTitle);
      const [manager] = await employeeList();
      const managerList = manager.map(getManager);
      prompt(employeeQuestions(roleList, managerList)).then((data) => {
        const roleId = roles.find(find => find.title === data.role);
        const managerArray = data.manager.split(" ")
        const managerId = manager.find(find => find.first_name === managerArray[0])
        addEmployee(data, roleId, managerId)
      })
    }
  });
};
menu();
