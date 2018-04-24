import React from 'react';

import {FormControl, FormHelperText, IconButton, withStyles} from "material-ui";
import {Check, Cancel} from "material-ui-icons";

let styles = (theme) => ({
    root:{
        width:"100%"
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
        color:theme.palette.primary.main,
        right:0
    },
    valid: {
        color:theme.palette.primary.main,
        right:18
    }
});

class Editable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            loading:false,
            error:null,
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
                this.setState({edit: false, error:null})
            } else {
                this.setState({loading: true})
                onChange(value,
                    () => { this.setState({loading: false, edit: false, error:null}) },
                    (error) => { this.setState({loading: false, error:error}); this.nativeInput.focus(); }
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
        this.setState({edit:false, value:this.props.value, error:null});
        event.stopPropagation();
    }

    onValueChange(event) {
        this.setState({value:event.target.value});
    }

    render() {
        let { render:Render, input:Input, classes } = this.props;
        let { edit, loading, value, error } = this.state;

        return edit ?
            <FormControl className={classes.root} >
                <Input value={value} onChange={this.onValueChange} onSave={this.save} onCancel={this.cancel} onClick={(event) => { event.stopPropagation() }} disabled={loading} error={!!error} onRef={this.ref} />
                { error && <FormHelperText>{error}</FormHelperText> }
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