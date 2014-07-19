var five = require("johnny-five"),
  board = new five.Board(),
  device = process.argv[2] || "2Y0A02";

board.on("ready", function() {
  var distance = new five.IR.Distance({
    device: device,
    pin: "A0",
    freq: 500
  });

  distance.on("data", function() {
    if (device) {
      console.log("inches: ", this.inches);
      console.log("cm: ", this.cm, this.raw);
    } else {
      console.log("value: ", this.value);
    }
  });
});