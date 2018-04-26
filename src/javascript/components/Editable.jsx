import React from 'react';

import {FormControl, FormHelperText, IconButton, withStyles, Input} from "material-ui";
import {Check, Cancel} from "material-ui-icons";

let styles = (theme) => ({
    root:{
        width:"calc(100% + 130px)",
		zIndex: '9'
    },
	errorContainer: {
		right: '33px',
		color: 'red',
		position: 'absolute',
		background: 'white',
		height: '100%',
		top: '0',
		margin: '0',
		zIndex: '99',
		padding: '11px 5px 11px 11px',
		boxSizing: 'border-box',
		"&:hover message": {
			display: 'block'
		},
		"& error": {
        },
        "& message": {
			top: '24px',
			left: '-50%',
			width: '280px',
			display: 'none',
			padding: '9px',
			zIndex: '9',
			position: 'absolute',
			background: 'blue',
			border: '1px solid red',
			boxShadow: '0px 0px 10px 2px rgba(38, 38, 38, 0.7)',
			borderRadius: '6px',
        },
        "& label": {
        }
	},
    button:{
        height:18,
        width:18,
        position:"absolute",
        top:4,
        transform:"scale(0.75)",
        "&:hover": {
            backgroundColor:"inherit"
        }
    },
    cancel: {
        color:'red',
        right:'10px',
		top: '7px'
    },
    valid: {
		color:'green',
		right:'32px',
		top: '7px'
    },
    textInput: {
        color: "inherit",
        fontSize: "inherit",
        width: "100%"
    }
});

class Editable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            loading:false,
            errorLabel:null,
            errorMessage:null,
            value:props.value
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.ref = this.ref.bind(this);
    }

    setEdit(event, edit) {
        let {onChange} = this.props;
        let {value} = this.state;
        if (!edit) {
            if (onChange.length === 1) {
                onChange(value);
                this.setState({edit: false,  errorLabel:null, errorMessage:null});
            } else {
                this.setState({loading: true});
                onChange(value,
                    () => { this.setState({loading: false, edit: false,  errorLabel:null, errorMessage:null}) },
                    (errorLabel, errorMessage) => { this.setState({loading: false, errorLabel:errorLabel, errorMessage:errorMessage}); this.nativeInput.focus(); }
                );
            }
        } else {
            this.setState({edit:true});
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
        this.setState({edit:false, value:this.props.value, errorLabel:null, errorMessage:null});
        event.stopPropagation();
    }

    onValueChange(event) {
        this.setState({value:event.target.value, errorLabel:null, errorMessage:null});
    }

    render() {
        let { render:Render,classes } = this.props;
        let { edit, loading, value, errorLabel, errorMessage } = this.state;

        return edit ?
            <FormControl className={classes.root} >

                <Input value={value}
                       onChange={this.onValueChange}
                       onClick={(e)=>e.stopPropagation()}
                       disabled={loading}
                       onBlur={this.save}
                       error={!!errorLabel}
                       onKeyUp={(e)=>{if (e.key === 'Enter') { this.save(e) } else if (e.key === 'Escape') { this.cancel(e) } }}
                       classes={{root:classes.textInput}} inputRef={this.ref}/>

                { errorLabel && <FormHelperText className={classes.errorContainer}><error><label>{errorLabel}</label><message>{errorMessage}</message></error></FormHelperText> }
                <IconButton className={classes.button + " " + classes.valid} component="span" disableRipple onClick={this.save}>
                    <Check />
                </IconButton>
                <IconButton className={classes.button + " " + classes.cancel} component="span" disableRipple onClick={this.cancel}>
                    <Cancel />
                </IconButton>
            </FormControl> :
            <div onClick={(event) => this.setEdit(event,true)}><Render value={value} {...this.props} /></div>
    }


}

Editable = withStyles(styles)(Editable);

export {Editable}
