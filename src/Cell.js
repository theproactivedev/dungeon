import React from 'react';

class Cell extends React.Component {
  render() {
    return (
      <div className={this.props.status} id={this.props.id} ></div>
    );
  }
}

export default Cell;