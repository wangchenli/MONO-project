import React from 'react';
import Head from './views/head.js';
import Content from './views/content.js';
import Foot from './views/foot.js';


class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: this.props.data
        }
    }
    addListParent(val){
        let d = this.state.data;
        d.push({
            id: Math.random(),
            title: val,
            isSelected: false
        })
        this.setState({
            data : d
        })
    }
    removeListParParent(i){
        
        let d = this.state.data;
        d.splice(i,1)
        this.setState({
            data : d
        })
    }
    checkedListParParent(i){
        let d = this.state.data;
        let isChecked = d[i].isSelected;
        
        d[i].isSelected = !isChecked
        this.setState({
            data: d
        })
    }
    editToDoTextProParent(id,text){
        let obj = this.state.data.filter((item)=>{
            return item.id === id
        })
        obj[0].title = text;
        this.setState({
            data: this.state.data
        })
    }
    render(){
        let content,footer;
        let arr = this.state.data;
        let num = arr.length;
        arr.forEach((item) => {
            if(item.isSelected){
                num--
            }
        })
        if(this.state.data.length){
            content = <Content 
                        data={this.state.data}
                        removeListParParent={this.removeListParParent.bind(this)}
                        checkedListParParent={this.checkedListParParent.bind(this)}
                        editToDoTextProParent={this.editToDoTextProParent.bind(this)}
                    ></Content>
            footer = <Foot num={num}></Foot>
        }
        return (
            
            <section className="todoapp">
                <div>
                    <Head 
                        data={this.state.data}
                        addListParent={this.addListParent.bind(this)}
                    ></Head>
                    {content}
                    {footer}
                </div>
            </section>
        )
    }
};
export default App;