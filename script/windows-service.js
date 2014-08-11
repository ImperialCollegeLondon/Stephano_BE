var Service = require('node-windows').Service;
var EventLogger = require('node-windows').EventLogger;
var log = new EventLogger('Stephano');
// Create a new service object
var svc = new Service({
  name:'Stephano',
  description: 'Stephano backend Web Server',
  script: 'C:\\inetpub\\Stephano_BE\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.on('error', function(err){
	log.error(err);
});

svc.install();
