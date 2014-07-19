'use strict';
var five = require('johnny-five'),
    temporal = require('temporal'),
    board;

board = new five.Board({
  //port: '/dev/rfcomm1'
});


board.on('ready', function() {
  var servo = new five.Servo({
    pin: 10,
  });

 
  var speed, speedB, motors;

  speed = 200;
  speedB = speed * 0.96;
  motors = {
    a: new five.Motor([3, 12]),
    b: new five.Motor([11, 13])
  };

  var ping = new five.Ping(7);

  var dist_f = 0;
  var dist_l = 0;
  var dist_r = 0;
  var dist_45 = 0;
  var dist_135 = 0;
  var t = 40;

  this.repl.inject({
    motors: motors
  });

  function wait(){
    motors.a.stop();
    motors.b.stop();
  }

  function forward(){
    motors.a.rev(speed);
    motors.b.fwd(speedB);
  }

  function back(){
    motors.a.fwd(speed);
    motors.b.rev(speedB);
  }

  function right(){
    motors.a.stop();
    motors.b.stop();
    motors.a.fwd(speed);
    motors.b.fwd(speedB);
  }

  function left(){
    motors.a.stop();
    motors.b.stop();
    motors.a.rev(speed);
    motors.b.rev(speedB); 
  }

  function motion (key, prev_angle, next_angle, time, callback)
 {
   var a = Math.abs( next_angle - prev_angle) / 15;
   //console.log('key: ' + key + ' time: ' + time * a + ' prev: ' + prev_angle + ' next angle: ' + next_angle);
    switch(key){
      case 'w': {
        wait();    
      }
      break;
      case 'f': {
        forward();
      }
      break;
      case 'b': {
       back();
      }
      break;
      case 'r': {
        right();  
      }
      break;
      case 'l': {
        left();
      }
      break;
    }

    servo.to(next_angle, time * a);
    //servo.to(next_angle);
    temporal.delay(time * a, function(){
      ping.once('data', function() {
         //console.log('Distance: ' + this.cm + ' cm');
         callback(this.cm);
      });
    });
 }

 function front_motion(time, callback){
  //console.log('front_motion, dist_45: ' + dist_45 + ' dist_135: ' + dist_135 + ' time: ' + time);
  if(dist_45 <= 10){
   left();
   temporal.delay(3 * time, function(){
    callback();
   });
  } else if(dist_135 <= 10){
    right();
    temporal.delay(3 * time, function(){
      callback();
    });
  } else {
      callback();
  }
}

function motion_back(time, callback)
{
  motion('b',180,90, time, function(distance){
    callback(distance);
  });
}


function loop() {  
   if(dist_f>=25)
   {    
    motion('f',180,135,t, function(distance){
      dist_135 = distance;
      front_motion(t, function(){        
            motion('f',135,90,t, function(distance2){
              dist_f = distance2;
              front_motion(t, function(){
                    motion('f',90,45,t, function(distance3){
                        dist_45 = distance3;
                            front_motion(t, function(){
                              motion('f',45,0,t, function(distance4){
                                dist_r = distance4;
                                front_motion(t, function(){
                                  motion('f',0,45,t, function(distance5){
                                    dist_45 = distance5;
                                    front_motion(t, function(){
                                      motion('f',45,90,t, function(distance6){
                                        dist_f = distance6;
                                        front_motion(t, function(){
                                          motion('f',90,135,t, function(distance7){
                                            dist_135 = distance7;
                                            front_motion(t, function(){
                                              motion('f',135,180,t, function(distance8){
                                                dist_l = distance8;
                                                front_motion(t, function(){
                                                  loop();
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });                            
                          });
                      });    
                  });
              });
          });
      });
    
  }    
   else {
     if(dist_f < 10) {
        motion_back( t * 3, function(distance9){
          dist_f = distance9;
          loop();
        });
     } else if( dist_l >= dist_r || dist_135 > dist_r) {
        motion('l',180,90, t , function(distance10){
          dist_f = distance10;
          loop();
        });
     } else if ( dist_l < dist_r ) {
        motion('r',180,90, t , function(distance11){
          dist_f = distance11;
          loop();
        });
     }
    } 
   
 }

  servo.to(0, t * 2);
  servo.to(0);
  temporal.delay(t * 2, function(){

    var clb = function() {
        if (this.cm === 0) {
          return;
        }

        ping.removeListener('data', clb);

        //console.log('Distance: ' + this.cm + ' cm');
        dist_r = this.cm;
        motion('w',0,45,t, function(distance){
           dist_45 = distance;
           motion('w',45,90,t, function(distance2){
            dist_f = distance2;
              motion('w',90,135,t, function(distance3){
                dist_135 = distance3;
                motion('w',135,180,t, function(distance4){
                  dist_l = distance4;
                  loop();
                });
              });
           });
        });
      };

    ping.on('data', clb);
  });
  

});