import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: true,
      newTime: 0
    };

    this.myRef = React.createRef();
  }

  handleOnClick() {
    this.setState({
      editMode: true
    });
  }

  componentDidMount() {
    if (this.state.editMode) {
      this.focusDiv();
    }
  }

  componentDidUpdate() {
    if (this.props.settings.clearTime) {
      this.setState(
        {
          newTime: 0,
          editMode: true
        },
        () => {
          this.props.callbackClearTime();
        }
      );
    }

    if (this.state.editMode) {
      this.focusDiv();
    }
  }

  focusDiv() {
    ReactDOM.findDOMNode(this.myRef.current).focus();
  }

  handleOnChange(e) {
    e.persist();
    var value = e.currentTarget.value || '';
    if ((value < 1000000 && value >= 1) || value === '') {
      this.setState(
        {
          newTime: value
        }
            );
    }
  }

  keyPress(e) {
    e.persist();
    switch (e.key) {
      case 'Enter':
        this.setState(
          {
            editMode: false,
            newTime: this.state.newTime || 0
          },
          () => {
            this.props.editTime(this.state.newTime);
          }
        );
        return;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        if (this.state.newTime >= 100000) {
          var modulo = this.state.newTime % 100000;
          this.setState({
            newTime: parseInt(modulo + e.key)
          });
          return;
        }
        this.setState({
          newTime: parseInt(this.state.newTime + e.key)
        });
        return;
      case 'Backspace':
        this.setState({
          newTime: parseInt(this.state.newTime / 10)
        });
        // console.log('backspace');
        return;
      default:
        return;
    }
  }

  handleOnBlur() {
    this.setState(
      {
        editMode: false,
        newTime: this.state.newTime || 0
      },
      () => {
        this.props.editTime(this.state.newTime);
      }
    );
  }

  render() {
    // var settings = this.props.settings
    var { millisecond, second, minute, hour } = this.props.settings.currentTime;
    // if(this.props.settings.editTime)
    var returnDiv;
    if (!this.state.editMode) {
      return (
        <div className="contain_timer">
          <div
            className="contain-non-edit-timer"
            onClick={() => this.handleOnClick()}
          >
            [{' '}
            <span className="span-non-edit">
              {hour < 10 ? '0' + hour : hour}
            </span>{' '}
            h{' '}
            <span className="span-non-edit">
              {minute < 10 ? '0' + minute : minute}
            </span>{' '}
            m{' '}
            <span className="span-non-edit">
              {second < 10 ? '0' + second : second}
            </span>{' '}
            s <span className="span-non-edit">{millisecond || '000'}</span> ms ]
          </div>
        </div>
      );
    } else {
      return (
        <div className="contain_timer">
          <div
            className="contain-edit-timer"
            onKeyDown={e => this.keyPress(e)}
            onChange={e => this.handleOnChange(e)}
            onBlur={
              () => this.handleOnBlur()
            }
            ref={this.myRef}
            tabIndex="0"
          >
            <span>{parseInt(this.state.newTime / 100000) % 10}</span>
            <span>{parseInt(this.state.newTime / 10000) % 10}</span>
            <span className="span-edit">h</span>
            <span>{parseInt(this.state.newTime / 1000) % 10}</span>
            <span>{parseInt(this.state.newTime / 100) % 10}</span>
            <span className="span-edit">m</span>
            <span>{parseInt(this.state.newTime / 10) % 10}</span>
            <span>{parseInt(this.state.newTime) % 10}</span>
            <span className="span-edit">s</span>
          </div>
        </div>
      );
    }
  }
}
