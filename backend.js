const express = require("express");
const {db} = require("./config"); 
const short = require('shortid');  
var parser = require('body-parser');
const fs = require('fs');
const {collection, addDoc, Timestamp, getDocs, getDoc, doc, deleteDoc, updateDoc} = require('firebase/firestore');

const app = express();
app.use(express.json());
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
app.set('view engine', 'ejs'); 

var {Parser} = require('json2csv');

app.get("/dataToCsv", (req, res) => {
    res.attachment('filename.csv');
    res.status(200).send(data);
})

var date_ob = new Date();
var day = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();
var hours = date_ob.getHours();
var minutes = date_ob.getMinutes();
var seconds = date_ob.getSeconds();
var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

app.post("/create", async (req, res) => {
    try {
        await addDoc(collection(db, 'items'), {
          item_id: short(),
          name: req.body.name,
          description: req.body.description,
          quantity: req.body.quantity,
          unit_price: req.body.unit_price,
          value: req.body.unit_price*req.body.quantity,
          created: dateTime,
          updated: "Not updated yet"
        })
        res.status(200, {message:"data added"}).redirect("/");
      } catch (err) {
          console.log(err);
      }
})

app.get("/update/:id", async (req, res)=>{
    const data = getDoc(doc(db, 'items', req.params.id)).then((doc) => {
        res.render('update', {item: doc.data(), id: req.params.id});
    });
})

app.get("/additem", (req, res) => {
    res.render('addItem');
})

app.post("/update/:id", async (req, res) => {
    try {
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var hours = date_ob.getHours();
        var minutes = date_ob.getMinutes();
        var seconds = date_ob.getSeconds();
        var dateTime = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
        await updateDoc(doc(db, 'items', req.params.id), {
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            unit_price: req.body.unit_price,
            value: req.body.unit_price*req.body.quantity,
            updated:dateTime
        })
        res.redirect("/");
      } catch (err) {
          console.log(err);
      }
})

app.get("/delete/:id", async (req, res)=>{
    try {
        await deleteDoc(doc(db, 'items', req.params.id)).then(()=>{
            console.log("doc deleted");
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})

app.get("/view/:id", async (req, res) => {
    await getDoc(doc(db, 'items', req.params.id)).then((item) => {
        res.render('view', {item: item.data()});
    })
})

app.get("/download", async (req, res) => {
    let items = [];
    await getDocs(collection(db, 'items')).then((snapshot) => {
        snapshot.docs.forEach((item) => {
            items.push({...item.data(), id: item.id});
        })
        //res.render('home' , {data: items});
    })
    const fields = ['item_id', 'name', 'description',
                    'unit_price', 'quantity', 'value', 'created', 'updated', 'id']
    const csv = new Parser({fields});
    fs.writeFile('data.csv', csv.parse(items), function(err){
        if(err){
            console.error(err);
            throw err;
        }
        res.download('data.csv');
        console.log('file saved');
    })
    
})

app.get("/", async (req, res) => {
    let items = [];
    await getDocs(collection(db, 'items')).then((snapshot) => {
        snapshot.docs.forEach((item) => {
            items.push({...item.data(), id: item.id});
        })
        res.render('home' , {data: items});
    })
})

app.listen(3000, () => console.log("Backend running at 3000"));