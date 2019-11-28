import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, TextField, Checkbox, FormGroup, FormControlLabel, FormControl, FormHelperText, FormLabel, Radio, RadioGroup,
    List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Input, IconButton, InputLabel, MenuItem, Select } from '@material-ui/core';

const styles = theme => ({
    root: {
        width: '100%',
    },
    selectMenu: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    textField: {
        marginTop: 0,
        marginBottom: 0,
        width: '117px',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        verticalAlign: 'middle'
    },
    textFieldBeforeEnd: {
        marginTop: 0,
        marginBottom: 0,
        width: '117px',
        marginLeft: '0px',
        marginRight: theme.spacing.unit * 3,
        verticalAlign: 'middle'
    },
    textFieldRoot: {
        padding: 0,
        marginTop: 0,
        'label + &': {
          marginbottom: theme.spacing.unit * 3,
        }
      },
    textFieldInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ddd',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

class BaseTabScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            [ `every${this.props.tabName}From`]: 0,
            [`every${this.props.tabName}Start`]: 0,
            [`everySpecific${this.props.tabName}`]: ['0'],
            [`every${this.props.tabName}BetweenStart`]: 0,
            [`every${this.props.tabName}BetweenEnd`]: 0,
            everyDaysStartFrom: 1,
            everyDaysStartingOn: '01',
            nearestWeekDays: '01',
            onDaysWeekday: '1st',
            weekDaysStart: '01',
            everyDaysFrom: 1,
            everyDaysStart: '01',
            everySpecificDaysOfMonth: ['01'],
            everySpecificDays: ['01'],
            everyLastWeekDaysOfTheMonth: '01',
            everyLastWeekDaysStart: 1,
            everyDaysBeforeEnd: '01',
            everyMonthFrom: 1,
            everyMonthStart: 'JAN',
            everySpecificMonth: ['JAN'],
            everyMonthBetweenStart: 'JAN',
            everyMonthBetweenEnd: 'JAN',
            everyYearsFrom: 1,
            everyYearsStart: '2019',
            everySpecificYears: ['2019'],
            everyYearsBetweenStart: '2019',
            everyYearsBetweenEnd: '2019'
        };
    }
    
    componentWillReceiveProps(nextProps, currentProps) {
        if (nextProps.tabName !== this.props.tabName) {
            this.setState({
                [ `every${nextProps.tabName}From`]: 0,
                [`every${nextProps.tabName}Start`]: 0,
                [`everySpecific${nextProps.tabName}`]: nextProps.selectFrom ? ['JAN'] : ['0'],
                [`every${nextProps.tabName}BetweenStart`]: nextProps.selectFrom ? 'JAN' : 0,
                [`every${nextProps.tabName}BetweenEnd`]: nextProps.selectFrom ? 'JAN' : 0,
                ...this.state
            });
        }
    }

    onChange(e) {
        let { value, tabName, expressionIndex, range, selectFrom, selectValueFrom } = this.props;
        let rangeSelect = range || selectValueFrom || selectFrom;
        switch (e.target.name) {
            case `every${tabName}From`:
                let start = this.state[`every${tabName}Start`];
                if (Number(e.target.value) < 0 || Number(e.target.value) > rangeSelect.length) {
                    e.target.value = 1;
                };
                if (this.props.selectValueFrom) {
                    this.state[`every${tabName}Start`] = rangeSelect.indexOf(start) + 1;
                    e.target.value = Number(e.target.value);
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}Start`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${this.state[`every${tabName}Start`]}/${e.target.value}`;
                this.state[`every${tabName}Start`] = start;
                break;
            case `every${tabName}Start`:
                if (e.target.value < 0 || e.target.value > Number(rangeSelect[rangeSelect.length - 1])) {
                    e.target.value = 1;
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}Start`, [e.target.name]: e.target.value});
                if (this.props.selectValueFrom) {
                    e.target.value = rangeSelect.indexOf(e.target.value) + 1;
                };
                value[`${expressionIndex}`] = `${e.target.value}/${this.state[`every${tabName}From`]}`;
                break;
            case 'everySpecificDays':
                if (e.target.value.length === 0) {
                    e.target.value = ['01'];
                }
                this.setState({[`selectedValue${tabName}`]: `everySpecific${tabName}`, [e.target.name]: e.target.value});
                let select = this.props.selectFrom.map(item => item.slice(0, 3).toUpperCase());
                e.target.value = e.target.value.map(el => select[Number(el) - 1]);
                value[`${expressionIndex}`] = `${e.target.value.join(',')}`;
                break;
            case `everySpecific${tabName}OfMonth`:
                if (e.target.value.length === 0) {
                    e.target.value = ['01'];
                }
                this.setState({[`selectedValue${tabName}`]: `everySpecific${tabName}Day`, [e.target.name]: e.target.value});
                value[`${expressionIndex - 2}`] = `${e.target.value.join(',')}`;
                break;
            case `everySpecific${tabName}`:
                if (e.target.value.length === 0) {
                    e.target.value = tabName === 'Month' ? ['JAN'] : (tabName === 'Years' ? ['2019'] : ['0']);
                }
                this.setState({[`selectedValue${tabName}`]: e.target.name, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${e.target.value.join(',')}`;
                break;
            case `every${tabName}BetweenStart`:
                let betweenEnd = this.state[`every${tabName}BetweenEnd`];
                if (e.target.value < 0 || e.target.value > Number(rangeSelect[rangeSelect.length - 1])) {
                    e.target.value = 1;
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}Between`, [e.target.name]: e.target.value});
                if (this.props.selectValueFrom) {
                    e.target.value = rangeSelect.indexOf(e.target.value) + 1;
                    this.state[`every${tabName}BetweenEnd`] = rangeSelect.indexOf(this.state[`every${tabName}BetweenEnd`]) + 1;
                };
                value[`${expressionIndex}`] = `${Number(e.target.value)}-${this.state[`every${tabName}BetweenEnd`]}`;
                this.state[`every${tabName}BetweenEnd`] = betweenEnd;
                break;
            case `every${tabName}BetweenEnd`:
                let betweenStart = this.state[`every${tabName}BetweenStart`];
                if (e.target.value < 0 || e.target.value > Number(rangeSelect[rangeSelect.length - 1])) {
                    e.target.value = 1;
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}Between`, [e.target.name]: e.target.value});
                if (this.props.selectValueFrom) {
                    e.target.value = rangeSelect.indexOf(e.target.value) + 1;
                    this.state[`every${tabName}BetweenStart`] = rangeSelect.indexOf(this.state[`every${tabName}BetweenStart`]) + 1;
                };
                value[`${expressionIndex}`] = `${this.state[`every${tabName}BetweenStart`]}-${Number(e.target.value)}`;
                this.state[`every${tabName}BetweenStart`] = betweenStart;
                break;
            case `everyDaysStartingOn`:
                if (Number(e.target.value) < 0 || Number(e.target.value) > rangeSelect.length) {
                    e.target.value = 1;
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}StartOn`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${Number(e.target.value)}/${Number(this.state[`every${tabName}StartFrom`])}`;
                break;
            case 'everyDaysStartFrom':
                if (Number(e.target.value) < 0 || Number(e.target.value) > rangeSelect.length) {
                    e.target.value = 1;
                };
                this.setState({[`selectedValue${tabName}`]: `every${tabName}StartOn`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${Number(this.state[`every${tabName}StartingOn`])}/${Number(e.target.value)}`;
                break;
            case 'everyLastWeekDaysOfTheMonth':
                this.setState({[`selectedValue${tabName}`]: `everyLastWeek${tabName}Start`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${Number(e.target.value)}L`;
                break;
            case 'everyDaysBeforeEnd':
                this.setState({[`selectedValue${tabName}`]: `every${tabName}BeforeEnd`, [e.target.name]: e.target.value});
                value[`${expressionIndex - 2}`] = `L-${Number(e.target.value)}`;
                break;
            case 'nearestWeekDays':
                this.setState({[`selectedValue${tabName}`]: `${tabName}Nearest`, [e.target.name]: e.target.value});
                value[`${expressionIndex - 2}`] = `${Number(e.target.value)}W`;
                break;
            case 'onDaysWeekday':
                this.setState({[`selectedValue${tabName}`]: `onThe${tabName}Weekday`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${Number(this.state[`week${tabName}Start`])}#${Number(e.target.value.slice(0, 1))}`;
                break;
            case 'weekDaysStart':
                this.setState({[`selectedValue${tabName}`]: `onThe${tabName}Weekday`, [e.target.name]: e.target.value});
                value[`${expressionIndex}`] = `${Number(e.target.value)}#${Number(this.state[`on${tabName}Weekday`].slice(0, 1))}`;
                break;
        }
        
        this.props.onChange(value);
    }

    onToggle = name => e => {
        let { value, tabName, expressionIndex, selectFrom } = this.props;
        this.setState({[`selectedValue${tabName}`]: e.target.value});
        switch (name) {
            case 'everySpecificDays':
                value[3] = '?';
                let select = selectFrom.map(item => item.slice(0, 3).toUpperCase());
                let everySpecific = this.state[`everySpecific${tabName}`].map(el => select[Number(el) - 1]);
                value[`${expressionIndex}`] = everySpecific.join(','); break;
            case `everySpecificDaysDay`:
                if (this.state.everySpecificDaysOfMonth.length === 0) {
                    value[3] = '1';
                    value[`${expressionIndex}`] = '?';
                }
                value[`${this.props.expressionIndex - 2}`] = `${this.state.everySpecificDaysOfMonth.join(',')}`;
                break;
            case 'everyLastDays':
                value[3] = 'L';
                value[`${expressionIndex}`] = '?';
                break;
            case 'everyLastWeekDays':
                value[3] = 'LW';
                value[`${expressionIndex}`] = '?';
                break;
            case 'everyLastWeekDaysStart':
                value[3] = '?';
                value[`${expressionIndex}`] = `${Number(this.state[`everyLastWeek${tabName}OfTheMonth`])}L`;
                break;
            case 'DaysBeforeEnd':
                value[3] = `L-${Number(this.state[`every${tabName}BeforeEnd`])}`;
                value[`${expressionIndex}`] = '?'; break;
            case 'DaysNearest':
                value[3] = `${Number(this.state[`nearestWeek${tabName}`])}W`;
                value[`${expressionIndex}`] = '?'; break;
            case 'onTheDaysWeekday':
                value[3] = '?';
                value[`${expressionIndex}`] = `${Number(this.state[`week${tabName}Start`])}#${Number(this.state[`on${tabName}Weekday`].slice(0, 1))}`;
                break;
            case `every${tabName}`:
                value[`${expressionIndex}`] = '*'; break;
            case `every${tabName}Start`:
                if (tabName === 'Month') {
                    let start = selectFrom.map(month => month.slice(0, 3).toUpperCase()).indexOf(this.state[`every${tabName}Start`]) + 1;
                    value[`${expressionIndex}`] = `${start}/${this.state[`every${tabName}From`]}`; break;
                } else {
                    value[`${expressionIndex}`] = `${this.state[`every${tabName}Start`]}/${this.state[`every${tabName}From`]}`; break;
                }
            case `everySpecific${tabName}`:
                value[`${expressionIndex}`] = `${this.state[`everySpecific${tabName}`].join(',')}`; break;
            case `every${tabName}Between`:
                if (tabName === 'Month') {
                    let betweenStart = selectFrom.map(month => month.slice(0, 3).toUpperCase()).indexOf(this.state[`every${tabName}BetweenStart`]) + 1;
                    let betweenEnd = selectFrom.map(month => month.slice(0, 3).toUpperCase()).indexOf(this.state[`every${tabName}BetweenEnd`]) + 1;
                    value[`${expressionIndex}`] = `${betweenStart}-${betweenEnd}`; break;
                } else {
                    value[`${expressionIndex}`] = `${this.state[`every${tabName}BetweenStart`]}-${ this.state[`every${tabName}BetweenEnd`]}`; break;
                }
            case `every${tabName}StartOn`:
                value[`${expressionIndex}`] = '?';
                value[3] = `${Number(this.state[`every${tabName}StartFrom`])}/${Number(this.state[`every${tabName}StartingOn`])}`; break;
        }
        this.props.onChange(value);
    }

    render() {
        const { classes, tabName, select, range, selectFrom, selectValueFrom} = this.props;
        let selectRange = range || selectFrom;
        return (
            <List className={classes.root}>
                <ListItem key={`every${tabName}`} dense >
                    <ListItemIcon >
                        <FormControlLabel
                            value={`every${tabName}`}
                            control={<Radio  color="primary"  checked={this.state[`selectedValue${tabName}`] === `every${tabName}`}/>}
                            onChange={this.onToggle(`every${tabName}`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Every ${tabName.toLowerCase()}`}
                    />
                </ListItem>
                <ListItem key={`every${tabName}Start`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`every${tabName}Start`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `every${tabName}Start`}/>} 
                            onChange={this.onToggle(`every${tabName}Start`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div>
                                    Every 
                                    <TextField
                                        name={`every${tabName}From`}
                                        value={this.state[`every${tabName}From`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    />
                                    {tabName.toLowerCase()}(s) {tabName === 'Days' ? 'starting on' : `starting at ${tabName.toLowerCase()}`} {} 
                                    <TextField
                                        name={`every${tabName}Start`}
                                        select={select ? true : null}
                                        value={this.state[`every${tabName}Start`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                        {select ? selectFrom.map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectFrom)[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField>
                                </div>}
                    />
                </ListItem>
                {tabName === 'Days' ? 
                    <ListItem key={`every${tabName}StartOn`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`every${tabName}StartOn`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `every${tabName}StartOn`}/>} 
                            onChange={this.onToggle(`every${tabName}StartOn`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div>
                                    Every 
                                    <TextField
                                        name={`every${tabName}StartFrom`}
                                        value={this.state[`every${tabName}StartFrom`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    />
                                    {tabName.toLowerCase()}(s) starting on the  
                                    <TextField
                                        name={`every${tabName}StartingOn`}
                                        select={select ? true : null}
                                        value={this.state[`every${tabName}StartingOn`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                        {select ? selectValueFrom.map((val, i) => (
                                            <MenuItem key={val} value={selectValueFrom[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField>
                                    of the month
                                </div>}
                    />
                </ListItem>
                : null}
                <ListItem key={`everySpecific${tabName}`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`everySpecific${tabName}`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `everySpecific${tabName}`}/>}
                            onChange={this.onToggle(`everySpecific${tabName}`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <div style={{display: 'flex', alignItems: 'center'}}>Specific {tabName.toLowerCase()} (choose one or many)
                            <FormControl  variant='outlined' >
                                <InputLabel htmlFor="select-multiple" ></InputLabel>
                                    <Select classes={{selectMenu: classes.selectMenu}}
                                        multiple
                                        disableUnderline={true}
                                        value={this.state[`everySpecific${tabName}`]}
                                        onChange={this.onChange.bind(this)}
                                        input={<Input id="select-multiple" name={`everySpecific${tabName}`} style={{marginTop: '0px'}} />} // style={{marginTop: 0, width: '117px', border: '1px solid #ddd', borderRadius: '4px'}}
                                        className={classes.textField}
                                        MenuProps={MenuProps}
                                        >
                                        {(select ? selectFrom : selectRange).map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectRange)[i]} >
                                                {val}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        }
                    />
                </ListItem>
                {tabName === 'Days' ?
                <ListItem key={`everySpecific${tabName}Day`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`everySpecific${tabName}Day`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `everySpecific${tabName}Day`}/>}
                            onChange={this.onToggle(`everySpecific${tabName}Day`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <div style={{display: 'flex', alignItems: 'center'}} >Specific day of month (choose one or many)
                                <FormControl  variant='outlined' >
                                    <InputLabel htmlFor="select-multiple"></InputLabel>
                                        <Select classes={{selectMenu: classes.selectMenu}}
                                            multiple
                                            disableUnderline={true}
                                            value={this.state[`everySpecific${tabName}OfMonth`]}
                                            onChange={this.onChange.bind(this)}
                                            input={<Input id="select-multiple" name={`everySpecific${tabName}OfMonth`} style={{marginTop: '0px'}} />}
                                            className={classes.textField}
                                            MenuProps={MenuProps}
                                            >
                                            {(select ? selectValueFrom : selectRange).map((val, i) => (
                                                <MenuItem key={val} value={selectValueFrom[i]} >
                                                    {val}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                </FormControl>
                            </div>
                        }
                    />
            </ListItem> : null}
            {tabName === 'Days' ?
                <div>
                    <ListItem key={`last${tabName}`} dense >
                        <ListItemIcon >
                            <FormControlLabel
                                value={`everyLast${tabName}`}
                                control={<Radio  color="primary"  checked={this.state[`selectedValue${tabName}`] === `everyLast${tabName}`}/>}
                                onChange={this.onToggle(`everyLast${tabName}`)}
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={`Every last day of the month`}
                        />
                    </ListItem>
                    <ListItem key={`everyLast${tabName}`} dense >
                        <ListItemIcon >
                            <FormControlLabel
                                value={`everyLastWeek${tabName}`}
                                control={<Radio  color="primary"  checked={this.state[`selectedValue${tabName}`] === `everyLastWeek${tabName}`}/>}
                                onChange={this.onToggle(`everyLastWeek${tabName}`)}
                            />
                            </ListItemIcon>
                            <ListItemText
                                primary={`Every last weekday of the month`}
                            />
                    </ListItem>
                    <ListItem key={`every${tabName}Start`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`everyLastWeek${tabName}Start`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `everyLastWeek${tabName}Start`}/>} 
                            onChange={this.onToggle(`everyLastWeek${tabName}Start`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div>
                                    On the last
                                    <TextField
                                        name={`everyLastWeek${tabName}OfTheMonth`}
                                        select={select ? true : null}
                                        value={this.state[`everyLastWeek${tabName}OfTheMonth`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                        {select ? selectFrom.map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectFrom)[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField> of the month
                                </div>}
                    />
                </ListItem>
                <ListItem key={`${tabName}BeforeEnd`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`${tabName}BeforeEnd`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `${tabName}BeforeEnd`}/>} 
                            onChange={this.onToggle(`${tabName}BeforeEnd`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div> 
                                    <TextField
                                        name={`every${tabName}BeforeEnd`}
                                        select={select ? true : null}
                                        value={this.state[`every${tabName}BeforeEnd`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textFieldBeforeEnd}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        variant="filled"
                                    >
                                        {select ? selectValueFrom.map((val, i) => (
                                            <MenuItem key={val} value={selectValueFrom[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField>{tabName.toLowerCase()} before the end of the month
                                </div>}
                    />
                </ListItem>
                <ListItem key={`${tabName}Nearest`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`${tabName}Nearest`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `${tabName}Nearest`}/>} 
                            onChange={this.onToggle(`${tabName}Nearest`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div>Nearest weekday (Monday to Friday) to the
                                    <TextField
                                        name={`nearestWeek${tabName}`}
                                        select={select ? true : null}
                                        value={this.state[`nearestWeek${tabName}`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                        {select ? selectValueFrom.map((val, i) => (
                                            <MenuItem key={val} value={selectValueFrom[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField> of the month
                                </div>}
                    />
                </ListItem>
                <ListItem key={`onThe${tabName}Weekday`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`onThe${tabName}Weekday`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `onThe${tabName}Weekday`}/>} 
                            onChange={this.onToggle(`onThe${tabName}Weekday`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                                <div>
                                    On the 
                                    <TextField
                                        name={`on${tabName}Weekday`}
                                        select={select ? true : null}
                                        value={this.state[`on${tabName}Weekday`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                    {select ? ['1st', '2nd', '3rd', '4th', '5th'].map((val, i) => (
                                            <MenuItem key={val} value={['1st', '2nd', '3rd', '4th', '5th'][i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField>
                                    <TextField
                                        name={`week${tabName}Start`}
                                        select={select ? true : null}
                                        value={this.state[`week${tabName}Start`]}
                                        onChange={this.onChange.bind(this)}
                                        type="number"
                                        className={classes.textField}
                                        InputProps={{
                                            disableUnderline: true,
                                            classes: {
                                                root: classes.textFieldRoot,
                                                input: classes.textFieldInput,
                                            }
                                        }}
                                        margin="normal"
                                        variant="filled"
                                    >
                                        {select ? selectFrom.map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectFrom)[i]} >
                                                {val}
                                            </MenuItem>
                                        )) : null}
                                    </TextField> of the month
                                </div>}
                    />
                </ListItem>
                </div>
                 :
                <ListItem key={`every${tabName}Between`} dense >
                    <ListItemIcon>
                        <FormControlLabel
                            value={`every${tabName}Between`}
                            control={<Radio color="primary" checked={this.state[`selectedValue${tabName}`] === `every${tabName}Between`}/>}
                            onChange={this.onToggle(`every${tabName}Between`)}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <div>
                                Every {tabName.toLowerCase()} between {tabName.toLowerCase()}
                                <TextField
                                    name={`every${tabName}BetweenStart`}
                                    select={select ? true : null}
                                    value={this.state[`every${tabName}BetweenStart`]}
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        classes: {
                                            root: classes.textFieldRoot,
                                            input: classes.textFieldInput,
                                        }
                                    }}
                                    margin="normal"
                                    variant="filled"
                                >
                                    {(select ? selectFrom : selectRange).map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectRange)[i]} >
                                                {val}
                                            </MenuItem>
                                        ))}
                                </TextField> and {tabName.toLowerCase()}
                                <TextField
                                    name={`every${tabName}BetweenEnd`}
                                    select={select ? true : null}
                                    value={this.state[`every${tabName}BetweenEnd`]}
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        classes: {
                                            root: classes.textFieldRoot,
                                            input: classes.textFieldInput,
                                        }
                                    }}
                                    margin="normal"
                                    variant="filled"
                                >
                                    {(select ? selectFrom : selectRange).map((val, i) => (
                                            <MenuItem key={val} value={(selectValueFrom ? selectValueFrom : selectRange)[i]} >
                                                {val}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </div>
                        }
                    />
                </ListItem>
            }
            </List>
        )
    }
}

export default withStyles(styles)(BaseTabScreen);

