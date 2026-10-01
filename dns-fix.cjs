const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("Using DNS servers:", dns.getServers()); 


// $env:NODE_OPTIONS="--require=$PWD\dns-fix.cjs"