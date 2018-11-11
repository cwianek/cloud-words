import React, { Component } from 'react';
import Dropzone from 'react-dropzone'

class FileUpload extends Component {
    constructor() {
        super()
    }

    onCancel() {
    }

    render() {
        return (
            <section>
                <div style={styles.wrapper} className="dropzone">
                    <Dropzone
                        style={styles.dropzone}
                        onDrop={(files) => this.props.onDrop(files)}
                        onFileDialogCancel={() => this.onCancel()}
                    >
                        <p>Try dropping some files here, or click to select files to upload.</p>
                    </Dropzone>
                </div>
            </section>
        );
    }
}

const styles={
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        color: 'white',
    },
    dropzone:{
        backgroundColor: '#2CBFA4',
        width: 500,
        cursor: 'pointer'
    }
}

export default FileUpload;
