var five = require("johnny-five");
var board = new five.Board();

board.on('ready', function(){
	console.log('connected');

	var servo = new five.Servo({
		pin: 12,
		center: true
	});

	servo.sweep();
	// // Set the horn to 90degrees
	// servo.to(90);

	// // Angle change takes 500ms to complete
	// servo.to(90, 500);

	// // Angle change takes 500ms to complete over 10 steps
	// servo.to(90, 500, 10);	
})
