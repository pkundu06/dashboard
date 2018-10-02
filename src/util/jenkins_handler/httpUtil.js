"use strict";
const axios = require('axios');
var https = require("https");

function HttpUtils() {

}

HttpUtils.prototype.doHttpGetJenkins = function(url, appended_params) {

    var final_url;
    if (appended_params === null || appended_params === undefined) {
        final_url = url + '/api/json?pretty=true';
    } else {
        final_url = url + appended_params;
    }

     console.log("final url:", final_url);
    var agent = new https.Agent({
        rejectUnauthorized: false
    });

    return axios.get(final_url, { httpsAgent: agent })
        .then(response => response.data)
        .catch(error => error.response.status);
};
module.exports = HttpUtils;
