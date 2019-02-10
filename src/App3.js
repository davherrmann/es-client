import React from "react"
import "./App3.css"
import caterer from "./caterer.json"

class App extends React.Component {
  state = {
    items: []
  }

  changeStepItems = ({ target: { value } }) => {
    this.setState({
      items: value ? value.split(" ") : []
    })
  }

  render() {
    let { items } = this.state

    return (
      <div className="app">
        <h2>Neues Menü</h2>
        <label>
          <span>Name</span>
          <input />
        </label>
        <label>
          <span>Preis</span>
          <input />
        </label>
        <label>
          <span>Enthalten</span>
          <input onChange={this.changeStepItems} style={{ width: "30em" }} />
        </label>
        <ul>
          {items
            .flatMap(item =>
              Object.entries(caterer.food).filter(
                ([id, food]) =>
                  id === item || (food.classes && food.classes.includes(item))
              )
            )
            .map(([_, food], i) => (
              <li key={i}>
                <label>
                  <input type="radio" />
                  <span>{food.name}</span>
                </label>
              </li>
            ))}
        </ul>
      </div>
    )
  }
}

export default App
