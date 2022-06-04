const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3031

const cors = require('cors')
const path = require('path')
const http = require('http').createServer(app)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.get('/api/', (req, res) => {
 console.log(req.query.url, 'AMIT est')
 var dataToSend;
//  spawn new child process to call the python script
 const python = spawn('python', ['script1.py', req.query.url]);
//  collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...', data.toString());
  dataToSend = data.toString();
 });
//  in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
//  send data to browser
 res.send(dataToSend)
 });
 
})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))