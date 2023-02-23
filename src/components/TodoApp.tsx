import  { useState, useCallback, useEffect } from 'react';

import { withTracing, reportSpan, getTracer } from '../utilities/tracing';

import TodoItem, { TodoItemType } from './TodoItem';
import TodoInput from './TodoInput';

import './Todo.css';

const PLACEHOLDER = [
  { title: 'Feed myself' },
  { title: 'Take a walk'},
  { title: 'Call mom'},
  { title: 'Buy food'},
];


const tracer = getTracer();

function TodoApp() {
  const [todos, setTodos] = useState<TodoItemType[]>(PLACEHOLDER);
  const [parentSpan, setParentSpan] = useState<any>(null);

  const createTodo = useCallback(
    async (todo:any) => {
      const rootSpan = tracer.startSpan('TodoApp-Profiling');
      await withTracing(
        `createTodo: ${todo}`,
        async () => {
          const newTodos = [
            { title: todo },
            ...todos
          ];
          await setTodos(newTodos);
        },
        rootSpan,
      );
      // this should be after withTracing because we want to run the useEffect hook after callback finished.
      await setParentSpan(rootSpan);


      const profileTrace = 'First Time load';

      reportProfilerTrace(profileTrace);
    },
    [todos, setTodos, setParentSpan]
  )

  const submitTodo = useCallback(
    (title: string, index: number) => {
      const newTodos = [
        ...todos.slice(0, index),
        { title },
        ...todos.slice(index + 1)
      ]
      setTodos(newTodos);
    },
    [setTodos, todos]
  )

  useEffect(() => {
    if (parentSpan) {
      parentSpan.end();
      reportSpan(parentSpan);
    }
  }, [parentSpan]);

  return (
    <div className="todo-app flex-column-center">
      <div className="title">My Todos</div>
      <TodoInput createTodo={createTodo} />
      <div>
        {todos.map((todo, index) => {
          return (
            <TodoItem
              key={`${todo.title}-${index}`}
              index={index}
              submitTodo={submitTodo}
              rootSpan={parentSpan}
              {...todo} />
          )
        })}
      </div>
    </div>
  );
}

function reportProfilerTrace(trace: any) {
  console.log('profile Trace:', trace);
}

export default TodoApp;
