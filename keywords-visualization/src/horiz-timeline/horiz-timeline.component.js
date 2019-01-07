import React, { Component } from 'react';
import WordCloud from '../word-cloud/word-cloud.component';
import HorizontalTimeline from 'react-horizontal-timeline';

class HorizTimeline extends Component {
    constructor(props) {
        super(props);
        const dates = this.props.data.map((entry) => {
            const d = entry.date.split('-')
            return d[1] + '/' + d[2] + '/' + d[0]
        });

        this.state = {
            value: 0, dates
        };
        console.log(dates)

    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                {/* Bounding box for the Timeline */}
                <div style={{ width: '60%', height: '100px', margin: '0 auto' }}>
                    <HorizontalTimeline
                        index={this.state.value}
                        indexClick={(index) => {
                            this.setState({ value: index, previous: this.state.value });
                        }}
                        labelWidth={120}
                        values={this.state.dates} />
                </div>
                <div style={styles.wordcloud}>
                    <WordCloud words={this.props.data[this.state.value].value} />
                </div>
            </div>
        )
    }
}

const styles={
    wordcloud:{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export default HorizTimeline;
