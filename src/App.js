import React, { Component } from 'react';
import Cell from './Cell';
import Player from './Player';
import Result from './Result';
import './App.css';

class App extends Component {
	 constructor() {
    super();
    this.state = {
      cells: [],
      rows: 40,
      cols: 60,
      playerRow: 20,
      playerCol: 15,
      player: 0,
      health: 100,
      level: 1,
      weapon: [],
      attack: 5,
      result: [],
      playing: true
    }
    
    this.initializeBoard = this.initializeBoard.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.setStateBasedOn = this.setStateBasedOn.bind(this);
    this.isWithinGrid = this.isWithinGrid.bind(this);
    this.setPlayerPosition = this.setPlayerPosition.bind(this);
    this.isCellHealth = this.isCellHealth.bind(this);
    this.movePlayer= this.movePlayer.bind(this);
    this.isCellWeapon = this.isCellWeapon.bind(this);
    this.attackPlayer = this.attackPlayer.bind(this);
    this.battle = this.battle.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.setResults = this.setResults.bind(this);
    this.isTheBossDead = this.isTheBossDead.bind(this);
    this.setCellsPosition = this.setCellsPosition.bind(this);
  }
  
  resetGame() {
    this.setState({
      playerRow: 20,
      playerCol: 15,
			player: 0,
      health: 100,
      level: 1,
      weapon: [],
      attack: 5,
      result: [],
      playing: true
    }, function() {
			this.initializeBoard();
		});
  }
  
  setStateBasedOn(num) {
    var state = "";
    if (num < 0.8) {
      state = "space";
    } else if (num < 0.97) {
      state = "barrier"
    } else if (num < 0.98) {
      state = "weapon";
    } else if (num < 0.99) {
      state = "health";
    } else {
      state = "enemy";
    }
    
    return "cell " + state + "";
  }
 
  initializeBoard() {
    console.log("Is this happening?");
    var board = [];
    var count = -1;
    for (var r = 0; r < this.state.rows; r++) {
      var row = [];
      for (var c = 0; c < this.state.cols; c++) {
        var num = Math.random();
        var state = this.setStateBasedOn(num);
        var ID = ++count;

        if (r === 20 && c === 15) {
          state = "cell player";
          this.setState({
            player: ID
          });
        }
        if ((r === 20 && c === 14) || (r === 4 && c === 53)) {
          state = "cell space";
        }
        if (r === 4 && c === 54) {
          state = "cell enemy boss";
        }
        
        var cell = {
          id: ID,
          status: state,
          life: 100,
          forKey: num
        };
        row.push(cell);
      }
      board.push(row);
    }
    this.setState({cells: board});
    // this.renderCells(board);
  }
  
  isWithinGrid(r, c) {
    return r  >= 0 && r < this.state.rows && c >= 0 && c < this.state.cols;
  }
  
  setPlayerPosition(r, c, identification) {
    this.setState({
      playerRow: r,
      playerCol: c,
      player: identification
    });
    document.getElementById(identification).focus();
  }
  
  isCellHealth(r, c) {
    var board = this.state.cells;
    if (board[r][c].status === "cell health") {
      var energy = this.state.health + 20;
      this.setState({health: energy});
    }
  }
  
  isCellWeapon(r, c) {
    var board = this.state.cells;
    var items = [
      {
        item: "sword",
        damage: 4   
      },
      {
        item: "shield",
        damage: 3
      },
      {
        item: "armor",
        damage: 3
      },
      {
        item: "gun",
        damage: 5  
      },
      {
        item: "bow and arrow",
        damage: 5
      }
    ];
    if (board[r][c].status === "cell weapon") {
      var item = Math.floor(Math.random() * 4);
      var weapons = this.state.weapon;
      weapons.push(items[item].item);
      var damage = this.state.attack + items[item].damage;
      this.setState({weapon: weapons, attack: damage});
    }
  }
  
  attackPlayer(r, c) {
    var board = this.state.cells;
    var damage = 0;
    if (board[r][c].status === "cell enemy boss") {
      damage = 25;
    } else {
      damage = Math.floor(Math.random() * (15 - 7 + 1)) + 7;
    }
    var life = this.state.health - damage;
    if (life < 0) {
      life = 0;
      this.setResults(["Sorry. You lost"], false, 0);
    }
    this.setState({
      health: life
    });
  }
  
  battle(r, c) {
    var board = this.state.cells;
    
    if (board[r][c].life > 0) {
      board[r][c].life -= this.state.attack;
      if (board[r][c].life > 0) {
        this.attackPlayer(r, c);
      }
    }
  }
      
  setCellsPosition(row, col, origRow, origCol) {
    var board = this.state.cells;
    board[row][col].status = "cell player";
    board[origRow][origCol].status = "cell space";
    var id = board[row][col].id;
    this.setPlayerPosition(row, col, id);
  }
  
  setResults(outcome, isPlaying, lvl) {
    this.setState({
      result: outcome,
      playing: false,
      level: this.state.level + lvl
    });
  }
  
  isTheBossDead(state) {
    if (state === "cell enemy boss") {
      this.setResults(["Congratulaions! You win!"], false, 2);
    } else {
      this.setState({level: this.state.level + 2});
    }
  }
  
  movePlayer(row, col, origRow, origCol) {
    var board = this.state.cells;
    if (this.isWithinGrid(row, col)) {
      var status = board[row][col].status;
      if (status === "cell space" || status === "cell health" || status === "cell weapon") {
        this.isCellHealth(row, col);
        this.isCellWeapon(row, col);
        this.setCellsPosition(row, col, origRow, origCol);
      } else if (board[row][col].status === "cell barrier") {
        
      } else {
        this.battle(row, col);
        if (board[row][col].life < 1) {
          var temp = board[row][col].status;
          this.isTheBossDead(temp);
          this.setCellsPosition(row, col, origRow, origCol);
        }
      }
    }
  }
  
  handleKeyPress(event) {
    var row, col;
    if (event.keyCode === 37) {
      // move left
      row = this.state.playerRow;
      col = this.state.playerCol - 1;
    } else if (event.keyCode  === 38) {
      // move up
      row = this.state.playerRow - 1;
      col = this.state.playerCol;
    } else if (event.keyCode === 39) {
      // move right
      row = this.state.playerRow;
      col = this.state.playerCol + 1;
    } else if (event.keyCode === 40) {   
      // move down
      row = this.state.playerRow + 1;
      col = this.state.playerCol;
    } else {
      console.log(event.keyCode);
      event.preventDefault();
    }
    this.movePlayer(row, col, this.state.playerRow, this.state.playerCol);
    // document.getElementById(this.state.player).focus();
  }
  
  componentWillMount() {
    this.initializeBoard();
  }
  
  componentDidMount() {
    var id = this.state.player;
    document.getElementById(id).focus();
  }
  
  componentDidUpdate() {
    var id = this.state.player;
    document.getElementById(id).focus();
  }
  
  render() {
    var board = this.state.cells;
    const cells = [];
    for (var r = 0; r < this.state.rows; r++) {
      var row = [];
      for (var c = 0; c < this.state.cols; c++) {
        var obj = board[r][c];
        var cell;
        if (obj.status === "cell player") {
          cell = (
            <Player key={obj.forKey} id={obj.id} status={obj.status} onKeyDown={this.handleKeyPress} />
          );
        } else {
          cell = (
            <Cell key={obj.forKey} id={obj.id} status={obj.status} />
          );
        }
        
        row.push(cell);
      }
      cells.push(row);
    }
    return (
      <div>
        {!this.state.playing &&
          <div>
            <Result result={this.state.result} reset={this.resetGame} />
          </div>       
        }
        <div className="properties">
          <p>Health: {this.state.health}</p>
          <p>Level: {this.state.level}</p>
          <p>Attack: {this.state.attack}</p>
          <p>Weapon: {this.state.weapon.toString()}</p>
        </div>
        <div className="board">
          {cells}
        </div>
      </div>
      
    );
  }
}

export default App;
