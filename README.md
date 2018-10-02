# dashboardv2
# config Dashboard:
Please update config file under util/config.json
{
  "jiraConfig":{
    "protocol": "https",
    "host": "jira.move.com",
    "username": "",  # <--------------------  username
    "password": "",
    "apiVersion": "2",
    "strictSSL": true
  },
  "jenkinsConfig":{
    "user":"jenkinssvc",
    "pass":"123456",
    "api_token":"",
    "num_builds_to_pull": 1,
    "jenkins_poll_time_in_ms": 1800000,
    "tests_duration":4,
    "projects" : [
      {
        "name":"BASECAMP",
        "test_framework":"testng",
        "url":"jenkins.rdc-dev.moveaws.com",
        "job_names" : [
          "Basecamp_Automation_Edge_Chrome","Basecamp_Automation_Edge_iphone","Basecamp_Automation_Edge_Android"]
      }
    ]
  }
}
to run: 
# npm install 
# npm run start
