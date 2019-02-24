var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // first prompt
    displayProducts();
});

var displayProducts = function(){
    connection.query('SELECT * FROM products', function(err, res){
        if (err) throw err;
        // console.log('Displaying products from ' + res[0].department_name);
        for (var i = 0; i < res.length; i++){
            console.log('\nDepartment: ' + res[i].department_name + '\n' + res[i].id + '. ' + res[i].product_name + '\nPrice: $' + res[i].price)
        }
        askCustomer(res);
    });
}

var askCustomer = function(x){
    console.log('')
    inquirer.prompt([
        {
        type: 'input',
        name: 'product',
        message: 'Which product would you like to purchase? (Please enter product #)'
        },
        {
        type: 'input',
        name: 'quantity',
        message: 'Please enter quantity of purchase.'
        }
    ]).then(function(inquirerRes){
        var query = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
        connection.query(query, [inquirerRes.quantity, x[inquirerRes.product - 1].id], function(err){
            if (err) throw err;
            if(x[inquirerRes.product - 1].quantity <= 0 || inquirerRes.stock_quantity > x[inquirerRes.product - 1].quantity) {
                console.log('Out of stock!')
            } else {
                var total = ((x[inquirerRes.product - 1].price) * inquirerRes.quantity).toFixed(2);
                console.log('Total amount: $' + total + '\nSuccessfully purchased ' + inquirerRes.quantity + ' of ' + x[inquirerRes.product - 1].product_name + '.'); 
            }
        });
        connection.end();
    });
}