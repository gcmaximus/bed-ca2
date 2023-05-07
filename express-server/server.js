//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const app = require('./controller/app')
const port = 8081

app.listen(port, function() {
    console.clear()
    console.log(`Server started on port ${port}`)
})