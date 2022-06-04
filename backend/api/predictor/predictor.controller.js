const {spawn} = require('child_process');
const logger = require('../../services/logger.service')

async function predict (req, res) {
    console.log('predict , controller')
    var dataToSend;
    console.log(req.query['0'] , 'req query only with 0')
    // spawn new child process to call the python script
    const python = spawn('python', ['script1.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...', data.toString());
    dataToSend = data.toString();
    res.send(dataToSend)
    });
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
//  send data to browser
 res.send(dataToSend)
 });
    console.log("im outta here now")
}

module.exports = {
    predict,
}
