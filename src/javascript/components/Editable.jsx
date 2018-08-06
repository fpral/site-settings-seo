import React from 'react';
import {FormControl, FormHelperText, IconButton, withStyles, Input, InputAdornment, Tooltip} from "@material-ui/core";
import {Check, Clear} from "@material-ui/icons";

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    button: {
        height: 18,
        width: 18,
        transform: 'scale(0.75)',
        '&:hover': {
            backgroundColor: 'inherit'
        }
    },
    cancel: {
        color:'red'
    },
    valid: {
		color:'green'
    }
});

class Editable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            loading: false,
            errorLabel: null,
            errorMessage: null,
            value: props.value
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.ref = this.ref.bind(this);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // render only if the edit state change or edit is active
        return this.state.edit !== nextState.edit ||  this.state.edit;
    };

    setEdit(event, edit) {
        let {onChange, onEdit} = this.props;
        let {value} = this.state;
        if (!edit) {
            if (onChange.length === 1) {
                onChange(value);
                this.setState({edit: false,  errorLabel:null, errorMessage:null}, () => onEdit(this.state.edit));
            } else {
                this.setState({loading: true});
                onChange(value,
                    () => { this.setState({loading: false, edit: false,  errorLabel:null, errorMessage:null}, () => onEdit(this.state.edit)) },
                    (errorLabel, errorMessage) => {  this.setState({loading: false, errorLabel:errorLabel, errorMessage:errorMessage}); this.nativeInput.focus(); }
                );
            }
        } else {
            this.setState({edit:true}, () => onEdit(this.state.edit));
        }
        event.stopPropagation();
    }

    ref(input) {
        this.nativeInput = input;

        if (input) {
            input.focus();
        }
    }

    save(event) {
        this.setEdit(event,false);
        event.stopPropagation();
    }

    cancel(event) {
        const {value, onEdit} = this.props;
        this.setState({edit:false, value:value, errorLabel:null, errorMessage:null}, () => onEdit(this.state.edit));
        event.stopPropagation();
    }

    onValueChange(event) {
        this.setState({value:event.target.value, errorLabel:null, errorMessage:null});
    }

    render() {
        let { render:Render, classes } = this.props;
        let { edit, loading, value, errorLabel, errorMessage } = this.state;

        return edit ?
            <FormControl className={classes.root} >
                <Input value={value}
                       onChange={this.onValueChange}
                       onClick={(e)=> {e.stopPropagation()}}
                       disabled={loading}
                       onBlur={this.save}
                       error={!!errorLabel}
                       onKeyUp={(e)=>{if (e.key === 'Enter') { this.save(e) } else if (e.key === 'Escape') { this.cancel(e) } }}
                       inputRef={this.ref}
                       endAdornment={
                           <InputAdornment position={'end'}>
                               <IconButton className={classes.button + " " + classes.valid} disableRipple onClick={this.save}>
                                   <Check />
                               </IconButton>
                               <IconButton className={classes.button + " " + classes.cancel} disableRipple onClick={this.cancel}>
                               <Clear />
                               </IconButton>
                           </InputAdornment>
                       }/>
                { (errorLabel && errorMessage) ?
                    <Tooltip title={errorMessage}>
                        <FormHelperText error={true}>{errorLabel}</FormHelperText>
                    </Tooltip>
                : null}
            </FormControl>
            : <div onClick={(event) => {this.setEdit(event, true);}}>
                <Render value={value} {...this.props} />
            </div>
    }


}

Editable = withStyles(styles)(Editable);

export {Editable}
