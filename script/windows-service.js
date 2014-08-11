var Service = require('node-windows').Service;

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

svc.install();
