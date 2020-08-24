import React from 'react';
import {
    Divider,
    Card,
    List,
    ListItem,
    Typography
} from '@material-ui/core';
import axios from "axios";
import './Activity.css';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: null,
        };
        this.createActivityList = this.createActivityList.bind(this);
        this.handleUpdateButtonClicked = this.handleUpdateButtonClicked.bind(this);
    }

    componentDidMount() {
        axios.get("http://localhost:3000/activity").then((res) => {
            console.log("received activity data in react!", res.data);
            this.setState({
                activities: res.data
            });
        }).catch((error) => {
            console.log("Error occurred!", error);
        });
    }

    handleUpdateButtonClicked() {
        axios.get("http://localhost:3000/activity").then((res) => {
            console.log("received activity data in react!", res.data);
            this.setState({
                activities: res.data
            });
        }).catch((error) => {
            console.log("Error occurred!", error);
        });
    }

    createActivityList() {
        let list = [];
        if(this.state.activities === [] || !this.state.activities) {
            return "";
        }
        console.log("generate table body activities", this.state.activities);
        for(let i = 0; i < this.state.activities.length; i++) {
            let activity = this.state.activities[i];
            list.push(<ListItem key={activity.time} className={"activity-list-item"}>
                <Typography variant={"body1"} className={"activity-time"}>{activity.time}</Typography>
                <Typography className={"activity-user-name"} fontWeight={"fontWeightBold"} style={{"fontWeight": 500}}>{activity.userName}</Typography>
                <Typography variant={"body1"} className={"activity-info"}>{activity.info}</Typography>
                {activity.photo ? <img src={"/images/"+activity.photo.file_name} className={"thumbnail"}/> : ""}
            </ListItem>);
            list.push(<Divider key={i}/>)
        }
        return list;
    }

    render() {
        return (
            <Card className={"activity-container"}>
                <Typography variant={"h4"} className={"activity-title"}>Activity Feed</Typography>
                <List>
                    <Divider />
                {this.createActivityList()}
                </List>
                <button onClick={this.handleUpdateButtonClicked} className={"update-button"}>Update</button>
            </Card>
        );
    }
}

export default Activity;
