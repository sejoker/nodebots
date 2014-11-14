var five = require("johnny-five"),
  keypress = require("keypress"),
  board = new five.Board({
    //port: '/dev/rfcomm1'
    port: '/dev/ttyATH0'
  });


board.on("ready", function() {
  var speed, commands, motors, speedB;

  speed = 100;
  speedB = speed * 0.96;
  commands = null;
  motors = {
    a: new five.Motor([3, 12]),
    b: new five.Motor([11, 13])
  };

  this.repl.inject({
    motors: motors
  });

  function controller(ch, key) {
    if (key) {
      if (key.name === "space") {
        motors.a.stop();
        motors.b.stop();
      }
      if (key.name === "up") {
        motors.a.rev(speed);
        motors.b.fwd(speedB);
      }
      if (key.name === "down") {
        motors.a.fwd(speed);
        motors.b.rev(speedB);
      }
      if (key.name === "right") {
        motors.a.fwd(speed);
        motors.b.fwd(speedB);
      }
      if (key.name === "left") {
        motors.a.rev(speed);
        motors.b.rev(speedB);
      }

      commands = [].slice.call(arguments);
    } else {
      if (ch >= 1 && ch <= 9) {
        speed = five.Fn.scale(ch, 1, 9, 0, 255);
        speedB = speed * 0.8;
        controller.apply(null, commands);
      }
    }
  }


  keypress(process.stdin);

  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});