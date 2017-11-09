'use strict';

var users = [];
var app = app || {};
var userData = userData || [];

(function (module){

var labelData = [];
var dayData = [];

function Day(rawDataObj) {
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
    let thisDate = new Date(rawDataObj.date).toUTCString();
    thisDate= thisDate.split(' ').slice(0, 4).join(' ')
    this.x = thisDate;
    this.y = rawDataObj.mood;
};


function User(name){
  this.name = name;
  this.data = [];
};

function submitForm () {
$('#submit').on('submit', function(e) {
  e.preventDefault();
  let name = $('#name').val();
  let today = new Date();
  let date = today.setDate(today.getDate()-1);
  let moodText = $('#mood option:selected').text();
  let mood = convertMood(moodText);
  console.log(mood);
  console.log(name);

  $.post('/days', {name: name, date: today, mood: mood,}).then(response => {
    localStorage.userName = name;
    window.location.href='/form.html'
    });
  });
};

function convertMood(mood){
  switch (mood) {
    case 'Super Cowabunga!':
      return 6;
      break;
    case 'Very Cowabunga!':
      return 5;
      break;
    case 'Cowabunga!':
      return 4;
      break;
    case 'Not so Cowabunga':
      return 3;
      break;
    case 'Definitely Not Cowabunga ':
      return 2;
      break;
    case 'Zero Cowabungas':
      return 1;
      break;
    default: return 0;

  }
}

    module.Day = Day;
    module.User = User;
    module.userData = userData;
    module.submitForm = submitForm;
    module.labelData = labelData;
    module.dayData = dayData;

})(app);

app.submitForm();
