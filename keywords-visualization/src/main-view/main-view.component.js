import React, { Component } from 'react';
import FileUpload from '../file-upload/file-upload.component';
import Timeline from '../timeline/timeline.component';
import request from 'superagent';

class MainView extends Component {
    constructor() {
        super();
        this.state = { files: [], parsedArticles:[], similarArticles: {}};
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
        if(err){
            console.error(err);
            return;
        }
        console.log(res)
        this.setState({parsedArticles: res.body.articles});
    }

    render() {
        return (
            <div>
                <FileUpload onDrop={this.onDropFiles} />
                <Timeline data={this.state.parsedArticles} />
            </div>
        );
    }
}

export default MainView;
