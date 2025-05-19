use ecommerce;
show tables;
desc items;
select * from items;

-- CREATE TABLE orders (
--   order_id INT AUTO_INCREMENT PRIMARY KEY,
--   customer_id INT NOT NULL,
--   item_id INT NOT NULL,
--   quantity INT NOT NULL CHECK (quantity > 0),
--   total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
--   order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
--   FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
--   FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
-- );

CREATE TABLE orders (
  order_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,                             -- Link to customer
  item_id INT NOT NULL,                                 -- Link to product
  item_name VARCHAR(255) NOT NULL,                      -- Redundant but useful for record-keeping
  quantity INT NOT NULL,
  price_per_item DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price_per_item) STORED,
  
  customer_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,

  order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (item_id) REFERENCES items(item_id)
);

select * from orders;

truncate orders;