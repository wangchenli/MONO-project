import React from 'react';

class Item extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isEdit : false,
            editText : this.props.val.title
        }
    }
    removeList(){
        this.props.removeListPar(this.props.index)
    }
    checkedList(){
        this.props.checkedListPar(this.props.index)
    }
    editFn(){//编辑内容
        this.beforeText = this.state.editText
        this.setState({
            isEdit : true
        },()=>{
            this.input.focus()
        })
    }
    editToDoText(ev){  //编辑内容
        this.setState({
            editText : ev.target.value
        })
        this.props.editDownPro(this.props.val.id,ev.target.value)
    }
    editBlur(){ //失去焦点
        this.setState({
            isEdit : false
        })
    }
    editDown(ev){ //按下键
        if(ev.keyCode === 27){
            this.setState({
                isEdit : false
            })
            this.props.editDownPro(this.props.val.id,this.beforeText)
        }else if(ev.keyCode === 13){
            this.editBlur()
        }
    }
    render(){
        let a = this.props.val.isSelected ? 'completed' : '';
        let editing = this.state.isEdit ? 'editing' : '';
        return (
            <li className={a + ' ' + editing}>
                <div className="view">
                    <input 
                        className="toggle" 
                        type="checkbox" 
                        checked={this.props.val.isSelected ? 'checked' : ''} 
                        onChange={this.checkedList.bind(this)}
                    />
                    <label
                        onDoubleClick={this.editFn.bind(this)}
                    >{this.props.val.title}</label>
                    <button 
                        className="destroy"
                        onClick={this.removeList.bind(this)}
                    ></button>
                </div>
                <input 
                    ref={(input)=>{this.input = input}}
                    className="edit"
                    value={this.state.editText}
                    onChange={this.editToDoText.bind(this)}
                    onKeyDown = {this.editDown.bind(this)}
                    onBlur = {this.editBlur.bind(this)}
                /> 
            </li>
        )
        
    }
}

export default Item;
//li className="completed"