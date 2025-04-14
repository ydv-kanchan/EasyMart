use ecommerce;
show tables;
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  house_no VARCHAR(20) NOT NULL,
  street VARCHAR(100),
  landmark VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from customers;

select * from vendors;

truncate customers;
truncate vendors;

desc customers;
desc vendors;



-- vendor and category tables.

CREATE TABLE vendors (
    vendor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    businessName VARCHAR(255),
    storeName VARCHAR(255),
    storeDescription TEXT,
    store_logo VARCHAR(255), -- image path or URL
    is_verified TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE vendors
MODIFY first_name VARCHAR(100) NOT NULL,
MODIFY last_name VARCHAR(100) NOT NULL,
MODIFY phone VARCHAR(20) NOT NULL;

CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name ENUM('Fashion', 'Beauty', 'Toys', 'Home') NOT NULL UNIQUE
);

-- Insert the fixed categories:
INSERT INTO categories (category_id, category_name) VALUES
(1, 'Fashion'),
(2, 'Beauty'),
(3, 'Toys'),
(4, 'Home');

CREATE TABLE item_types (
    item_type_id INT AUTO_INCREMENT PRIMARY KEY,
    item_type_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Fashion (category_id = 1)
INSERT INTO item_types (item_type_name, category_id) VALUES
('men', 1),
('women', 1),
('shoes', 1),
('kids', 1);

-- Beauty (category_id = 2)
INSERT INTO item_types (item_type_name, category_id) VALUES
('skin', 2),
('hair', 2),
('makeup', 2),
('perfume', 2);

-- Toys (category_id = 3)
INSERT INTO item_types (item_type_name, category_id) VALUES
('soft', 3),
('remote', 3),
('puzzle', 3),
('board', 3);

-- Home (category_id = 4)
INSERT INTO item_types (item_type_name, category_id) VALUES
('kitchen', 4),
('cookware', 4),
('storage', 4),
('sheets', 4);

select * from categories;

select * from item_types;

show tables;

CREATE TABLE vendor_categories (
    vendor_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (vendor_id, category_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_desc TEXT,
    item_price DECIMAL(10, 2) NOT NULL,
    item_stock INT DEFAULT 0,
    item_image VARCHAR(255), -- path or URL
    vendor_id INT NOT NULL,
    category_id INT NOT NULL,
    item_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (item_type_id) REFERENCES item_types(item_type_id) ON DELETE CASCADE
);

show tables;
select * from vendors;
select * from customers;
select * from vendor_categories;


ALTER TABLE vendors
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry BIGINT;


ALTER TABLE customers
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry BIGINT;

desc vendors;
desc customers;
select * from items;

select * from customers;
select * from vendors;

truncate customers;
truncate vendor_categories;
delete from vendors where vendor_id = 2;
delete from customers where id = 3;
