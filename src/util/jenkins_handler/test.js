var jenk = require('./jenkins.js');
var je = new jenk();
var fs = require('fs');

// onmessage = (e)=>{
  je.captureJenkinsDataForAllProjects().then(function (jd) {
      postMessage({dt:{data:jd}})
    // fs.writeFileSync('data.json', JSON.stringify(jd, null, 4), function(err) {
    //   if (err) throw err;
    // });
  })
}
//
// // var testajob = function(jobname){
// //     je.captureJenkinsDataForAJob(jobname).then(function (jd) {
// //         postMessage(jd)
// //      // console.log("data------",jd);
// //      //    fs.writeFileSync('data.json', JSON.stringify(jd, null, 4), function(err) {
// //      //        if (err) throw err;
// //      //    });
// //     })
// // }

onmessage = function(e) {
    console.log('Message received from main script');
    var workerResult = 'Result: ' + ("hello pradeep");
    console.log('Posting message back to main script');
    postMessage(workerResult);
}
module.exports = worker;


