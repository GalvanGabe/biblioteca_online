const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/insertbook', (req, res) => {
    res.render('insertbook')
})

app.post('/books/insertbook', (req, res) => {
    
    const title = req.body.title
    const author = req.body.author
    const genre = req.body.genre
    const language = req.body.language
    const pageqty = req.body.pageqty
    const rating = req.body.rating

    const sql = `INSERT INTO books (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)`
    const data = ['title', 'author', 'genre', 'language', 'pageqty', 'rating', title, author, genre, language, pageqty, rating]

    pool.query(sql, data, function(err) {
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books"

    pool.query(sql, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const books = data

        //console.log(books)

        res.render('books', {books})
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`

    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render('book', {book})
    })
})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`

    const data = ['id', id]

    pool.query(sql, data, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', {book})
    })
})

app.post('/books/updatebook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const author = req.body.author
    const genre = req.body.genre
    const language = req.body.language
    const pageqty = req.body.pageqty
    const rating = req.body.rating

    const sql = `UPDATE books SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'author', author, 'genre', genre, 'language', language, 'pageqty', pageqty, 'rating', rating, 'id', id]

    pool.query(sql, data, function(err) {
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`

    const data = ['id', id]

    pool.query(sql, data, function(err) {
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)