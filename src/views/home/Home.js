import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import {ProjectCard} from "../../components/ProjectCard/ProjectCard";
import Projects from "../../routes/HomeRoutes"
import gsw from "../../assets/img/brand/realtor_logo.png"
const sidebarBackground = {
    backgroundImage: "url(" + gsw + ")"
};
class Home extends Component {

    constructor() {
        super();
    }


    render() {
        return (
            <div class="container body-home">
                <div class="jumbotron ">
                    <div className={"header-home"}>
                        <div class="plate">
                        <span>
                            <img src={gsw} width={"45px"} height={"50px"}/>
                    <h2 className={"home-header shadow"}>QE-DASHBOARD</h2>
                        </span>
                        </div>
                    </div>
                    <div className="content-home">
                        <Grid fluid>
                            <Row>
                                {Projects.map((project,key)=>(
                                    <Col md={4}>
                                        <ProjectCard
                                            key={key}
                                            name={project.name}
                                            img={project.image}
                                            href={project.href}
                                        />
                                    </Col>
                                ))}
                            </Row>

                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
