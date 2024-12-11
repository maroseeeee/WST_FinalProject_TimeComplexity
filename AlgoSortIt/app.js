const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.redirect('/login?mode=signup');
});

app.get('/base', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'base.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/bubble_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Bubble_Sort.html'));
});

app.get('/bubble_sort2', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Bubble_Sort.html'));
});

app.get('/selection_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Selection_Sort.html'));
});

app.get('/insertion_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Insertion_Sort.html'));
});

app.get('/merge_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Merge_Sort.html'));
});

app.get('/quick_sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Quick_Sort.html'));
});

app.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'history.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'home.html'));
});

app.get('/sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'Sort.html'));
});

app.get('/allsort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sorts', 'allsort.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
