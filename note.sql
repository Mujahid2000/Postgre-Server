CREATE DATABASE e_commerce;

CREATE TABLE product_Data (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(255),
  color VARCHAR(255),
  shopName VARCHAR(255),
  shopPicture VARCHAR(255),
  description VARCHAR(255),
  stock VARCHAR(20),
  product_image VARCHAR(255),
  productName VARCHAR(255),
  price numeric (10,2),
  rating numeric(1,1)
);



ALTER TABLE product_Data
ADD rating numeric(1,1);

ALTER TABLE product_Data
DROP COLUMN rating;

INSERT INTO product_Data (id, category, color, shopName, shopPicture, description, stock, product_image, productName, price, rating)
VALUES ('Fowevwevv34SDrd', 'Men's FashionMen's Fashion', '#3498db', 'Tech Solutions', 'https://i.ibb.co/cgFd8FP/h1.jpg', 4.5);


SELECT id, category, color, shopName, shopPicture, description, stock, product_image, productName, price, rating, year FROM product_Data;

SELECT * FROM customers
WHERE id = idValue;


DELETE FROM product_Data
WHERE id = idValue;


UPDATE product_Data
SET stock = 'Stock Out'
WHERE id = id;

 CREATE TABLE user_data(
 id VARCHAR(255) PRIMARY KEY,
 name VARCHAR(255),
 email VARCHAR(255),
 password VARCHAR(255)
 admin BOOLEAN)

SELECT p.id, p.productname, p.price, p.category, p.product_image  FROM product_data p INNER JOIN cart_data c ON p.idP = c.productId WHERE email ='mujahid2@gmail.com'


CREATE TABLE order_Data (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(255),
  color VARCHAR(255),
  shopName VARCHAR(255),
  product_image VARCHAR(255),
  productName VARCHAR(255),
  price numeric(10,2),
  total_price numeric(10,2),
  email VARCHAR(255),
  user_id integer,
  FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);