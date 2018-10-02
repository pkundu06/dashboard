import Dashboard from "../views/Dashboard/Dashboard";
 import Home from "../views/home/Home";
import ProjectInfo from "../components/ProjectInfo/ProjectInfo";


var config = require('../util/config.json');
export const dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "pe-7s-graph",
        component: Dashboard
    }
];
config.jenkinsConfig.projects.forEach((proj) => {
    proj.job_names.forEach(function (project) {
        dashboardRoutes.push(
            {
                name: project,
                path: "/" + project,
                component: ProjectInfo,
            });
    })
});
dashboardRoutes.push({redirect: true, path: "/dashboard", to: "/#/dashboard",name:"Dashboard", component: Dashboard});
dashboardRoutes.push({ path: "/home", to: "/home",name:"home", component: Home});
dashboardRoutes.push({ path: "/", to: "/home",name:"home", component: Home});


