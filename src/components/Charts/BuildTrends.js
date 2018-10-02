import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import {Grid, Row, Col,Table,DropdownButton,MenuItem,Modal,Button} from "react-bootstrap";
import {Card} from "../../components/Card/Card.jsx";
import {
    thArray,
    tdArray,
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
export class Charts extends Component {
    constructor(props) {
        super();
        this.handleHide = this.handleHide.bind(this);

        this.state = {
            show: false,
            jdata:[],
            clickedTest:""
        };
    }

    handleHide() {
        this.setState({ show: false });
    }

    componentDidMount() {
        let config = require('../../util/config.json');
        config.jenkinsConfig.num_builds_to_pull=7;
        console.log("config", config)
        let currentLocation= window.location.href.split("/");
        config.jenkinsConfig.projects.forEach((projects) => {
            projects.job_names.forEach((job) => {
                if(job.toLowerCase() === currentLocation[currentLocation.length-1].toLowerCase()){
                    this.callJenkins(job)
                }
            })
        })
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
    createLegend(json) {
        var legend = [];
        for (var i = 0; i < json["names"].length; i++) {
            var type = "fa fa-circle text-" + json["types"][i];
            legend.push(<i className={type} key={i}/>);
            legend.push(" ");
            legend.push(json["names"][i]);
        }
        return legend;
    }
    getBuildDataTrend =(builds)=>{
        let dataObj={};
        dataObj.labels=[];
        dataObj.series=[];
        let pass =[]
        let fail=[]
        let skip=[]
        let total =[]
        builds.map((data,ind)=>{
            dataObj.labels.push(data.number);
            pass.push(data.pass)
            fail.push(data.fail)
            skip.push(data.skip)
            total.push(data.total)
        });
        dataObj.labels= dataObj.labels.reverse()
        dataObj.series.push(total.reverse())
        dataObj.series.push(pass.reverse())
        dataObj.series.push(fail.reverse())
        dataObj.series.push(skip.reverse())
        return dataObj;
    };
    render() {
        let config = require('../../util/config.json');
        let title = " Build Trends"
        if(this.state.jdata.length >0){
            let buildData = this.getBuildDataTrend(this.state.jdata[0].jobs[0].builds)
            return (
                <Col md={12}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title={title}
                        content={
                            <div className="ct-chart">
                                <ChartistGraph
                                    data={buildData}
                                    type="Line"
                                    options={optionsSales}
                                    responsiveOptions={responsiveSales}
                                />
                            </div>
                        }
                    />
                </Col>

            )
        }
        else{
            return (
                <Col md={12}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        content={
                            <div className="ct-chart">
                               LOADING TRENDS ....
                            </div>
                        }
                    />
                </Col>

            )
        }

        }


}
export default Charts;