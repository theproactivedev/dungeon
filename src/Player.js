import React from 'react';

class Player extends React.Component {
  render() {
    return(
      <div className={this.props.status} id={this.props.id} onKeyDown={this.props.onKeyDown} tabIndex="0" ></div>
    );
  }
}

export default Player;