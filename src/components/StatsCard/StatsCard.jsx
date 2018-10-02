import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export class StatsCard extends Component {
    mainPageCardChart =(data)=>{
            let filldata ={};
            filldata.name= data.jobs[0].name;
            let build= data.jobs[0].builds[0];
            filldata.duration=build.duration;
            filldata.fail=build.fail;
            filldata.total=build.total;
            filldata.pass=build.pass;
            filldata.skip=build.skip;
            let worstPackage="";
            let worstPackageDuration=0;
            build.packages.forEach((pkg,ind)=>{
                if(worstPackageDuration < pkg.classs.duration){
                    worstPackageDuration = pkg.classs.duration;
                    worstPackage = pkg.classs.name;
                }
            });
            filldata.worstPackage = worstPackage;
            filldata.worstPackageDuration = worstPackageDuration;
            return filldata

    };

  render() {
    let dataForChart = this.mainPageCardChart(this.props.data);
    return (
      <div className="card card-stats">
        <div className="content">
          <Row>
            <Col xs={5}>
              <div className="icon-big text-center icon-warning">
                {this.props.bigIcon}
              </div>
            </Col>
            <Col xs={7}>
              <div className="numbers">
                <p>{"Build Duration:"}</p>
                {Number(dataForChart.duration/60).toFixed(1)+" mins"}
              </div>
            </Col>
          </Row>
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon}
                <span>
                    {"Busy Package: "}
                    <b>{
                    dataForChart.worstPackage + " : "}
                    </b>
                </span>
                <span>
                    { Number(dataForChart.worstPackageDuration/60).toFixed(1)+" mins"}
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
