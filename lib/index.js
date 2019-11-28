import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cronstrue from 'cronstrue';
import { withStyles } from '@material-ui/styles';
import { Tabs, Tab, Paper } from '@material-ui/core';
import BaseTabScreen from './BaseTabScreen';

import './cron-builder.css';

const tabs = ['Seconds', 'Minutes', 'Hourly', 'Daily', 'Monthly', 'Yearly'];
const seconds = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
];
const minutes = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
];
const hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = {
    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthAbb: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
};
const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040'];

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    tabRoot: {
        textTransform: 'initial',
        maxWidth: 350,
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        fontFamily: 'sans-serif',
        fontSize: 16,
        '&:hover': {
            color: '#40a9ff',
            opacity: 1
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium
        },
        '&:focus': {
            color: '#40a9ff'
        }
    }
  });

class CronExpression extends Component {
    constructor(props) {
        super(props);
        this.state = {
           selectedTab: tabs[0],
           
        };
    }

    componentWillMount() {
        if (!this.props.value || this.props.value.split(' ').length !== 7 ) {
            this.state.value = ['0','0','00','1/1','*','?','*']
            
        } else  {
            this.state.value = this.props.value.split(' ');
        }
        this.parentChange(this.state.value);
    }

    tabChanged = (e, index) => {
        let value = this.state.value;
        this.setState({selectedTab: tabs[index], value: value}); 
        this.parentChange(value);
    }
    getHeaders(classes) {
        return (
            <Paper classes={{root: classes.root}}>
                <Tabs
                    value={tabs.indexOf(this.state.selectedTab)}
                    onChange={(e, index) => this.tabChanged(e, index)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    >
                    {tabs.map(tab => <Tab label={tab} classes={{ root: classes.tabRoot }} />)}
                </Tabs>
            </Paper>
        )
    }
   
    onValueChange = value => {     
        if(value && value.length) {
            this.setState({value: value})
        } else { 
            this.setState({value: ['0','0','00','1/1','*','?','*']})
            value = ['0','0','00','1/1','*','?','*'];
        }
       this.parentChange(value)
    }

    parentChange(value) {
        let newVal = ''
        newVal = value.join(' ');
        this.props.onChange(newVal) ;
    }

    getVal() {
        let value = cronstrue.toString(this.state.value.join(' '));
        if(value.search('undefined') === -1) {
            return value;
        }
        return '-';
    }

    getComponent(tab) {
        switch(tab) {
            case tabs[0]:
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Seconds' expressionIndex={0} range={seconds}/>
                break;
            case tabs[1] : 
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Minutes' expressionIndex={1} range={minutes}/>
                break;
            case tabs[2] : 
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Hours' expressionIndex={2} range={hours}/>
                break;
            case tabs[3] : 
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Days' expressionIndex={5} select selectFrom={week} selectValueFrom={days} />
                break;
            case tabs[4] : 
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Month' expressionIndex={4} select selectFrom={months.month} selectValueFrom={months.monthAbb}/>
                break;
            case tabs[5] : 
                return <BaseTabScreen value={this.state.value} onChange={this.onValueChange} tabName='Years' expressionIndex={6} select selectFrom={years}/>
                break;
            default: 
                return
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className='cron_builder'>
                {this.getHeaders(classes)}
            <div className="cron_builder_bordering">{this.getComponent(this.state.selectedTab)}</div>
            {this.props.showResultText && <div className="cron-builder-bg">{this.getVal()}</div>}
            {this.props.showResultCron && <div className="cron-builder-bg">{this.state.value.join(' ')}</div>}       
        </div>)
    }
}

CronExpression.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CronExpression);
