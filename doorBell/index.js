var Gpio = require('onoff').Gpio,
  buzzer = new Gpio(16, 'out'),
  button = new Gpio(18, 'in', 'both');
 
button.watch(function(err, value) {
  if (err) exit();
  buzzer.writeSync(value);
  console.log("Button pushed, value = " + value);
});
 
function exit() {
  buzzer.unexport();
  button.unexport();
  process.exit();
}
 
process.on('SIGINT', exit);
