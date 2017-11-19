import React from 'react';

class Foot extends React.Component{
    render(){
        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>{this.props.num}</strong>
                    <span>条未选中</span>
                </span>
            </footer>
        )
    }
}

export default Foot;