import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import {Navbar, DropdownButton,MenuItem} from "react-bootstrap";
import HeaderLinks from "../Header/HeaderLinks.jsx";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import imagine from "../../assets/img/brand/gsw2.png";
import logo from "../../assets/img/brand/realtor_logo.png";
import Dashboard from "../../views/Dashboard/Dashboard";
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarExists: false,
            width: window.innerWidth,
            routes:[]
        };
        var config = require('../../util/config.json');
        this.state.routes.push( {
            path: "/dashboard",
            name: "Dashboard",
            icon: "pe-7s-graph",
            component: Dashboard
        });
        this.state.routes.push({ redirect: true, path: "/", to: "/dashboard", name: "Dashboard" });
        config.jenkinsConfig.projects.forEach((projects)=>{
            let proj ={};
            proj.parent=projects.name;
            proj.names =[];
            projects.job_names.forEach(function (project) {
                proj.names.push(   {name:project,
                    path:"/"+project,
                    component:ProjectInfo,
                });
            });
            this.state.routes.push(proj);
        });
    }

    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    updateDimensions() {
        this.setState({width: window.innerWidth});
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    sidebarToggle(e) {
        let sidebarCollapse = document.getElementById("sidebarCollapse");
        let sidebar = document.getElementById("sidebar");
        sidebarCollapse.on('click', function () {
            //
        });
    }
    links(prop,key){
        return (
            <li className={
                this.activeRoute(prop.path)
            }
                key={key}>
                <NavLink

                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                >
                    <i className={prop.icon}/>
                    <p>{prop.name}</p>

                </NavLink>
            </li>
        );
    }

    render() {
      //  console.log("routes build:", this.mapprojects(dashboardRoutes));
        const sidebarBackground = {
            backgroundImage: "url(" + imagine + ")"
        };
            return (

                <div
                    id="sidebar"
                    className="sidebar"
                    data-color="black"
                    data-image={imagine}
                >
                    <div className="sidebar-background" style={sidebarBackground}/>
                    <div className="logo">
                        <a
                            href="#"
                            className="simple-text logo-mini"
                        >
                            <div className="logo-img">
                                <img src={logo} alt="logo_image"/>
                            </div>
                        </a>
                        <a
                            href="#"
                            className="simple-text logo-normal"
                        >
                        </a>
                    </div>
                    <div className="sidebar-wrapper">
                        <li className="nav">
                            {this.state.width <= 991 ? <HeaderLinks/> : null}
                            {this.state.routes.map((project,key)=>{
                                if(project.name==="Dashboard" && !project.redirect ){
                                    return (
                                        <li className={
                                            this.activeRoute(project.path)
                                        }
                                            key={key}>
                                            <NavLink

                                                to={project.path}
                                                className="nav-link"
                                                activeClassName="active"
                                            >
                                                <i className={project.icon}/>
                                                <p>{project.name}</p>

                                            </NavLink>
                                        </li>
                                    )
                                }
                                if(project.parent){
                                    return(
                                        <DropdownButton
                                            title={project.parent}
                                            key={key}
                                            bsSize="default"
                                            id="dropdown-size-small"
                                            onSelect={(prop)=>this.links(prop)}
                                        >
                                            {project.names.map((prop,key)=>(
                                                <MenuItem eventKey={prop} >
                                                    <li className={
                                                        this.activeRoute(prop.path)
                                                    }
                                                        key={key}>
                                                        <NavLink

                                                            to={prop.path}
                                                            className="nav-link"
                                                            activeClassName="active"
                                                        >
                                                            <i className={prop.icon}/>
                                                            <p>{prop.name}</p>

                                                        </NavLink>
                                                    </li>
                                                </MenuItem>
                                                //     this.links(prop,key)
                                            ))}
                                        </DropdownButton>
                                    )

                                }
                            })}
                        </li>
                    </div>
                </div>
            );

    }
}

export default Sidebar;
