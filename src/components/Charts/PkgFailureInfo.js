import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import BuildTrends from '../../components/Charts/BuildTrends'
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
        config.jenkinsConfig.num_builds_to_pull=5;
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
    mainPageCardChart =(data)=>{
        console.log("data from jenkins for androd", data);
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
        let testsArray=[];
        build.packages.forEach((pkg,ind)=>{
            pkg.tests.forEach((test,ind)=>{
                let testTime = Number(test.duration/60).toFixed(1);
                if(test.fail !== 0){
                    let tests ={};
                    let totalcount = test.totalCount;
                    let pass = totalcount - (test.fail + test.skip);
                    tests.name= test.name;
                    tests.pass= pass;
                    tests.skip = test.skip;
                    tests.fail=test.fail;
                    tests.duration= testTime;
                    tests.methods = test['test-method'];
                    tests.url= this.createFullUrl(build.url,pkg.name,test.name);
                    testsArray.push(tests);
                }
            })
        });
        filldata.failedtests = testsArray;
        filldata.testDuration = testDurationSet;
        return filldata;
    };
    createFullUrl =(base, pkg,classs)=>{
        return (base+ "testngreports/"+pkg+"/"+classs)
    };
    openUrl=(e)=>{
        window.open(e);
    };

    trends = (e)=>{
        this.setState({show:true});
        this.setState({clickedTest:e.name});

    };
    getTrendForTest =(jenkdata)=>{
        let statusTrend = [];
        let buildNumebr = [];
       // console.log("data---",jenkdata)
        let builds = jenkdata.builds.filter((build)=>{
            return build.packages;
        });
         builds.forEach((pkg)=>{
             buildNumebr.push(pkg.number.toString());
            pkg.packages.map((pkg)=>{
                pkg.tests.forEach((tests)=>{
                    let methods= tests['test-method'];
                    methods.map((test)=>{
                        if(this.state.clickedTest.toLowerCase() === test.name.toLowerCase()){
                           // console.log("testname",test.name)
                            statusTrend.push(test.status);
                        }
                    });
                })
            })
        });
         let returnObj={};
         returnObj.buildNumbers= buildNumebr;
         returnObj.statusTrends = statusTrend;
         return returnObj;
    };
    modelDom =()=>{
        let removelabel;
        var dataBar = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            series: [
                [1, 1, 0, 1,1]
            ]
        };
        var optionsBar = {
            seriesBarDistance: 100,
            axisX: {
                showGrid: false
            },
            height: "300px",
            axisY: {
                showLabel: false,
            },

        };;
      //  console.log("jdata",this.state.jdata)
        if(!this.state.jdata.length >0){
            return(
                <Modal
                    show={this.state.show}
                    onHide={this.handleHide}
                    dialogClassName="custom-modal"
                >
                    <h4>Loading....</h4>
                </Modal>
                )
        }else{
            this.state.jdata.map((jdata,ind)=>{
                let trends = this.getTrendForTest(jdata.jobs[0]);
                let convertSeries = [];
                console.log("trends", trends);
                let temp =[];
                trends.buildNumbers.forEach((label)=>{
                   label= "Build "+ label;
                    temp.push(label);
                });
                dataBar.labels=temp;
                trends.statusTrends.forEach((data)=>{
                    let obj ={};
                    obj.data=[]
                    console.log("Data",data)
                    if(data.toLowerCase() === "fail"){
                        obj.data.push(50)
                        obj.className ="redbar";
                    }
                    else if(data.toLowerCase() === "pass"){
                        obj.data.push(100)
                        obj.className ="greenbar";
                    }
                    else if(data.toLowerCase() === "skip"){
                        obj.data.push(50);
                        obj.className ="orangebar";
                    }
                    convertSeries.push(obj)
                });

                dataBar.series=convertSeries;
                if(dataBar.series.length !== dataBar.labels.length){
                    removelabel =dataBar.labels.length - dataBar.series.length;
                    for(var i=0;i<removelabel;i++){
                        dataBar.labels.pop()
                    }
                }

            });
            let title= this.state.clickedTest.slice(0,-1);
            let numberoftrends = dataBar.series.length;
            let category  = "Last: " + numberoftrends + " Build Trends";
            return (
                <Modal
                    show={this.state.show}
                    onHide={this.handleHide}
                    dialogClassName="custom-modal"
                >
                    <row>
                        <Col md={12}>
                            <Card
                                id="chartActivity"
                                title={title}
                                category={category}
                              //  stats={stats}
                                statsIcon="fa fa-check"
                                content={
                                    <div className="ct-chart">
                                        <ChartistGraph
                                            data={dataBar}
                                            type="Bar"
                                            options={optionsBar}
                                            responsiveOptions={responsiveBar}
                                        />
                                    </div>
                                }
                            />
                        </Col>
                    </row>
                </Modal>

            );

        }


    };

    render() {
        let thArray = ["Name", "Pass","Failed","Skip","Trends"]
        let chartData= this.mainPageCardChart(this.props.data);
        let failedTest =[];
        if(chartData.failedtests.length >0){
            const tdArray = [];
            chartData.failedtests.map((test,ind)=>{
                let temp=[];
                temp.push(test.name);
                temp.push(test.pass);
                temp.push(test.fail);
                temp.push(test.skip);
              //  temp.push(test.duration+" mins");
              //  temp.push(test.url);
                temp.push(test.methods.filter((links)=>{
                    return (links.status.toLowerCase() ==="fail" || links.status.toLowerCase() ==="skip");
                }));
                tdArray.push(temp);
            });
            let testSummary = "Build#"+ chartData.buildnumber;
            testSummary =testSummary+"    Total: "+ chartData.total;
           // testSummary =testSummary+"    Total: "+ chartData.total+  "\n"+"Passed: "+ chartData.pass+ "\n"+"Failed: "+ chartData.fail;
            // if(chartData.skip !==0){
            //     testSummary= testSummary+ " Skip: " + chartData.skip;
            // }
            return (
                <div>
                    <BuildTrends data={this.state.jdata}/>
                <Col md={12}>
                    <Card
                        title={testSummary}
                        failed={" Fail:"+chartData.fail}
                        pass={" Pass:"+chartData.pass}
                        skip={" skip:"+chartData.skip}
                        ctTableFullWidth
                        ctTableResponsive
                        content={
                            <div className="durationDisplay">
                            <Table striped hover>
                                <thead>
                                <tr>
                                    {thArray.map((prop, key) => {
                                        return <th key={key}>
                                            <b>{prop}</b>
                                            </th>;
                                    })}
                                </tr>
                                </thead>
                                <tbody>
                                {tdArray.map((prop, key) => {
                                    return (
                                        <tr key={key}>
                                            {prop.map((prop1, index) => {
                                               // console.log("props", prop1)
                                                let prop = prop1.toString()
                                                if(Array.isArray(prop1)){
                                                    return (
                                                        <td key={index}>
                                                        <DropdownButton
                                                            title={"Failed Test"}
                                                            key={index}
                                                            bsSize="small"
                                                            id="dropdown-size-small"
                                                            onSelect={(e)=>  this.trends(e)}
                                                        >
                                                            {prop1.map((failedtest,ind)=> (
                                                            <MenuItem eventKey={failedtest} >
                                                                <li key={ind}>
                                                            {failedtest.name}
                                                                </li>
                                                            </MenuItem>
                                                                ))}
                                                        </DropdownButton>
                                                    </td>

                                                    )
                                                }else {
                                                    return (<td key={index}>
                                                       {prop}
                                                    </td>)
                                                }

                                            })}
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                                {this.modelDom()}
                            </div>

                        }
                    />
                </Col>
                </div>
            )
        }else{
            return(
                <Col md={4}>
                    <Card
                        statsIcon="fa fa-history"
                        id="chartHours"
                        title="Fail Tests"
                        category={"Build # "+ chartData.buildnumber}
                        content={
                            <div className="ct-chart">
                                <div className={"fancyloading"}>
                                    There are no Failed Tests in this Build
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