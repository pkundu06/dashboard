import React, { Component } from "react";

export class ProjectCard extends Component {
    handleClick = (url) =>{
        window.open(url);
    };
    render() {
        return (
            <div class="project-card">

                <img class="card-img-top" src={this.props.img} alt={this.props.name} onClick={()=>this.handleClick(this.props.href)} />
                    <div class="card-body">
                        <p class="card-text">{this.props.name}</p>
                    </div>
            </div>
        );
    }
}

export default ProjectCard;
