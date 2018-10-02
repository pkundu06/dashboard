"use strict";
var config = require('../config.json');
var util = require('util');

class JenkinsConfigUtil {
  static initJenkinsUrl(project) {

    var jenkinsConfigUrl = project.url;
    var jenkinsConfigUser = config.jenkinsConfig.user;
    var jenkinsConfigPass = config.jenkinsConfig.pass;
    var jenkinsConfigApiToken = config.jenkinsConfig.api_token;

    // If project level jenkins credentials are provided we override default configuration
    if(project.user !== null){jenkinsConfigUser = project.user;}
    if(project.pass !== null){jenkinsConfigPass = project.user;}
    if(project.api_token !== null){jenkinsConfigApiToken = project.api_token;}

    var baseJenkinsUrl = 'https://%s' + jenkinsConfigUrl;
    var jenkinsUrl = '';

    if(jenkinsConfigApiToken !== undefined && jenkinsConfigUser !== undefined){
      jenkinsUrl = util.format(baseJenkinsUrl, jenkinsConfigUser + ':' + jenkinsConfigApiToken + '@');
    } else if(jenkinsConfigUser !== undefined && jenkinsConfigPass !== undefined){
      jenkinsUrl = util.format(baseJenkinsUrl, jenkinsConfigUser + ':' + jenkinsConfigPass + '@');
    } else {
      jenkinsUrl = util.format(baseJenkinsUrl, '');
    }
      return jenkinsUrl;
  }
}

module.exports = JenkinsConfigUtil;
