import React, { Component } from 'react'
import './App.css'

interface IAppProps {}
interface IAppState {
  cellItems : string[],
  moves : Imove[],
  curState : (string | null) [],
  currentMove : number
}
interface Imove {
  position : number,
  icon : string
}
interface ICellProps {
  cellId : number,
  cellItem : string | null,
  onCellClick : (cellId : number) => void
}
interface IBoardProps {
  currentMove : number,
  cellItems : string[],
  onMove : (move : Imove) => void
}
interface IBoardStates {
  activePlayer : number,
  winner : string | null,
  draw : boolean,
  message : string

}

class Cell extends React.Component<ICellProps> {
  constructor(props : ICellProps) {
    super(props);
  }
  render() {
    return (
      <div
        className={`cell ${this.props.cellItem==null && 'clickable'}`}
        onClick={() => this.props.onCellClick(this.props.cellId)}
      >
          {this.props.cellItem}
      </div>
    );
  }
}


class Board extends React.Component<IBoardProps, IBoardStates> {
  getWinner(){
    
    const {cellItems} = this.props;
    
    for(let i = 0; i < 3; i++) {
      if(cellItems[i] && cellItems[i] == cellItems[3 + i] && cellItems[i] == cellItems[6 + i]) return cellItems[i];
    }
    for(let i = 0; i < 9; i+=3) {
      if(cellItems[i] && cellItems[i] == cellItems[1 + i] && cellItems[i] == cellItems[2 + i]) return cellItems[i];
    }
    if(cellItems[4] && cellItems[4 - 4] == cellItems[4] && cellItems[4] == cellItems[4 + 4]) return cellItems[4];
    if(cellItems[4] && cellItems[4 - 2] == cellItems[4] && cellItems[4] == cellItems[4 + 2]) return cellItems[4];
    return null;
  }
  constructor(props : IBoardProps) {
    super(props);
    const activePlayer = props.currentMove % 2;
    const winner = this.getWinner();
    const draw = winner ? false : props.currentMove == 9;
    const message = winner ? `Winner is : ${winner}` : draw ? 'Match Drawn' : `Next player : ${activePlayer ? 'X' : 'O'}`
    
    this.state = {
      activePlayer : activePlayer,
      winner : winner,
      draw : draw ,
      message : message,
    }
  }
  componentDidUpdate(prevProps: Readonly<IBoardProps>, prevState: Readonly<IBoardStates>, snapshot?: any): void {
      if(this.props !== prevProps) {

        const activePlayer = this.props.currentMove % 2;
        const winner = this.getWinner();
        const draw = winner ? false : this.props.currentMove == 9;
        const message = winner ? `Winner is : ${winner}` : draw ? 'Match Drawn' : `Next player : ${activePlayer ? 'X' : 'O'}`
        
        this.setState({
          activePlayer,
          winner,
          draw,
          message
        })        
      }
  }
  onCellClick(cellId : number){    
    if(this.props.cellItems[cellId] || this.state.winner) return;
    this.props.onMove({position : cellId, icon : this.state.activePlayer ? 'X' : 'O'});
  }
  renderCell(cellId : number) {    
    return (
      <Cell 
        cellId={cellId} 
        cellItem={this.props.cellItems[cellId]}
        onCellClick={this.onCellClick.bind(this)} 
      />
    )
  }
  renderRow(rowId : number) {
    return (
      <div className='row'>
        {this.renderCell(rowId * 3)}
        {this.renderCell(rowId * 3 + 1)}
        {this.renderCell(rowId * 3 + 2)}
      </div>
    )

  }
  render() {    
    return (
      <div className='board-container'>
        {this.state.message}
        <div className='board'>
          {this.renderRow(0)}
          {this.renderRow(1)}
          {this.renderRow(2)}
        </div>
      </div>
    );
  }
}


export default class App extends Component<IAppProps, IAppState> {
  constructor(props : IAppProps){
    super(props);
    this.state = {
      cellItems : Array(9).fill(null),
      moves : [],
      curState : Array(9).fill(null),
      currentMove : 0
    }
  }
  onMove(move : Imove){    
    this.setState({moves : [...this.state.moves.splice(0, this.state.currentMove ), move]}) 
    this.setState({currentMove : this.state.currentMove + 1}) 
  }
  goBackTo(target : number){
    this.setState({currentMove : target}) 
  }
  componentDidUpdate(prevProps: Readonly<IAppProps>, prevState: Readonly<IAppState>, snapshot?: any): void {
      if(this.state.currentMove !== prevState.currentMove){
        let tState = Array(9).fill(null);
        for(let i = 0; i < this.state.currentMove; i++) {
          const {position, icon} = this.state.moves[i];
          tState[position] = icon;
        }
        this.setState({cellItems : tState})        
      }
  }
  render() {
    return (
      <div className='game'>
        <Board 
          currentMove={this.state.currentMove} 
          cellItems={this.state.cellItems}
          onMove={this.onMove.bind(this)}
        />
        <ol className="history">
          <li key={0}><button onClick={() => this.goBackTo(0)}>{`Go to game start`}</button></li>
          {this.state.moves.map( (element, key) => {          
            return <li key={key + 1}><button onClick={() => this.goBackTo(key + 1)}>{`Go to move # ${key + 1}`}</button></li>
          })}
        </ol>
      </div>
    )
  }
}