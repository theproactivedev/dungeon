import React from 'react';

class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      opacity: 1
    }
  }
  
  handleClick(event) {
    event.preventDefault();
    this.setState({opacity: 0}, () => setTimeout(() => this.setState({opacity:0}),4000));
    this.props.reset();
  }
  
  render() {
    return (
      <div style={{opacity: this.state.opacity, transition: "opacity 1s"}} className="msg"  onClick = {this.handleClick.bind(this)}>
        <p>{this.props.result}</p>
      </div>
    );
  }
}

export default Result;