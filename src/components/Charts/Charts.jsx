import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import {Grid, Row, Col} from "react-bootstrap";
import {Card} from "../../components/Card/Card.jsx";
export class Charts extends Component {
    constructor() {
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
        let filldata ={};
        filldata.name= data.jobs[0].name;
        let build= data.jobs[0].builds[0];
        filldata.duration=build.duration;
        filldata.fail=build.fail;
        filldata.total=build.total;
        filldata.pass=build.pass;
        filldata.skip=build.skip;
        filldata.timestamp= build.timestamp;
        return filldata;
    };

    render() {
        let title ="";
            let chartData= this.mainPageCardChart(this.props.data);
            let dataPie = {
                series: [chartData.pass, chartData.fail, chartData.skip],
            };
        let color =["#71d140", "#ef3300", "#e18e23"];

            var sum = function(a, b) { return a + b };
            let option={
                donut: true,
                colors: color,
                labelInterpolationFnc: function(value) {
                    if(value !== 0){
                        return Number(value / dataPie.series.reduce(sum) * 100).toFixed(0) + '%';
                    }
                }
            };
        //     console.log("options",option)
        // console.log("data series", dataPie.series)
            let date= new Date(chartData.timestamp).toLocaleString();
            if(date.indexOf("Invalid") === -1){
                title= "Last Build: " + new Date(chartData.timestamp).toLocaleString();
            }
            let name= chartData.name.replace(/_/g,"-");
            return (
                <Col md={4}>
                    <Card
                        key={this.props.key}
                        statsIcon="fa fa-clock-o"
                        title={name.toUpperCase()}
                        category={title}
                        content={
                            <div
                                id="chartPreferences"
                                className="ct-chart ct-perfect-fourth"
                            >
                                <ChartistGraph data={dataPie} type="Pie" options={option}/>
                            </div>
                        }
                    />
                </Col>
            )

    }
}
export default Charts;