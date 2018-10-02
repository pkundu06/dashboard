# dashboardv2
# config Dashboard:
Please update config file under src/util/config.json based on your jenkins configuration 
``` {
  "jenkinsConfig":{ 
    "user":"",
    "pass":"",
    "api_token":"",
    "num_builds_to_pull": 1,
    "jenkins_poll_time_in_ms": 1800000,
    "tests_duration":4,
    "projects" : [
      {
        "name":"Job name",
        "test_framework":"testng",
        "url":"jenkins.com",
        "job_names" : [
          "ipad_automation","iphone_automation","Android_automation"]
      }
    ]
  }
}```

to run: 
# npm install 
# npm run start
