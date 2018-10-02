import React, {Component} from "react";
import {Grid, Row, Col} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import ProjectInfo from "../../components/ProjectInfo/ProjectInfo";
import {Charts} from "../../components/Charts/Charts.jsx";
import {
    dataPie,
    legendPie,
} from "../../variables/Variables.jsx";

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            jdata: [],
            jobs: [],
            jobname:""
        };
    }

    componentWillMount() {
        this.getJenkinsData();

    }
    componentDidMount(){
        let config = require('../../util/config.json');
        setInterval(this.getJenkinsData,config.jenkinsConfig.jenkins_poll_time_in_ms)
    }

    getJenkinsData = () => {
        let config = require('../../util/config.json')
        this.state.jdata=[];
        config.jenkinsConfig.projects.forEach((projects) => {
            projects.job_names.forEach((job) => {
                // this.setState(prevState => ({
                //     jobs: [...prevState.jobs, job]
                // }));
                this.callJenkins(job)
            })
        })
    };

    async callJenkins(job) {
        function res(job) {
            var Jenk = require('../../util/jenkins_handler/jenkins');
            var je = new Jenk();
            return je.captureJenkinsDataForAJob(job).then((data) => {
                return data;
            })

        }

        const data = await res(job);
        if (data) {
            data.projects.forEach((dt, ind) => {
                if (dt.jobs.length > 0) {
                    this.setState(prevState => ({
                        jdata: [...prevState.jdata, dt]
                    }))
                }
            });
        }
    }

    render() {
        if(this.state.jobname){
            return(
                <Redirect to={"/"+this.state.jobname} />
            )
        }
        if(this.state.jdata.length === 0){
            return (
                <div className={"fancyloading"}>
                    <h2>     Loading ....</h2>
                </div>
            )
        }
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        {this.state.jdata.map((data, ind) => (
                            <div className={"pointer"} onClick={()=> this.setState({jobname:data.jobs[0].name})} >
                                <Charts key={ind}
                                        legendPie={legendPie}
                                        data={data}
                                />
                            </div>
                        ))}
                    </Row>
                </Grid>
            </div>
        );

    }
}

export default Dashboard;
