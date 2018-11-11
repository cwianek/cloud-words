import React, { Component } from 'react';
import ReactWordCloud from 'react-wordcloud';

const WORD_COUNT_KEY = 'value';
const WORD_KEY = 'word';

class WordCloud extends Component {
    constructor(props){
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div style={{ width: 600, height: 400 }}>
                <ReactWordCloud
                    words={this.props.words}
                    wordCountKey={WORD_COUNT_KEY}
                    wordKey={WORD_KEY}
                />
            </div>
        );
    }
}

export default WordCloud;
