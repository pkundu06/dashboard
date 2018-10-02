import dashimage from "../assets/img/brand/dashlogo.png";
import ooslaimage from "../assets/img/brand/ooslaimage.png";
import prcheckerimage from "../assets/img/brand/prchecker.png";
import turtleimage from "../assets/img/brand/turtle.jpg";
import crowdbeatimage from "../assets/img/brand/crowdbeat.jpg";
import rdcxccimage from "../assets/img/brand/ccimage.jpg";
let  projects = [
    {
        name: "Dashboard",
        href: document.URL + "#dashboard",
        image:dashimage
    },
    {
        name: "OOSLA",
        href: "http://oosla.rdc-dev.moveaws.com/report",
        image :ooslaimage
    },
    {
        name: "Turtle",
        href: "http://performance.turtle.sdsread-dev.moveaws.com/",
        image :turtleimage
    },
    {
        name: "PR Checker",
        href: "http://pr.rdc-dev.moveaws.com/",
        image :prcheckerimage
    },
    {
        name: "Crowd Beat",
        href: "http://platformfeedback.rdc-dev.moveaws.com",
        image :crowdbeatimage
    },
    {
        name: "RDC-X Unit Coverage",
        href: "https://jenkins.moveaws.com/job/ConsumerTech/job/GithubOrg/job/ConsumerTech/job/rdc-x/job/development/CodeCoverage/",
        image :rdcxccimage
    }
];
export default projects;


