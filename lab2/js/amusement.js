// 1.3 rides
var amusementRides = [{
  id: 1,
  name: "The Great White Wail",
  // price, in USD
  price: 5.25,
  // which days it's open
  openDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  // limited access for children
  childrenAllowed: false
}, {
  id: 2,
  name: "Tilt-a-Hurl",
  // price, in USD
  price: 3.75,
  // which days it's open
  openDays: [
    "Sunday",
    "Friday",
    "Saturday"
  ],
  // limited access for children
  childrenAllowed: true
}, {
  id: 3,
  name: "Fairy-Go-Round",
  // price, in USD
  price: 2.50,
  // which days it's open
  openDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  // limited access for children
  childrenAllowed: true
}];

// 1.4 logging
console.log("Name of first ride:", amusementRides[0].name);
console.log("All open days of 2nd ride:", amusementRides[1].openDays.join(", "));
console.log("1st open day of 2nd ride:", amusementRides[1].openDays[0]);
console.log("Reduced price of 3rd ride:", amusementRides[2].price / 2);

// 2.1 doublePrices
/**
 * Double the prices of each ride, except the 2nd, in place, and returns the modified array.
 */
function doublePrices(amusementRides) {
    for (var i = 0; i < amusementRides.length; i++) {
        if (i != 1) {
            amusementRides[i].price *= 2;
        }
    }

    return amusementRides;
}

var amusementRidesDouble = doublePrices(amusementRides);
console.log(amusementRidesDouble);
