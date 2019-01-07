import React, { Component } from 'react';
import FileUpload from '../file-upload/file-upload.component';
import Timeline from '../timeline/timeline.component';
import request from 'superagent';
import HorizTimeline from '../horiz-timeline/horiz-timeline.component';
class MainView extends Component {
    constructor() {
        super();
        this.state = { files: [], parsedArticles: [], similarArticles: {}, showArticles: true };
    }

    onDropFiles = (files) => {
        console.log(files);
        this.setState(
            { files: files },
            this.sendFilesToParse
        );
    }

    readFilesContent = () => {
        const { files } = this.state;
        var promises = []
        files.forEach(file => {
            const reader = new FileReader();
            const promise = new Promise(function (resolve, reject) {
                reader.onload = () => {
                    resolve(reader.result);
                };
            });
            reader.readAsBinaryString(file);
            promises.push(promise);
        });
        return promises;
    }

    sendFilesToParse = () => {
        var self = this;
        const promises = this.readFilesContent();
        Promise.all(promises).then(function (data) {
            request
                .post('http://localhost:2006/upload')
                .send({ data: data })
                .end(self.handleServerResponse)
        })
    }

    handleServerResponse = (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(res)
        this.setState({ parsedArticles: res.body.articles, aggregated: res.body.aggregated });
    }

    toggleShow = () => {
        this.setState({showArticles: !this.state.showArticles})
    }

    render() {
        return (
            <div>
                <FileUpload onDrop={this.onDropFiles} />
                {this.state.parsedArticles.length ?
                    <div style={styles.toggleStyle}>
                    {
                        this.state.showArticles ? 
                        <div onClick={this.toggleShow} style={styles.button}>Show timeline</div>
                        : <div onClick={this.toggleShow} style={styles.button}>Show articles</div>
                    }
                    </div>
                    : null
                }
                { this.state.showArticles ? 
                <Timeline data={this.state.parsedArticles} />
                : <HorizTimeline data={this.state.aggregated} style={styles.timeline} />
                }
            </div >
        );
    }
}

const styles = {
    toggleStyle:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    button:{
        backgroundColor: '#6c757d',
        width: 100,
        padding: 5,
        color: 'white',
        cursor: 'pointer',
        marginBottom: 20
    },
    timeline:{
        margin: 30,
    }
}

export default MainView;
