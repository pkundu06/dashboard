# dashboardv: react app that display trends of automation results with beautiful graphs and charts
to run: 
# npm install 
# npm run start

# config Dashboard:
Please update config file under src/util/config.json based on your jenkins configuration 
``` {
  "jenkinsConfig":{ 
    "user":"",  <------ jenkins user
    "pass":"",  <------ jenkins pass
    "api_token":"",   <------- token (prefered method)
    "num_builds_to_pull": 1,   <----- how many builds to pull for dashboard under jenkin jobs
    "jenkins_poll_time_in_ms": 1800000,  <------ app will refresh it self in 30 mins
    "tests_duration":4,    <---------  report tests taking more than 4 mins
    "projects" : [  <------ array of projects to be displayed on dashboard
      {
        "name":"Job name",   <--------- job name that will be displayed on dashboard
        "test_framework":"testng",   <----------- framework supported: testng or junit
        "url":"jenkins.com",  <--------   url for jenkins host
        "job_names" : [
          "ipad_automation","iphone_automation","Android_automation"]  <------ array of jobs under a specific url
      }
    ]
  }
}```
