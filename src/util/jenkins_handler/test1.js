var jenk = require('./jenkins.js');
var je = new jenk();
var fs = require('fs');

var test = function(){
  je.captureJenkinsDataForAllProjects().then(function (jd) {
    fs.writeFileSync('data.json', JSON.stringify(jd, null, 4), function(err) {
      if (err) throw err;
    });
  })
}

test()
