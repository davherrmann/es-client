import React from "react"
import caterer from "./caterer.json"
import "./App2.css"

// good image search:
// https://www.google.com/search?q=site:www.mcdonalds.nl&rlz=1C1CHBF_deDE827DE827&biw=1540&bih=1329&tbm=isch&source=lnt&tbs=isz:ex,iszw:800,iszh:596

function insert(steps, newSteps, n) {
  return [...steps.slice(0, n), ...newSteps, ...steps.slice(n)]
}

function replace(steps, changedStep, n) {
  return [...steps.slice(0, n), changedStep, ...steps.slice(n + 1)]
}

class App extends React.Component {
  state = {
    n: 0,
    steps: caterer.menus["mcmenü"].steps
  }

  select = ({ target: { value: selected } }) => {
    this.setState(
      ({ steps, n }) => ({
        steps: replace(steps, { ...steps[n], selected }, n)
      }),
      () => this.next()
    )
  }

  previous = () => {
    this.setState(({ steps, n }) => {
      let step = steps[n - 1]
      let food = caterer.food[step.selected]
      let deleteNSteps = food.next ? food.next.length : 0

      return deleteNSteps > 0
        ? {
            n: n - 1,
            steps: [...steps.slice(0, n), ...steps.slice(n + deleteNSteps)]
          }
        : {
            n: n - 1,
            steps: replace(steps, { ...steps[n], selected: undefined }, n)
          }
    })
  }

  next = () => {
    this.setState(({ steps, n }) => {
      let step = steps[n]
      let food = caterer.food[step.selected]

      // return if no more steps
      if (this.state.n >= this.state.steps.length - 1 && !food.next) {
        return
      }

      // step into food steps if available
      return food.next
        ? {
            n: n + 1,
            steps: insert(steps, food.next, n + 1)
          }
        : { n: n + 1 }
    })
  }

  render() {
    let food = caterer.food || {}
    let { steps, n } = this.state
    let step = steps[n]
    let selected = step.selected
    let items = step.items || []

    let allItems = item =>
      item.id
        ? [{ key: item.id, ...food[item.id] }]
        : Object.entries(food)
            .filter(
              ([_, { classes = [] }]) =>
                classes.includes(item.class) || item.class === "*"
            )
            .map(([key, food]) => ({ key, ...food }))

    return (
      <div className="app">
        <h2>{step.name || "Ende"}</h2>
        <div className="buttons">
          <button disabled={n === 0} onClick={this.previous}>
            Zurück
          </button>
        </div>
        <p className="selection">
          Ausgewählt:{" "}
          {steps
            .filter(({ selected }) => selected)
            .map(({ selected }) => caterer.food[selected].name)
            .join(", ")}
        </p>
        <ul>
          {items
            .reduce((all, item) => [...all, ...allItems(item)], [])
            .map((item, i) => (
              <li key={i}>
                <label>
                  <input
                    type="radio"
                    name={step.name}
                    value={item.key}
                    onClick={this.select}
                    checked={!!selected && selected === item.key}
                  />
                  <span
                    style={{
                      backgroundImage: `url("${item.imgURL}")`
                    }}
                  >
                    {item.name}
                  </span>
                </label>
              </li>
            ))}
        </ul>
      </div>
    )
  }
}

export default App
