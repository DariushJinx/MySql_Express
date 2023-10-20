let tableNameUser = `users`;

let queryUsers = `CREATE TABLE IF NOT EXISTS ${tableNameUser}(
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone BIGINT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    store_address TEXT(1000),
    user_type VARCHAR(100) NOT NULL
)`;

let tableNameStore = `store`;

let queryStore = `CREATE TABLE IF NOT EXISTS ${tableNameStore}(
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT(1000) NOT NULL,
    phone BIGINT NOT NULL,
    Registration_code VARCHAR(100) NOT NULL UNIQUE,
    userID INT(100) NOT NULL,
    INDEX idx_users (userID),
    CONSTRAINT fk_users_store
    FOREIGN KEY (userID) REFERENCES users(id)
)`;

let tableNameProduct = `products`;
let queryProducts = `CREATE TABLE IF NOT EXISTS ${tableNameProduct}(
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT(255) NOT NULL,
    number_of_inventory INT(255) NOT NULL,
    description TEXT(1000) NOT NULL,
    storeID INT(100) NOT NULL,
    INDEX idx_store (storeID),
    CONSTRAINT fk_store_products
    FOREIGN KEY (storeID) REFERENCES store(id)
)`;

const query = {
  queryProducts,
  queryStore,
  queryUsers,
};

module.exports = query;
