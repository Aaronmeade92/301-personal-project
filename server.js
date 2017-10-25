'use strict';
const pg = require('pg');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const conString = `${process.env.DATABASE_URL}`//;
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
loadDB();

function loadDB(){
client.query(`
  CREATE TABLE IF NOT EXISTS
  users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    "user" VARCHAR(225) UNIQUE NOT NULL
  )
  `).catch(console.error);

client.query(`
  CREATE TABLE IF NOT EXISTS
  daysdata (
    data_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    "name" VARCHAR(225) NOT NULL,
    "date" VARCHAR(225) NOT NULL,
    "meals" VARCHAR(225) ARRAY[1000] NOT NULL,
    "sleep" INTEGER NOT NULL,
    "meds" VARCHAR(225),
    "mood" INTEGER NOT NULL,
    "exercise" VARCHAR(225)
  )
`).catch(console.error);
}

app.post('/days', function(request, response){
  client.query(`
  INSERT INTO users("user") VALUES($1) ON CONFLICT DO NOTHING`,
[request.body.name],
  function(err) {
    if (err) console.error(`Insert into users: ${err}`)
    queryTwo(request, response);
  })
})

app.get('/history/:name', function(request,response){
  client.query(`
    SELECT * FROM daysdata
    INNER JOIN users
      ON daysdata.user_id = users.user_id
      WHERE "user"=$1
    `,[request.params.name])
    .then(result => {
      response.send(result.rows);
    })
  .catch(console.error);
})

function queryTwo(request, response) {
  console.error(`Request.body: ${request.body.name}`)
  client.query(
    `SELECT user_id FROM users WHERE "user"=$1`,
    [request.body.name],
    function(err, result) {
      if (err) console.error(`Finding user: ${err}`)
      queryThree(result.rows[0].user_id, request, response)
    }
  )
}

function queryThree(user_id, request, response) {
  client.query(
    `INSERT INTO
    daysdata(user_id, "name", "date", "mood", "exercise")
    VALUES($1, $2, $3, $4, $5, $6, $7, $8);`,
    [user_id,
    request.body.name,
    request.body.date,
    request.body.mood,
    request.body.exercise
  ],
  function(err) {
    if(err) console.error(`Insert into daydata: ${err}`);
    response.send('insert complete');
  });
}


app.listen(PORT, function(){
  console.log(`Listeninng on port Number: ${PORT}`);
})
