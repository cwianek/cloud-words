import React, { Component } from 'react';
import ReactWordCloud from 'react-wordcloud';
import ResizeAware from 'react-resize-aware';

const WORD_COUNT_KEY = 'value';
const WORD_KEY = 'word';

class WordCloud extends Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div style={{ width: 800, height: 600 }}>
                <ReactWordCloud
                    words={this.props.words}
                    wordCountKey={WORD_COUNT_KEY}
                    wordKey={WORD_KEY}
                    orientations={1}
                    scales={'sqrt'}
                    spiral={'archimedean'}
                    maxAngle={0}
                    minAngle={0}
                />
            </div>
        );
    }
}

export default WordCloud;
