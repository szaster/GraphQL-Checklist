import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;
//add todos
//toggle todos

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

//delete todos
//list todos

function App() {
  const [todoText, setTodoText] = React.useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(""),
  });

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: { id, done: !done } });
    console.log("toggled todo:", data);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    //to avoid blank spaces in input
    if (!todoText.trim()) return;
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log("new todo", data);
    // setTodoText("");
  }
  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos!</div>;

  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1 ">
      <h1 className="f2-l">
        GraphQL Checklist{" "}
        <span role="img" aria-label="Checkmark">
          ✅
        </span>
      </h1>
      {/* Todo Form */}
      <form onSubmit={handleAddTodo} className="mb3">
        <input
          className="pa2 f4 b--dashed"
          type="text"
          placeholder="Write your todo"
          onChange={(event) => setTodoText(event.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-yellow" type="submit">
          Create
        </button>
      </form>
      {/* Todo List */}
      <div className="flex items-center justify-center flex-column">
        {data.todos.map((todo) => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
              {todo.text}
            </span>
            <button className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
