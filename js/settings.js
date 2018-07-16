import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props);

  }

  updateFrequency(e) {
    const value = e.currentTarget.value;
    this.props.callbackFrequency(value)
  }

  updatePaused(){
      this.props.callbackPaused();
  }

  resetTimer(){
      this.props.handleReset();
  }

  clearTimer(){
      this.props.handleClear();
  }

  render() {
    var resumeButtonText='Pause';
    if(this.props.paused){
        resumeButtonText='Resume';
    }
    

    return (
      <div className="contain_settings">
        <div>
          <span className="span_frequency">Frequency</span>
          <label>
            <input
              type="radio"
              value="once"
              checked={this.props.mode === 'once'}
              onChange={e => this.updateFrequency(e)}
            />
            once
          </label>
          <label>
            <input
              type="radio"
              value="repeat"
              checked={this.props.mode === 'repeat'}
              onChange={e => this.updateFrequency(e)}
            />
            repeat
          </label>
        </div>
        <div className="contain_buttons">
            <button className="btn btn-success" onClick={() => this.updatePaused()}>
                {resumeButtonText}
            </button>
            <button className="btn btn-warning" onClick={()=> this.resetTimer()} >Reset</button>
            <button className="btn btn-danger" onClick={() => this.clearTimer()} >Clear</button>
        </div>
      </div>
    );
  }
}

export default Settings;
