var orders = [];

// Generate data

var products = [
	{"product":"coffee", "price":"3.40"},
	{"product":"tea", "price":"2.20"}
];

newOrder();
setTimeout(processOrder, 3000);

function newOrder() {
	for(var i = 0; i < randomNumber(1,3); i++) {
		if(orders.length < 10) {
			var product = products[Math.floor(Math.random() * products.length)];
			orders.push(product);
		}
	}
	updateVisualization(orders);
  setTimeout(newOrder, randomNumber(1000,4000));
}

function processOrder() {
	for(var i = 0; i < randomNumber(1,3); i++)
		orders.shift();
	updateVisualization(orders);
	setTimeout(processOrder, randomNumber(1000,5000));
}

function randomNumber(start,end) {
	return Math.floor(Math.random() * end) + start;
}
