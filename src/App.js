import React from "react"
import { nanoid } from "nanoid"
import "./App.css"
import Todo from "./components/todo"
export default function App() {

  let [todos, setTodos] = React.useState(() => JSON.parse(localStorage.getItem("todos")) || [])
  let [input, setInput] = React.useState("")
  let [msg, setMsg] = React.useState("")
  let [updating, setUpdating] = React.useState(false)
  let [selectedTodo, setSelectedTod] = React.useState({})


  React.useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])


  function handleChange(e) {
    const { value } = e.target
    if (updating) {
      setSelectedTod(preTodo => {
        return {
          ...preTodo,
          content: value
        }
      })
    } else {
      setInput(value)
    }
  }



  function handleSubmit(e) {
    e.preventDefault()
    if (updating) {
      if (selectedTodo.content === "") {
        setMsg("Please Enter the update")
      } else {
        setMsg("")
        setTodos(preTodos => {
          return preTodos.map(todo => {
            return todo.id === selectedTodo.id ? { ...todo, content: selectedTodo.content } : todo
          })
        })
        setSelectedTod({})
        setUpdating(false)
      }
    } else {
      if (input === "") {
        setMsg("Please Enter something")
      } else {
        setMsg("")
        setTodos(preTodos => {
          return [
            ...preTodos, { id: nanoid(), content: input }
          ]
        })
        setInput("")
      }
    }
  }
  function deleteTodo(id) {
    let newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
    setMsg("")
  }





  function updateTodo(id) {
    setUpdating(true)
    for (let index = 0; index < todos.length; index++) {
      const todo = todos[index];
      if (todo.id === id) {
        setSelectedTod({ id: todo.id, content: todo.content })
      }
    }
  }


  let todoList = todos.map((todo => <Todo
    key={todo.id}
    content={todo.content}
    delete={() => deleteTodo(todo.id)}
    update={() => updateTodo(todo.id)}
  />))

  return (
    <div className="con">
      {msg && <div className="error">{msg}</div>}
      <div className="app">
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add something to do"
            onChange={handleChange}
            value={updating ? selectedTodo.content : input}
          />
          <button>{updating ? "Update" : "Add"}</button>
        </form>
        <div className="todos">
          {todos.length === 0 ?
            <h3 style={{ color: "rgb(255, 184, 85)" }}>You have Noting to do, Add a todo !</h3>
            : todoList
          }
        </div>
      </div>
    </div>
  )
}