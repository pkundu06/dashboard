'use strict';
var treeData = {
    "name": "DashBoard",
    "toggled": false,
    "children": []
};

function FillDataToTree() {

}

FillDataToTree.prototype.makeJenkinsRdcResults = function(dataFromJenkins, reset) {
    if(reset){
        treeData = {
            "name": "DashBoard",
            "toggled": false,
            "children": []
        };
    }
    let rdcTestResults = treeData.children;
    dataFromJenkins.projects.forEach(function(project) {
        let projectRoot = {'name': project.name};
        rdcTestResults.push(projectRoot);
        rdcTestResults[rdcTestResults.indexOf(projectRoot)].children = [];
        let childrenOfRoot = rdcTestResults[rdcTestResults.indexOf(projectRoot)].children;
        project.jobs.forEach(function(jenk_job) {
            let jenkJobParent = {'name': jenk_job.name};
            childrenOfRoot.push(jenkJobParent);
            childrenOfRoot[childrenOfRoot.indexOf(jenkJobParent)].children = [];
            let childrenOfJenkJob = childrenOfRoot[childrenOfRoot.indexOf(jenkJobParent)].children;
            // let topJob = jenk_job.builds[Object.keys(jenk_job.builds)[0]];
            let topJob = jenk_job.builds[0];
            topJob.packages.forEach(function(pkg_info) {
                let pkgParent = {'name': pkg_info.name};
                childrenOfJenkJob.push(pkgParent);
                childrenOfJenkJob[childrenOfJenkJob.indexOf(pkgParent)].children = [];
                let childrenOfPkgParent = childrenOfJenkJob[childrenOfJenkJob.indexOf(pkgParent)].children;
                pkg_info.tests.forEach(function(classs) {
                    let classParent = {'name': classs.name};
                    childrenOfPkgParent.push(classParent);
                    childrenOfPkgParent[childrenOfPkgParent.indexOf(classParent)].children = [];
                    let childrenOfClassParent = childrenOfPkgParent[childrenOfPkgParent.indexOf(classParent)].children;
                    classs['test-method'].forEach(function(testMethods) {
                        let testParent = {'name': testMethods.name};
                        childrenOfClassParent.push(testParent);
                    });
                });
            });
        });
    });
    return treeData;
};

module.exports = FillDataToTree;
