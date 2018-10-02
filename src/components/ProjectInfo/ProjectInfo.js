import React, {Component} from "react";
import ChartistGraph from "react-chartist";
import {Grid, Row, Col} from "react-bootstrap";
import {Card} from "../../components/Card/Card.jsx";
import {StatsCard} from "../../components/StatsCard/StatsCard.jsx";
import {DefaultCharts} from "../../components/Charts/Charts.jsx";
import {Charts} from "../../components/Charts/Charts.jsx";
import DurationChart from '../../components/Charts/DurationChart'
import PkgFailureInfo from '../../components/Charts/PkgFailureInfo'

import {
    dataPie,
    legendPie,
    dataSales,
    optionsSales,
    responsiveSales,
    legendSales,
    dataBar,
    optionsBar,
    responsiveBar,
    legendBar
} from "../../variables/Variables.jsx";

class ProjectInfo extends Component {

    constructor(props) {
        super();
        this.state = {
            jdata: []
        };

    }

    componentWillMount() {
        let config = require('../../util/config.json')
        config.jenkinsConfig.projects.forEach((projects) => {
            projects.job_names.forEach((job) => {
                if("/"+job.toLowerCase() === this.props.location.pathname.toLowerCase()){
                   this.callJenkins(job)
                }
            })
        })
    }
    componentDidMount(){

    }
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
        if(this.state.jdata.length === 0){
            return (
                <div className={"fancyloading"}>
                    <h2>     Loading ....</h2>
                </div>
            )
        }else{

            return (
                <div className="content">
                    <Grid fluid>
                        {this.state.jdata.map((data,ind)=>(
                            <Row>
                                <PkgFailureInfo
                                    data={data}
                                    key={ind}
                                />
                                <Charts legendPie={legendPie}
                                        data={data}
                                        key={ind}
                                />
                                <DurationChart
                                    data={data}
                                    key={ind}
                                />
                                <Col lg={4}>
                                    <StatsCard
                                        data={data}
                                        bigIcon={<i className="pe-7s-timer text-warning"/>}
                                        statsIcon={<i className="fa fa-refresh"/>}
                                    />
                                </Col>

                            </Row>
                        ))}

                    </Grid>
                </div>
            );
        }
    }
}

export default ProjectInfo;
