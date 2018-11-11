import React, { Component } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import WordCloud from '../word-cloud/word-cloud.component';
import Modal from 'react-modal';

class Timeline extends Component {
    constructor() {
        super();

        this.state = {
            modalIsOpen: false, selectedKeywords: []
        };

        Modal.setAppElement('body')
    }

    componentDidMount() {
    }

    openModal = (article) => {
        this.setState({ modalIsOpen: true, selectedKeywords: article.keywords });
    }

    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    }


    render() {
        const { data } = this.props;
        return (
            <div style={{ backgroundColor: '#F4F2F0' }}>
                {data.length ?
                    <div className="timeline">
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <WordCloud words={this.state.selectedKeywords} />
                        </Modal>
                        <VerticalTimeline>
                            {
                                data.map(article =>
                                    <VerticalTimelineElement
                                        key={article.title}
                                        className="vertical-timeline-element--work"
                                        date="2016 - present"
                                        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                    >
                                        <h3 className="vertical-timeline-element-title">{article.title}</h3>
                                        {/* <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4> */}
                                        <p><button style={styles.showButton} onClick={() => this.openModal(article)}>Show word cloud</button></p>
                                    </VerticalTimelineElement>
                                )
                            }
                        </VerticalTimeline>

                    </div>
                    : null}
            </div>
        );
    }
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgb(14, 21, 28)',
        border: 'none',
        opacity: '1',
    },
    overlay: {
        opacity: 0.97,
        backgroundColor: 'rgb(34, 41, 48)',
    },
    verticalTimelineElementDate: {
        color: 'white',
    }
};

const styles = {
    showButton: {
        backgroundColor: '#616161',
        border: 'none',
        color: 'white',
        padding: `5px 5px`,
        textDecoration: 'none',
        cursor: 'pointer'
    }
}

export default Timeline;
