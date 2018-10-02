import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import {Grid, Row, Col} from "react-bootstrap";
import {Card} from "../../components/Card/Card.jsx";
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
export class Charts extends Component {
    constructor(props) {
        super();
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
    mainPageCardChart =(data)=>{
        let config = require('../../util/config.json');
        let testDurationSet = config.jenkinsConfig.tests_duration;
        let filldata ={};
        filldata.name= data.jobs[0].name;
        let build= data.jobs[0].builds[0];
        filldata.buildnumber= build.number;
        filldata.duration=build.duration;
        filldata.fail=build.fail;
        filldata.total=build.total;
        filldata.pass=build.pass;
        filldata.skip=build.skip;
        let durationArray=[];
        build.packages.forEach((pkg,ind)=>{
            pkg.tests.forEach((test,ind)=>{
                let testTime = Number(test.duration/60).toFixed(1);
                if(testTime >  testDurationSet){
                    let duration ={};
                    duration.test= test.name;
                    duration.duration= testTime;
                    duration.url= this.createFullUrl(build.url,pkg.name,test.name);
                    durationArray.push(duration);
                }
            })
        });
        filldata.threeMinDuration = durationArray;
        filldata.testDuration = testDurationSet;
        return filldata;
    };
    createFullUrl =(base, pkg,classs)=>{
      return (base+ "testngreports/"+pkg+"/"+classs)
    };
    openUrl=(e)=>{
        window.open(e);
    };
    render() {

        let chartData= this.mainPageCardChart(this.props.data);
        if(chartData.threeMinDuration.length >0){
            return (
                <Col md={4}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title={"Tests taking more than " +chartData.testDuration + " mins"}
                        category={"Build # "+ chartData.buildnumber}
                        content={
                            <div className="durationDisplay">
                                <ul>
                                    {chartData.threeMinDuration.map((data,ind)=>(
                                        <li>
                                        <span>
                                        <a href="javascript:void(0)" onClick={()=>this.openUrl(data.url)}>{data.test +" : "} </a>
                                    {data.duration+" mins"}
                                        </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                    />
                </Col>
            )
        }else{
            return(
                <Col md={4}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title={"Tests taking more than "+ chartData.testDuration + " mins"}
                        category={"Build # "+ chartData.buildnumber}
                        content={
                            <div className="ct-chart">
                                <div className={"fancyloading"}>
                                   All Tests are below {chartData.testDuration} mins.
                                </div>
                            </div>
                        }
                    />
                </Col>
            )
        }


    }
}
export default Charts;