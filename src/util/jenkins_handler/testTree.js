var data = require('./fillDataToTree.js');
var fillData = new data().makeJenkinsRdcResults();
console.log(JSON.stringify(fillData,null,4));

