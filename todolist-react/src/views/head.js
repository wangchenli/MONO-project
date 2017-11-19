import React from 'react';

class Head extends React.Component{
    
    addList(ev){
        if(ev.keyCode === 13){
            this.props.addListParent(ev.target.value)
            ev.target.value = ''
        }
    }
    
    render(){
        return (
            <header className="header">
                <h1>todos</h1>
                <input 
                    className="new-todo" 
                    placeholder="请输入内容"
                    onKeyDown={this.addList.bind(this)}                    
                />
            </header>
        )
    }
}

export default Head;