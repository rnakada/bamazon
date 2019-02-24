DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
    id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
	price DECIMAL(9,2) NULL,
    quantity INT(10),
    PRIMARY KEY(id)
);

    INSERT INTO products
        (product_name, department_name, price, quantity)
    VALUES
        ('HyperX Headset','Electronics', 55.99, 20),
        ('Guiseppe Zanotti','Designer', 1250, 10),
        ('Apple iMac Pro Retina 5k','Electronics', 4999.99, 100),
        ('Porsche GT3RS', 'Automotive', 187500.00, 2),
        ('Lamborghini Huracan Performante Spyder', 'Automotive', 305000.00, 1),
        ('Givenchy Track Jacket', 'Designer', 1560.00, 5);


    SELECT * FROM products;