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
            const val = (common_words - lest_common_words) / (biggest_common_words - lest_common_words);
            if(val === 0){
                val = 0.05
            }
            nodes.push({ id: articles[key], name: articles[key], val, nodeAutoColorBy: true });
            links.push({ source: this.props.article.title, target: articles[key] })
        }
        nodes.push({ id: this.props.article.title, name: this.props.article.title, val: 1.5, color: 'blue' });
        const data = { links, nodes }
        this.state = { data };
    }

    getNodeColor = n => '#2cbfa4';
    getCenterNodeColor = n => 'rgb(33, 150, 243)';
    getTextColor = n => '#ffffff';

    render() {
        return (
            <div>
                <div style={{ textAlign: 'center', position: 'relative', top: 20, zIndex: 1 }}>
                    <span style={{ color: 'white' }}>
                        {this.props.article.title}
                    </span>
                </div >
                <ForceGraph2D
                    graphData={this.state.data}
                    nodeCanvasObject={({ id, x, y, val, name }, ctx) => {
                        ctx.fillStyle = this.getNodeColor();
                        if(id == this.props.article.title){
                            ctx.fillStyle = this.getCenterNodeColor();
                        }
                        
                                ctx.beginPath(); ctx.arc(x, y, val * 5, 0, 2 * Math.PI, false); ctx.fill();
                                ctx.fillStyle = this.getTextColor();
                                if (id != this.props.article.title) {
                                    ctx.fillText(Math.round(val * 100) / 100, x + 2, y);
                                }
                            
            }}
        />
            </div >
        );
    }
}

export default Similarity;
