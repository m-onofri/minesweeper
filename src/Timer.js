import React from 'react';

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {number: 0};
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.props.isTimerOn === 'start') {
                this.setState({number: this.state.number + 1});
            } else if (this.props.isTimerOn === 'reset') {
                this.setState({number: 0});
            }
        }, 1000);
      }
      
      componentWillUnmount() {
        this.stopTimer();
      }

      stopTimer() {
        clearInterval(this.interval);
      }

    render() {
        return(
            <div id="timer">
                <p>{this.state.number}</p>
            </div>
        );
    }
}

export default Timer;