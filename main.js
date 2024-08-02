const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { readFile, writeFile } = require('fs');

const app = express();
app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/login', (req, res)=>{
    let body = req.body;
    if (body) {
        readFile('./data/users.json', 'utf-8', (err, data)=>{
            if (err) {
                res.status(500).json({stat: false, message: 'cannot read users file'});
                return;
            }

            if (body.user in JSON.parse(data)) {
                let current =  JSON.parse(data);

                let userData = current[body.user];
                if (body.pass == userData.pass) {
                    res.status(200).json({stat: true, message: 'Login successful !'});

                } else {
                    res.status(400).json({stat: false, message: "password doesn't match"});
                }
            } else {
                res.status(400).json({stat: false, message: "user isn't exists"});
            }
        })      
    }else{
        res.status(400).json({stat: false, message: 'Body null'});
    }
});

app.post('/api/create', (req, res)=>{
    let body = req.body;

    if (body) {

        let data = body;
        let = readFile('./data/users.json', 'utf-8', (error, current)=>{
            if (error) {
                res.status(500).json({stat: false, message: 'cannot read current users'});
                console.log(error);
            } else {
               
                let obj = JSON.parse(current);
                if (data.user in obj) {
                    res.status(400).json({stat: false, message: 'user is already exists'});
                } else {
                    obj[data.user] = {user: data.user, pass: data.pass}
                    writeFile('./data/users.json', JSON.stringify(obj), (err)=>{
                        if (err) {
                            res.status(500).json({stat: false, message: 'Cannot write new file'});
                        } else {
                            res.status(200).json({stat: true, message: 'Account created successfuly  !'});
                        }
                    })
                }
            }
        })
    } else {
        res.status(401).json({stat: false, message: 'No body found'})
    }
});

app.all('*', (req, res)=>{
    console.log(`user hit url: ${req.url} and method: ${req.method}`);
    res.status(404).json({data: 'error not found'});
});

app.listen(3000, ()=>{
    console.log('server listening to port 3000');
});