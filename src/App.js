import React, { Component } from "react"
import "./App.css"
import { compose, graphql } from "react-apollo"
import gql from "graphql-tag"

const food = [
  {
    name: "Standard",
    imageURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThIqzCh_8oA4nwN3q95kfwoY-54ytXJ-Q-5lHwztvqPyaX9lDb",
    color: "#247BA0"
  },
  {
    name: "Vegetarisch",
    imageURL:
      "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/1500912651-danielle-occhiogross-crispy-tofu-bowl-0817.jpg",
    color: "#70C1B3"
  },
  {
    name: "Fleisch",
    imageURL:
      "https://s23209.pcdn.co/wp-content/uploads/2013/08/Taco-Meal-Prep-BowlsIMG_1654edit-1-600x315.jpg",
    color: "#5D081F"
  }
]

const days = {
  "10. Nov": { selected: "Standard" },
  "11. Nov": { selected: "Vegetarisch" },
  "12. Nov": { selected: undefined },
  "13. Nov": { selected: "Fleisch" },
  "14. Nov": { selected: "Vegetarisch" },
  "15. Nov": { selected: "Standard" },
  "16. Nov": { selected: "Vegetarisch" },
  "17. Nov": { selected: undefined },
  "18. Nov": { selected: "Fleisch" },
  "19. Nov": { selected: "Vegetarisch" },
  "20. Nov": { selected: "Standard" },
  "21. Nov": { selected: "Vegetarisch" },
  "22. Nov": { selected: undefined },
  "23. Nov": { selected: "Fleisch" },
  "24. Nov": { selected: "Vegetarisch" },
  "25. Nov": { selected: "Standard" },
  "26. Nov": { selected: "Vegetarisch" },
  "27. Nov": { selected: undefined },
  "28. Nov": { selected: "Fleisch" },
  "29. Nov": { selected: "Vegetarisch" }
}

function colorFor(selected) {
  let f = food.filter(({ name }) => name === selected)
  return f.length > 0 ? f[0].color : "transparent"
}

function imageFor(selected) {
  let f = food.filter(({ name }) => name === selected)
  return f.length > 0 ? `url("${f[0].imageURL}")` : ""
}

function foodAfter(selected) {
  return selected === "Standard"
    ? "Vegetarisch"
    : selected === "Vegetarisch"
    ? "Fleisch"
    : selected === "Fleisch"
    ? undefined
    : "Standard"
}

class App extends Component {
  state = {
    ...days
  }

  nextFood = (date, selected) => {
    let newFood = foodAfter(selected)

    this.setState({
      [date]: { selected: newFood }
    })

    if (newFood) {
      this.props.orderFood({
        variables: { date, food: newFood }
      })
    } else {
      this.props.cancelFoodOrder({
        variables: { date }
      })
    }
  }

  render() {
    let {
      data: { hello }
    } = this.props

    return (
      <div className="App">
        <h2>{hello}</h2>
        <ul>
          {Object.entries(this.state).map(([date, { selected }]) => (
            <li
              key={date}
              className={selected ? "" : "empty"}
              onClick={() => this.nextFood(date, selected)}
              style={{
                backgroundColor: colorFor(selected),
                borderColor: colorFor(selected),
                backgroundImage: imageFor(selected)
              }}
            >
              <span>{date}</span>
              <span>{selected || "Nichts ausgewählt"}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default compose(
  graphql(gql`
    query {
      hello
    }
  `),
  graphql(
    gql`
      mutation orderFood($date: String!, $food: String!) {
        orderFood(date: $date, food: $food)
      }
    `,
    { name: "orderFood" }
  ),
  graphql(
    gql`
      mutation cancelFoodOrder($date: String!) {
        cancelFoodOrder(date: $date)
      }
    `,
    { name: "cancelFoodOrder" }
  )
)(App)
