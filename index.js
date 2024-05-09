const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Routes

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const data = await fs.readFile('todo.json');
        const todos = JSON.parse(data);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new todo
app.post('/todos', async (req, res) => {
    try {
        const todo = req.body;
        const data = await fs.readFile('todo.json');
        const todos = JSON.parse(data);
        todos.push(todo);
        await fs.writeFile('todo.json', JSON.stringify(todos, null, 2));
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = req.body;
        const data = await fs.readFile('todo.json');
        let todos = JSON.parse(data);
        todos = todos.map(todo => (todo.id === id ? updatedTodo : todo));
        await fs.writeFile('todo.json', JSON.stringify(todos, null, 2));
        res.json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readFile('todo.json');
        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.id !== id);
        await fs.writeFile('todo.json', JSON.stringify(todos, null, 2));
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
