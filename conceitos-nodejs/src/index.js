const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userFinded = users.find(user => user.username === username);

  if(!userFinded) {
    return response.status(400).json({ message: 'User not found.' });
  }
  
  request.user = userFinded;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find(user => user.username === username);

  if(userAlreadyExists) {
    return response.status(400).json({ error: 'Username already exists.' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline), 
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(td => td.id === id);

  if(!todo) {
    return response.status(404).json({ error: 'todo not found.' });
  }

  todo.title = title;
  todo.deadline = deadline;

  const todoIndex = user.todos.findIndex(td => td.id === todo.id);
  const userIndex = users.findIndex(us => us.id === user.id);

  user.todos[todoIndex] = todo;
  users[userIndex] = user;

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  
  const todo = user.todos.find(td => td.id === id);
  
  if(!todo) {
    return response.status(404).json({ error: 'todo not found.' });
  }

  todo.done = true;

  const todoIndex = user.todos.findIndex(td => td.id === todo.id);
  const userIndex = users.findIndex(us => us.id === user.id);

  user.todos[todoIndex] = todo;
  users[userIndex] = user;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
    
  const todo = user.todos.find(td => td.id === id);
  
  if(!todo) {
    return response.status(404).json({ error: 'todo not found.' });
  }
  
  const userIndex = users.findIndex(us => us.id === user.id);

  user.todos.splice(todo, 1);

  users[userIndex] = user;

  return response.status(204).send();
});

module.exports = app;