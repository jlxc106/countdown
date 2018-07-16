import React, { Component } from 'react';
import _ from 'lodash';
import Settings from './settings';
import Timer from './timer';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {
        millisecond: 0,
        second: 0,
        minute: 0,
        hour: 0
      },
      currentTime: {
        millisecond: 0,
        second: 0,
        minute: 0,
        hour: 0
      },
      updateTime: false,
      mode: 'once',
      alert: true,
      alarm: null,
      paused: true,
      editTime: true,
      clearTime: false
    };

    this.IntervalKey;
  }

  componentWillUnmount() {
    if (this.IntervalKey) {
      clearInterval(this.IntervalKey);
    }
  }

  countdown() {
    if (
      this.state.paused ||
      (this.state.currentTime.minute <= 0 &&
        this.state.currentTime.second <= 0 &&
        this.state.currentTime.hour <= 0 &&
        this.state.currentTime.millisecond <= 0)
    ) {
      // console.log('clear this interval: ', this.IntervalKey);
      clearInterval(this.IntervalKey);
      this.IntervalKey = 0;
      return;
    } else {
      if (
        this.state.currentTime.second <= 0 &&
        this.state.currentTime.minute <= 0 &&
        this.state.currentTime.millisecond <= 0
      ) {
        this.setState({
          currentTime: {
            hour: this.state.currentTime.hour - 1,
            minute: 59,
            second: 59,
            millisecond: 990
          }
        });
      } else if (
        this.state.currentTime.second <= 0 &&
        this.state.currentTime.millisecond <= 0
      ) {
        this.setState({
          currentTime: {
            ...this.state.currentTime,
            minute: this.state.currentTime.minute - 1,
            second: 59,
            millisecond: 990
          }
        });
      } else if (this.state.currentTime.millisecond <= 0) {
        this.setState({
          currentTime: {
            ...this.state.currentTime,
            second: this.state.currentTime.second - 1,
            millisecond: 990
          }
        });
      } else {
        this.setState(
          {
            currentTime: {
              ...this.state.currentTime,
              second: this.state.currentTime.second,
              millisecond: this.state.currentTime.millisecond - 10
            }
          },
          () => {
            if (
              this.state.currentTime.minute === 0 &&
              this.state.currentTime.second === 0 &&
              this.state.currentTime.hour === 0 &&
              this.state.currentTime.millisecond === 0
            ) {
              if (this.state.mode === 'repeat') {
                new Audio('./../pling.mp3').play();
                this.setState(
                  {
                    currentTime: this.state.time
                  }
                );
              } else {
                new Audio('./../pling.mp3').play();
                clearInterval(this.IntervalKey);
                this.setState({
                  paused: true
                });
              }
            }
          }
        );
      }
    }
  }

  updateFrequency(newFrequency) {
    this.setState({
      mode: newFrequency
    });
  }

  updateMinute(value) {
    if (value > -1 && value < 61) {
      this.setState({
        time: {
          ...this.state.time,
          minute: parseInt(value || 0)
        },
        updateTime: true
      });
    }
  }

  updateSecond(value) {
    if (value > -1 && value < 61) {
      this.setState({
        time: {
          ...this.state.time,
          second: parseInt(value || 0)
        },
        updateTime: true
      });
    }
  }

  updatePaused() {
    const newPaused = !this.state.paused;
    if (this.state.time.minute > 0 || this.state.time.second > 0) {
      if (this.IntervalKey) {
        clearInterval(this.IntervalKey);
        this.IntervalKey = 0;
      }
      this.setState(
        {
          paused: newPaused
        },
        () => {
          if (this.state.paused || this.IntervalKey) {
            return;
          } else if (
            (this.state.currentTime.minute === 0 &&
              this.state.currentTime.second === 0 &&
              this.state.currentTime.hour === 0) ||
            this.state.updateTime
          ) {
            this.setState(
              {
                currentTime: this.state.time,
                updateTime: false
              },
              () => {
                this.IntervalKey = setInterval(() => {
                  this.countdown();
                }, 10);
              }
            );
          } else {
            this.IntervalKey = setInterval(() => {
              this.countdown();
            }, 10);
          }
        }
      );
    }
  }

  editTime(rawTimeInput) {
    var second =
      parseInt(rawTimeInput % 100) > 60 ? 60 : parseInt(rawTimeInput % 100);
    var minute =
      parseInt(rawTimeInput / 100) % 100 > 60
        ? 60
        : parseInt(rawTimeInput / 100) % 100;
    var hour = parseInt(rawTimeInput / 10000) % 100;
    var someVar = {
      millisecond: 0,
      second,
      minute,
      hour
    };
    this.setState({
      time: someVar,
      currentTime: someVar
    });
  }

  resetTimer() {
    this.setState({
      paused: true,
      currentTime: this.state.time
    });
  }

  clearTimer() {
    this.setState(
      {
        paused: true,
        time: {
          second: 0,
          minute: 0,
          hour: 0
        },
        currentTime: {
          second: 0,
          minute: 0,
          hour: 0
        },
        clearTime: true
      },
      () => {}
    );
  }

  callbackClear() {
    this.setState({
      clearTime: false
    });
  }

  render() {
    const debounceUpdateFrequency = newFrequency =>
      this.updateFrequency(newFrequency);
    const debouncedUpdatePaused = () => {
      this.updatePaused();
    };
    const handleClear = () => this.clearTimer();

    const handleReset = () => this.resetTimer();

    return (
      <div>
        <Timer
          settings={this.state}
          editTime={rawTimeInput => this.editTime(rawTimeInput)}
          callbackClearTime={() => this.callbackClear()}
        />

        <Settings
          callbackFrequency={debounceUpdateFrequency}
          callbackPaused={debouncedUpdatePaused}
          handleReset={handleReset}
          handleClear={handleClear}
          mode={this.state.mode}
          paused={this.state.paused}
        />
      </div>
    );
  }
}

export default IndexPage;
