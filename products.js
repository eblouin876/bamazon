class Product {
  constructor(name, department, cost, quantity) {
    this.name = name;
    this.department = department;
    this.cost = cost;
    this.quantity = quantity;
  }
  str() {
    return `("${this.name}", "${this.department}", ${this.cost}, ${
      this.quantity
    })`;
  }
}

let products = [
  new Product("Bananas", "Produce", 0.89, 125),
  new Product("Pears", "Produce", 2.89, 60),
  new Product("Oranges", "Produce", 1.75, 20),
  new Product("Apples", "Produce", 1.99, 130),
  new Product("Cherios", "Cereal", 2.99, 40),
  new Product("Rice Crispies", "Cereal", 2.99, 35),
  new Product("Cocoa Puffs", "Cereal", 3.49, 15),
  new Product("Frosted Mini Wheats", "Cereal", 3.49, 25),
  new Product("Coffee", "Beverages", 12.99, 24),
  new Product("Earl Gray Tea", "Beverages", 7.99, 45)
];

let productString = "";

products.forEach(product => {
  productString += `${product.str()},`;
});

module.exports = productString.slice(0, -1);
