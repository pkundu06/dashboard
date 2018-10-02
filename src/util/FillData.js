"use strict";
var config = require('./config.json');
function FillData(){

}

FillData.prototype._fillDefaultData = function(jenkDataArray) {
    let buildInfoAry = [];
    jenkDataArray.projects.forEach(function(project) {
        project.jobs.forEach(function(job, ind) {
            let buildInfo = {};
            buildInfo.name = job.name;
            let topJob = job.builds[0];
            buildInfo.pass = topJob.pass;
            buildInfo.fail = topJob.fail;
            buildInfo.skip = topJob.skip;
            buildInfoAry.push(buildInfo);
        });
    });

    return buildInfoAry;
};
FillData.prototype._fillDataForProject = function(jenkDataArray, projectClicked) {
    let buildInfoAry = [];
    jenkDataArray.projects.forEach(function(project) {
        projectClicked.forEach(function(proj) {
            if(project.name === proj.name){
                project.jobs.forEach(function(job, ind) {
                    let buildInfo = {};
                    buildInfo.name = job.name;
                    let topJob = job.builds[0];
                    buildInfo.pass = topJob.pass;
                    buildInfo.fail = topJob.fail;
                    buildInfo.skip = topJob.skip;
                    buildInfoAry.push(buildInfo);
                });
            }
        });
    });

    return buildInfoAry;
};
FillData.prototype._getTrendData = function(jobs, name){
    let buildInfoAry = [];
    jobs.builds.forEach(function(job, index, arry) {
        let jobNumber = job.number;
            job.packages.forEach(function(pkg) {
                pkg.tests.forEach(function(tests) {
                    tests['test-method'].forEach(function(test) {
                        if (test.name === name) {
                            let buildInfo = {};
                            buildInfo.jobNumber = jobNumber;
                            buildInfo.name = test.name;
                            buildInfo.pass = 0;
                            buildInfo.fail = 0;
                            buildInfo.skip = 0;
                            if (test.status.toUpperCase() === 'PASS') {
                                buildInfo.pass = 1;
                            }
                            else if (test.status.toUpperCase() === 'FAIL') {
                                buildInfo.fail = 1;
                            } else {
                                buildInfo.skip = 1;
                            }
                            buildInfoAry.push(buildInfo);
                        }
                    });
                });
            });


    });
    return buildInfoAry;
};

FillData.prototype._fillData = function(currentPointer, jenkData) {
    let self = this;
    let buildInfo = {};
    buildInfo.trendData = {};
    buildInfo.buildTrends = {};
    let buildTrendsArry = [];
    buildInfo.buildTrends = buildTrendsArry;
    jenkData.projects.forEach(function(project) {
        project.jobs.forEach(function(job, ind, arry) {
            if (currentPointer.name === job.name) {
                job.builds.forEach(function(build) {
                    let trends = {};
                    trends.pass = build.pass;
                    trends.fail = build.fail;
                    trends.skip = build.skip;
                    trends.duration = build.duration;
                    trends.number = build.number;
                    buildTrendsArry.push(trends);
                });
                let topJob = job.builds[0];
                buildInfo.name = job.name;
                buildInfo.pass = topJob.pass;
                buildInfo.fail = topJob.fail;
                buildInfo.skip = topJob.skip;
            } else if (job.builds.length > 0) {
                let total;
                let topJob = job.builds[0];
                topJob.packages.forEach(function(pkg){
                    if (pkg.name === currentPointer.name) {
                        total = pkg.totalCount;
                        buildInfo.name = pkg.name;
                        buildInfo.fail = pkg.fail;
                        buildInfo.pass = (total - pkg.fail);
                        buildInfo.skip = pkg.skip;
                    } else {
                        pkg.classs.classs.forEach(function(cls) {
                            if (cls.name === currentPointer.name) {
                                total = cls.totalCount;
                                buildInfo.name = cls.name;
                                buildInfo.fail = cls.fail;
                                buildInfo.pass = (total - cls.fail);
                                buildInfo.skip = cls.skip;
                            }
                        });
                        pkg.tests.forEach(function(testData) {
                            testData['test-method'].forEach(function(tests) {
                                let testTrend = {};
                                if(tests.name === currentPointer.name){
                                    buildInfo.trendData = self._getTrendData(job, currentPointer.name);
                                    buildInfo.name = tests.name;
                                    buildInfo.pass = 0;
                                    buildInfo.fail = 0;
                                    buildInfo.skip = 0;
                                    if(tests.status.toUpperCase() === 'PASS'){
                                        buildInfo.pass = 1;
                                    }
                                    else if(tests.status.toUpperCase() === 'FAIL'){
                                        buildInfo.fail = 1;
                                    }else{
                                        buildInfo.skip = 1;
                                    }
                                }
                            });
                        });

                    }
                });

            }
        });
    });
    return buildInfo;
};
module.exports = FillData;
