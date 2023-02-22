import { Suspense } from "react";

type TodoListType = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}[];

async function getData(): Promise<{
  todos: TodoListType;
}> {
  const res = await fetch("https://dummyjson.com/todos");

  return res.json();
}

const TodoList = ({ list }: { list: TodoListType }) => {
  console.log(list);
  return (
    <div>
      <ul>
        {list.map(({ todo, id }) => (
          <p key={id}>{todo}</p>
        ))}
      </ul>
    </div>
  );
};

export default async function TodoPage() {
  const todoList = await getData();

  return (
    <div>
      <Suspense fallback={<p>Loading feed...</p>}>
        <TodoList list={todoList.todos} />
      </Suspense>
    </div>
  );
}
