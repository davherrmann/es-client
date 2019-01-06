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
  nextFood = (date, selected) => {
    let newFood = foodAfter(selected)

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
      data: { orders = [] }
    } = this.props

    console.log(orders)

    return (
      <div className="App">
        <h2>Essen</h2>
        <ul>
          {orders.map(({ date, food }) => (
            <li
              key={date}
              className={food ? "" : "empty"}
              onClick={() => this.nextFood(date, food)}
              style={{
                backgroundColor: colorFor(food),
                borderColor: colorFor(food),
                backgroundImage: imageFor(food)
              }}
            >
              <span>{date}</span>
              <span>{food || "Nichts ausgewählt"}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default compose(
  graphql(gql`
    query getOrders {
      orders {
        date
        food
      }
    }
  `),
  graphql(
    gql`
      mutation orderFood($date: String!, $food: String!) {
        orderFood(date: $date, food: $food)
      }
    `,
    { name: "orderFood", options: { refetchQueries: ["getOrders"] } }
  ),
  graphql(
    gql`
      mutation cancelFoodOrder($date: String!) {
        cancelFoodOrder(date: $date)
      }
    `,
    { name: "cancelFoodOrder", options: { refetchQueries: ["getOrders"] } }
  )
)(App)
