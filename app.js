'use-strict'

const models = require('./models');
const fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/images', (req, res) => {
    models.Image.findOne({where:{id:2}}).then((image =>{
        let img = new Buffer(image.source).toString('base64');
        res.render('index', {image, img});
    }))
});

app.get('/images/daftar-gambar', (req, res) => {
    models.Image.findAll().then((images =>{
        images.forEach(image => {
            image.source = new Buffer(image.source).toString('base64');
        });
        res.render('daftar-gambar', {images});
    }))
});

app.get('/images/upload-gambar', (req, res) => {
    res.render('upload');
});

app.get('/images/update/:id', (req, res) => {
    models.Image.findOne({where:{id:parseInt(req.params.id)}}).then((image=>{
        res.render('update',{image});
    }))
    
});

app.post('/images/update/:id', (req, res) => {
    models.Image.update({name: req.body.nama}, {where:{id:parseInt(req.params.id)}}).then(() =>{
        models.Image.findAll().then((images =>{
            images.forEach(image => {
                image.source = new Buffer(image.source).toString('base64');
            });
            res.render('daftar-gambar', {images});
        }))
    })
});

app.get('/images/delete/:id', (req,res) => {
    models.Image.destroy({where:{id:parseInt(req.params.id)}}).then(()=>{
        models.Image.findAll().then((images =>{
            images.forEach(image => {
                image.source = new Buffer(image.source).toString('base64');
            });
            res.render('daftar-gambar', {images});
        }))
    })
});

app.post('/images/upload-gambar', (req, res) => {
    models.Image.create({
        name: req.body.nama,
        source: fs.readFileSync(req.body.path),
        createdAt : new Date(),
        updatedAt : new Date()
    }).then((image =>{
        let img = new Buffer(image.source).toString('base64');
        res.render('index', {image, img});
    }))
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));