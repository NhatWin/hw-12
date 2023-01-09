import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sample_db"
})

const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

const options = [
{
type: "rawlist",
name: "menuOption",
message: "What would you like to do?",
choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"],
}
]

const menu = () => {
    prompt(options).then((data) => {  
        const option = data.menuOption
        if (option === "view all departments") {
            console.log("test 1")
        } else if (option === "view all roles") {
            console.log("test 2")
        }
        })
}

menu()