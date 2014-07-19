var five = require("johnny-five"),
board = new five.Board();

board.on("ready", function() {
  var ping = new five.Ping(7);
  ping.on("data", function( err, value ) {
    console.log("Distance: " + this.cm + " cm");
  });
});