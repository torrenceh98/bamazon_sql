var mysql = require('mysql')
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
 
    password: "password",
    database: "bamazon" });

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected\n")
    buyProduct();
  });

connection.query('SELECT item_id, product_name, price FROM products', function (error, results ) {
      if (error) throw error;
  var productsArray = []
  for (var i = 0; i < results.length; i++){
      productsArray.push(results[i].product_name + " ---> $" + results[i].price + '\n' );  
                                          }
  console.log(productsArray + '\n\n')

});

function buyProduct(){
  connection.query('SELECT item_id, product_name, price FROM products', function (error, results ) {
    if (error) throw error;

  inquirer
      .prompt({
          name: 'buy',
          type: 'list',
          message: 'What product do you want to buy?',
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
                                                      }
            return choiceArray
                              }
        })      
.then(function(answer){
  confirmProduct(answer.buy)

                        })
  
});
}

function confirmProduct(product){
    inquirer
     .prompt({
        name: 'confirm',
        type: 'input',
        message: 'How many would you like to purchase?',
 }) 
 .then(function(quanity){
   
  connection.query("UPDATE products SET stock_quality = stock_quality -"+ (quanity.confirm) + " WHERE product_name =" + " '" + (product) + "'" , function(err, results){
  console.log('Successful! You purchased '+ quanity.confirm + " " + product + 's')

  if(quanity === 0){
    console.log('Sorry we are sold out')};

  buyProduct();

  })
  })
}
