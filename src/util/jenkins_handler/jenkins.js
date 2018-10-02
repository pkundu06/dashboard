"use strict";
var Http_utils = require('./httpUtil.js');
var Promise = require("bluebird");
var config = require('../config.json');
var JenkinsConfigUtil = require("./jenkinsConfigUtil");
var http_utl = new Http_utils();
var fs = require('fs');
let async = require('async');
var JenkData = {};
var projects = [];
var appendForUniq = 0;
function Jenkins() {
    this.init();
}
Jenkins.prototype.init = function() {
    projects = config.jenkinsConfig.projects;
};
Jenkins.prototype.getBaseUrl = function(projectConfig) { // **********************
    return JenkinsConfigUtil.initJenkinsUrl(projectConfig) + '/job/';
};
Jenkins.prototype.getJenkinsJobInfo = function(project, job_name) {
    return http_utl.doHttpGetJenkins(this.getBaseUrl(project) + job_name);
};
Jenkins.prototype.getTestReport = function(projectConfig, job_name, build_number, pkg, classs, test) {
    var self = this;
    var jobUrl = this.getBaseUrl(projectConfig) + job_name;

    var reportType;

    if(projectConfig.test_framework.toLowerCase() === 'testng'){
        reportType = 'testngreports';
    } else if (projectConfig.test_framework.toLowerCase() === 'junit'){
        reportType = 'testReport';
    } else{
        console.log("Unexpected project test_framework config value", projectConfig.test_framework);
    }
    if (pkg !== undefined && test === undefined && classs === undefined) {
        return http_utl.doHttpGetJenkins(jobUrl + '/' + build_number + '/' + reportType + '/' + pkg);
    }
    else if (test === undefined && pkg !== undefined && classs !== undefined) {
        return http_utl.doHttpGetJenkins(jobUrl + '/' + build_number + '/' + reportType + '/' + pkg + '/' + classs);
    }
    else if (test !== undefined && pkg !== undefined && classs !== undefined) {
        return http_utl.doHttpGetJenkins(jobUrl + '/' + build_number + '/' + reportType + '/' + pkg + '/' + classs + '/' + test);
    }
    return http_utl.doHttpGetJenkins(jobUrl + '/' + build_number + '/' + reportType);
};
Jenkins.prototype.getJobData = function(projectConfig,job_name, build_number) {
    var self = this;
    var jobUrl = this.getBaseUrl(projectConfig) + job_name;

    return http_utl.doHttpGetJenkins(jobUrl + '/' + build_number);
};
Jenkins.prototype.captureJenkinsDataForAllProjects = function(){
    var self = this;
    return new Promise((resolve, reject) => {
        var JenkDataResult = {projects: []};
        var projectPromises = [];
        projects.forEach((projectConfig, projectIndex, array) => {
            var currentProject
                = JenkDataResult.projects[projectIndex]
                = {name: projectConfig.name, jobs: []};

            projectConfig.job_names.forEach(function(jobName) {
                projectPromises.push(self.getJobInfo(projectConfig, currentProject, jobName));
            });
        });
        Promise.all(projectPromises).then(function(){
            JenkDataResult = self.stripBlankResultProjects(JenkDataResult);
            resolve(JenkDataResult);
        });
    });
};

Jenkins.prototype.captureJenkinsDataForAJob = function(job){
    var self = this;
    return new Promise((resolve, reject) => {
        var JenkDataResult = {projects: []};
        var projectPromises = [];
        projects.forEach((projectConfig, projectIndex, array) => {
            var currentProject
                = JenkDataResult.projects[projectIndex]
                = {name: projectConfig.name, jobs: []};

            projectConfig.job_names.forEach(function(jobName) {
                if(job === jobName){
                    projectPromises.push(self.getJobInfo(projectConfig, currentProject, jobName));
                }
            });
        });
        Promise.all(projectPromises).then(function(){
            JenkDataResult = self.stripBlankResultProjects(JenkDataResult);
            resolve(JenkDataResult);
        });
    });
};

Jenkins.prototype.stripBlankResultProjects = function(json_result) {
    return new Promise((resolve, reject) => {
        // console.log("length of projects:",json_result.projects.length)
        json_result.projects.forEach((project, projectIndex) => {
            var job_has_valid_builds = false;
            project.jobs.forEach((job, jobIndex) =>{
                if(job.builds.length !== 0){
                    job_has_valid_builds = true;
                }else{
                    // If a job has no builds we remove it from results
                    project.jobs.splice(jobIndex, 1);
                }
            });
            if(job_has_valid_builds === false){
                // If a project has no builds for any of it's jobs we remove the job
                json_result.projects.splice(projectIndex, 1);
            }
        });
        resolve(json_result);
    });
};
Jenkins.prototype.validateBuilds = function(projectConfig, job, builds){
    var self = this;
    let validBuilds = [];
    return new Promise((resolve, reject) => {
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        var validBuildPromises = [];
        builds.forEach(function(build) {
            validBuildPromises.push(self.getTestReport(projectConfig, job, build.number).then(function(buildData) {
                if(buildData !== 404 && buildData !== 500 && buildData !== undefined){
                    validBuilds.push(build);
                }}
            ));
        });
        Promise.all(validBuildPromises).then(function(){
            // console.log("valid builds:",validBuilds)
            validBuilds.sort(function(a, b) {
                return a.number - b.number;
            });
            resolve(validBuilds.reverse());
        });
    });
};
Jenkins.prototype.getJobInfo = function(projectConfig, currentProject, jobName){
    var self = this;
    return new Promise((resolve, reject) => {
        self.getJenkinsJobInfo(projectConfig, jobName).then(function(jobData) {
            var jobDataJson = jobData;
            self.validateBuilds(projectConfig, jobName, jobDataJson.builds).then(function(builds) {
                // if the number of requested builds is less than whats available then trim processed builds
                if(builds.length > config.jenkinsConfig.num_builds_to_pull){
                    builds = builds.slice(0, config.jenkinsConfig.num_builds_to_pull);
                }
                var currentJobData = {name: jobName, builds: builds};
                currentProject.jobs.push(currentJobData);
                // console.log("Number of Builds to process:", currentJobData.builds)
                var jobPromises = [];
                currentJobData.builds.forEach(function(build){
                    if(projectConfig.test_framework.toLowerCase() === 'testng'){
                        jobPromises.push(self.getPackageDetails(projectConfig, currentJobData, build));
                    } else {
                        jobPromises.push(self.getJUnitTestDetails(projectConfig, currentJobData, build));
                    }
                });
                Promise.all(jobPromises).then(function(){
                    resolve();
                });
            });
        }).catch(error => error.response);
    });
};
Jenkins.prototype.getPackageDetails = function(projectConfig, job, build){
    var self = this;
    return new Promise((resolve, reject) => {
        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        self.getJobData(projectConfig,job.name, build.number).then((data)=>{
            let timestamp = data.timestamp;
            self.getTestReport(projectConfig, job.name, build.number).then(function(packageData) {
                var pkgJson = packageData;
                build.timestamp= timestamp;
                build.duration = pkgJson.duration;
                build.fail = pkgJson.failCount;
                build.total = pkgJson.total;
                build.skip = pkgJson.skipCount;
                build.pass = pkgJson.total - (pkgJson.failCount + pkgJson.skipCount);
                build.packages = [];
                var packagePromises = [];
                pkgJson.package.forEach(function(pkg){
                    packagePromises.push(self.getClassDetails(projectConfig, job, build, pkg, build.packages));
                });
                Promise.all(packagePromises).then(function(){
                    resolve();
                });
            });
        })

    });
};
Jenkins.prototype.getClassDetails = function(projectConfig, job, build, pkg, packages){
    var self = this;
    return new Promise((resolve, reject) => {
        self.getTestReport(projectConfig, job.name, build.number, pkg.name).then(function(cls) {
            var clsJson = cls;
            // try {
            //     clsJson = JSON.parse(cls);
            // } catch (e) {
            //     resolve(true);  // Sometimes there is no valid json returned in this case we can't do anything
            //     console.log("Error trying to get class info:", e);
            // }
            var currentPackage = {
                testActions: [],
                name: clsJson.name,
                fail: clsJson.fail,
                skip: clsJson.skip,
                totalCount: clsJson.totalCount,
                classs: clsJson,
                tests: []};
            var currentClassTests = currentPackage.tests;
            packages.push(currentPackage);
            var testPromises = [];
            clsJson.classs.forEach((classs, ind, classarray) => {
                testPromises.push(self.getTestDetails(projectConfig, job, build, pkg, classs, currentClassTests));
            });
            Promise.all(testPromises).then(function(){
                resolve();
            });
        });
    });
};
Jenkins.prototype.getTestDetails = function(projectConfig, job, build, pkg, classs, tests){
    var self = this;
    return new Promise((resolve, reject) => {
        self.getTestReport(projectConfig, job.name, build.number, pkg.name, classs.name).then(function(testData) {
            var testJson = testData;
            // try {
            //     testJson = JSON.parse(testData);
            // } catch (e) {
            //     resolve();  // Sometimes there is no valid json returned in this case we can't do anything
            //     console.log("Error trying to get test info:", e);
            // }
            testJson['test-method'].forEach(function(test, ind, arry) {
                test.name = test.name + ind;
            });
            tests.push(testJson);
            resolve();
        });
    });
};

// JUNIT Related
Jenkins.prototype.getJUnitTestDetails = function(projectConfig, job, build){
    var self = this;
    return new Promise((resolve, reject) => {
        self.getTestReport(projectConfig, job.name, build.number).then(function(buildData) {

            build.duration = buildData.duration;
            build.fail = buildData.failCount;
            build.total = buildData.failCount + buildData.passCount;
            build.pass = buildData.passCount;
            build.skip = buildData.skipCount;

            if(buildData.suites !== undefined){
                build.packages = [];
            }

            var counts = {
                total_duration: 0,
                total_fail_count: 0,
                total_skip_count: 0,
                total_test_count: 0
            };

            var currentPackageName = null;
            var tempPackage = null;

            buildData.suites.forEach(function(suite){

                suite.cases.forEach(function(testResult){

                    if(currentPackageName === null){ // If new package then

                        currentPackageName = testResult.className;
                        tempPackage = self.buildNewTestPackage(testResult);
                        self.incrementCounts(testResult, counts);

                    } else if(currentPackageName !== null) { // Same package as previous test so we append

                        if(testResult.className === tempPackage.name){ // Already added append data to existing package data

                            tempPackage.tests[0]['test-method'].push({
                                name: testResult.name,
                                status: self.determineStatus(testResult.status)
                            });

                            self.incrementCounts(testResult, counts);
                            tempPackage.tests[0].fail = counts.total_fail_count;
                            tempPackage.tests[0].skip = counts.total_skip_count;
                            tempPackage.tests[0].totalCount = counts.total_test_count;

                        } else {  // Package name has changed. push tempPackage and then start building a new one.

                            self.addNewPackage(tempPackage, counts, build);

                            tempPackage = self.buildNewTestPackage(testResult);
                            currentPackageName = testResult.className;

                            self.clearCounts(counts);
                            self.incrementCounts(testResult, counts);
                        }
                    }
                });

                // Here we must check if we have a tempPackage if we do we need to push it
                if(tempPackage !== null){
                    self.addNewPackage(tempPackage, counts, build);
                }

                currentPackageName = null;
                tempPackage = null;
                self.clearCounts(counts);

            });

            // data not added

            resolve();
        });
    });
};

// JUNIT Related
Jenkins.prototype.buildNewTestPackage = function(testResult){
    var self = this;
    var tempPackage = {
        testActions: [],
        name: testResult.className,
        fail: 0,
        skip: 0,
        totalCount: 0,
        classs: {
            testActions: [],
            name: testResult.className,
            classs: [{
                name: testResult.className.split(".").pop(),
                fail: 0,
                skip: 0,
                totalCount: 0
            }],
            duration: '',
            fail: 0,
            skip: 0,
            totalCount: 0},
        tests: [{
            name: testResult.className.split(".").pop(),
            duration: 0,
            fail: 0,
            skip: 0,
            'test-method': [{
                name: testResult.name,
                status: self.determineStatus(testResult.status)
            }]
        }]
    };
    return tempPackage;
};
// JUNIT Related
Jenkins.prototype.incrementCounts = function(testResult, counts){
    var self = this;
    var status;
    counts.total_duration += testResult.duration;

    status = self.determineStatus(testResult.status);
    if(testResult.skipped === true){
        counts.total_skip_count += 1;
    }
    if(status !== "PASS" && status !== "SKIP"){
        counts.total_fail_count += 1;
    }

    counts.total_test_count += 1;
};
// JUNIT Related
Jenkins.prototype.clearCounts = function(counts){
    counts.total_duration = 0;
    counts.total_fail_count = 0;
    counts.total_skip_count = 0;
    counts.total_test_count = 0;
};
// JUNIT Related
Jenkins.prototype.determineStatus = function(status){
    var final_status;
    switch(status) {
        case "FAILED":
            final_status = "FAIL";
            break;
        case "REGRESSION":
            final_status = "FAIL";
            break;
        case "SKIPPED":
            final_status = "SKIP";
            break;
        case "PASSED":
            final_status = "PASS";
            break;
        case "FIXED":
            final_status = "PASS";
            break;
        default:
            final_status = "UNKNOWN";
    }
    return final_status;
};
// JUNIT Related
Jenkins.prototype.addNewPackage = function(tempPackage, counts, build){

    tempPackage.fail = counts.total_fail_count;
    tempPackage.skip = counts.total_skip_count;
    tempPackage.totalCount = counts.total_test_count;

    tempPackage.classs.classs[0].fail = counts.total_fail_count;
    tempPackage.classs.classs[0].skip = counts.total_skip_count;
    tempPackage.classs.classs[0].totalCount = counts.total_test_count;

    tempPackage.classs.duration = parseFloat(counts.total_duration.toFixed(3));
    tempPackage.classs.fail = counts.total_fail_count;
    tempPackage.classs.skip = counts.total_skip_count;
    tempPackage.classs.totalCount = counts.total_test_count;
    tempPackage.tests[0].duration = parseFloat(counts.total_duration.toFixed(3));

    build.packages.push(tempPackage);
};


module.exports = Jenkins;
