import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CronExpression from './lib';

class Cron extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    render() {
        return (<div>
            <CronExpression
                onChange={this.props.onChange}
                value={this.props.value}
                showResultText
                showResultCron
                />
            </div>)
    }
}

Cron.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    showResultText: PropTypes.bool,
    showResultCron: PropTypes.bool
};

Cron.defaultProps = {
    onChange: () => {},
    value: '',
    showResultText: true,
    showResultCron: true
};

export default Cron;
