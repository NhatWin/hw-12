require("console.table");
const mysql = require("mysql2");


const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sample_db",
  password: "password123",
});

const departmentsList = async () => {
  const departments = await conn.promise().query("SELECT * FROM departments")
  return departments;
}

const rolesList = async () => {
  const roles = await conn.promise().query("SELECT * FROM roles")
  return roles;
};

const employeeList = async () => {
  const employees = await conn.promise().query("SELECT * FROM employees")
  return employees;
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

const addDepartment = (data) => {
  conn.promise().query(`INSERT INTO departments (name) VALUES ("${data.department}");`)
  .then(() => console.log("Department added!"));
}

const addRole = (data, departmentId) => {
  conn.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES ("${data.title}", ${data.pay}, ${departmentId.id});`)
  .then(() => console.log("Department added!"));
}

const addEmployee = (data, roleId, managerId) => {
  conn
    .promise()
    .query(
      `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${data.first}", "${data.last}", ${roleId.id}, ${managerId.id});`
    )
    .then(() => console.log("Employee added!"));
};

const updateEmployee = (roleId, employeeId) => {
    conn.promise().query(`UPDATE employees SET role_id = ${roleId.id} WHERE id = ${employeeId.id}`).then(() => console.log("Employee role updated"))
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

const departmentQuestions = [
  {
    type: "input",
    name: "department",
    message: "Add new department."
  }
]

const roleQuestions = (departments) => [
  {
    type: "input",
    name: "title",
    message: "What is the tite role?",
  },
  {
    type: "input",
    name: "pay",
    message: "What is the role's salary?",
    validate: (answer) => {
      if (isNaN(answer)) {
        return "Pleas enter a number";
      } else {
        return true;
      }
    },
  },
  {
    type: "rawlist",
    name: "department",
    message: "What department is the role in?",
    choices: departments,
  }
]

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

const updateQuestions = (roles, empoyees) => [
  {
    type: "rawlist",
    name: "employee",
    message: "Update an employee.",
    choices: empoyees,
  },
  {
    type: "rawlist",
    name: "role",
    message: "Change role.",
    choices: roles,
  }
]

const getName = (data) => {
  return [data.name].join("")
}

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
      prompt(departmentQuestions).then(async(data) => {
        addDepartment(data);
      })
    } else if (option === "add a role") {
      const [departments] = await departmentsList();
      const departmentList = departments.map(getName);
      prompt(roleQuestions(departmentList)).then(async(data) => {
        const departmentId = departments.find(find => find.name === data.department)
        addRole(data, departmentId)
      })
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
    } else if (option === "update an employee role") {
      const [roles] = await rolesList();
      const roleList = roles.map(getTitle);
      const [employee] = await employeeList();
      const workerList = employee.map(getManager);
      prompt(updateQuestions(roleList, workerList)).then((data) => {
        const roleId = roles.find(find => find.title === data.role);
        const employeeArray = data.employee.split(" ")
        const employeeId = employee.find(find => find.first_name === employeeArray[0])
        updateEmployee(roleId, employeeId)
      })
    }
  });
};
menu();
