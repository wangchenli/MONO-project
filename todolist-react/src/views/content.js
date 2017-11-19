import React from 'react';
import Item from './item.js';

class Content extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data : this.props.data
        }
    }
    removeListPar(i){
        this.props.removeListParParent(i)
    }
    checkedListPar(i){
        this.props.checkedListParParent(i)
    }
    checkedAll(ev){        
        let checked = ev.target.checked;
        this.state.data.forEach((item)=>{
            item.isSelected = checked
        })
        this.setState({
            data : this.state.data
        })
    }
    editDownPro(id,text){
        this.props.editToDoTextProParent(id,text)
    }
    render(){
        let n = 0;
        this.state.data.forEach((item) => {
            if(item.isSelected){
                n++;
            }
        })
        return (
            <section className="main">
                <input 
                    className="toggle-all" 
                    type="checkbox"
                    onChange={this.checkedAll.bind(this)}
                    checked={n === this.state.data.length}
                />
                <ul className="todo-list">
                    {
                       this.props.data.map((val,index) => {
                           return <Item 
                                        key={index} 
                                        val={val} 
                                        index={index}
                                        removeListPar={this.removeListPar.bind(this)}
                                        checkedListPar={this.checkedListPar.bind(this)}
                                        //editToDoTextPro={this.editToDoTextPro.bind(this)}
                                        editDownPro={this.editDownPro.bind(this)}
                                   ></Item>
                       })
                    }
                </ul>
            </section>
        )
    }
}

export default Content;