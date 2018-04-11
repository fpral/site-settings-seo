import React from 'react';

class Editable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            loading:false,
            value:props.value
        };
        this.onValueChange = this.onValueChange.bind(this);
    }

    setEdit(event, edit) {
        let {onChange} = this.props;
        let {value} = this.state;
        if (!edit) {
            if (onChange.length === 1) {
                onChange(value);
                this.setState({edit: false})
            } else {
                onChange(value, () => { this.setState({loading: false, edit: false})} );
                this.setState({loading: true})
            }
        } else {
            this.setState({edit:true});
        }
        event.stopPropagation();
    }

    onValueChange(event) {
        this.setState({value:event.target.value});
    }

    render() {
        let Render = this.props.render;
        let Input = this.props.input;
        let { edit, loading, value } = this.state;

        return edit ?
            <Input value={value} onChange={this.onValueChange} onSave={(event) => this.setEdit(event,false)} onClick={(event) => { event.stopPropagation() }} disabled={loading}/> :
            <div onClick={(event) => this.setEdit(event,true)}><Render value={value} {...this.props} /></div>
    }


}

export {Editable}