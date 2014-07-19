var five = require("johnny-five");
var board, led;

board = new five.Board({
  port: '/dev/rfcomm1'
});

board.on("ready", function() {

  led = new five.Led(13);

  //led.blink();
  led.strobe( 3000 );

  // this.repl.inject({
  //     led: led
  // });
});