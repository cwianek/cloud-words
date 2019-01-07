import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';

class Similarity extends Component {
    constructor(props) {
        super(props);
        const nodes = [];
        const links = [];
        let biggest_common_words = 0;
        let lest_common_words = 99999;
        const articles = Object.keys(this.props.article.similarity_dict);
        for (var key in articles) {
            const common_words = articles[key].length;
            if (common_words > biggest_common_words) {
                biggest_common_words = common_words;
            }
            if (common_words < lest_common_words) {
                lest_common_words = common_words;
            }
        }
        for (var key in articles) {
            const common_words = articles[key].length;
            nodes.push({ id: articles[key], name: articles[key], val: (common_words - lest_common_words) / biggest_common_words * 10, nodeAutoColorBy: true });
            links.push({ source: this.props.article.title, target: articles[key] })
        }
        nodes.push({ id: this.props.article.title, name: this.props.article.title, val: 10, color: 'blue' });
        const data = { links, nodes }
        this.state = { data };
    }

    render() {
        return (
            <div>
                <div style={{ textAlign: 'center', position: 'relative', top: 20, zIndex: 1 }}>
                    <span style={{ color: 'white' }}>
                        {this.props.article.title}
                    </span>
                </div >
                <ForceGraph3D
                    graphData={this.state.data}
                />
            </div >
        );
    }
}

export default Similarity;
