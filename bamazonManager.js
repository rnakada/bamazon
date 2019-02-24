var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    managerInv();  
})

var managerInv = function(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Menu Options',
            choices: ['View Products', 'View Low Inventory', 'Add To Inventory', 'Add New Product']
        }
    ]).then(function(res){
        switch(res.choice){

            case 'View Products':
            viewInventory(res.choice);
            break;

            case 'View Low Inventory':
            lowInventory();
            break;

            case 'Add To Inventory':
            viewInventory(res.choice);
            break;

            case 'Add New Product':
            addProduct();
            break;
        }
    });
}

var viewInventory = function(x) {
    connection.query('SELECT * FROM products', function(err,res){
        if(err) throw err;
        // console.log('Displaying products from ' + res[0].department_name);
        for(var i = 0; i < res.length; i++){
            console.log('\nDepartment: ' + res[i].department_name + '\n' + res[i].id + '. ' + res[i].product_name + '\nPrice: $' + res[i].price + '\nQuantity: ' + res[i].quantity);
        }
        if (x === 'Add To Inventory'){
            addInventory(res);
        } else {
            connection.end();
        }
    });
}

var lowInventory = function(){
    connection.query('SELECT * FROM products WHERE quantity <= 5', function(err,res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++){
            console.log('\nDepartment: ' + res[i].department_name + '\n' + res[i].id + '. ' + res[i].product_name + '\nPrice: $' + res[i].price + '\nQuantity: ' + res[i].quantity);
        }
        connection.end();
    })
}

var addInventory = function(x){
    inquirer.prompt([
        {
            type: 'input',
            name: 'product',
            message: 'Which product would you add? (Please enter id #)'
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Enter the quantity you would like to add.'
        }
    ]).then(function(inquirerRes){
        var query = 'UPDATE products SET quantity = quantity + ? WHERE id = ?';
        connection.query(query, [inquirerRes.quantity, x[inquirerRes.product - 1].id], function(err){
            if(err) throw err;
            console.log('You have added ' + inquirerRes.quantity + ' to ' + x[inquirerRes.product - 1].product_name + '.');
        });
        connection.end();
    });
}

var addProduct = function(){
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the product name that you wish to add?'
        },
        {
            name: 'department',
            type: 'input',
            message: 'What department will your product be categorized in?'
        },
        {
            name: 'price',
            type: 'input',
            message: 'What is the amount you wish to list it for?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How much inventory would you wish to keep?',
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ]).then(function(answer){
        connection.query('INSERT INTO products SET ?',
        {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            quantity: answer.quantity
        });
        console.log('A quantity of ' + answer.quantity + ' ' + answer.name + ' has been added into your Inventory Database!');
        connection.end();
    });
}