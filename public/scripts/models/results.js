'use strict';
var app = app || {};
var userData = userData || [];

(function(name){
  $.get(`/results/${name}`)
  .then(results =>{
    userData = results;
    app.labelData = userData.map(function(day){
      let label = new app.Day(day)
      return label.x;
    });
    app.dayData = userData.map(function(day){
      return day.mood;
    })

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: app.labelData,
          datasets: [{
              label: 'Mood over time',
              data: app.dayData,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          },
          tooltips: {
            custom: function(tooltipModel) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = "<table></table>"
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }



                // Set Text
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var i = tooltipModel.dataPoints[0].index
                    var bodyLines = tooltipModel.body.map(function(bodyItem){

                      let data = userData[i];
                      let bodyHTML = `<table id="tooltip-data"><thead><tr><th>Mood</th><th>Sleep</th><th>Meals</th><th>Exercise</th><th>Medications and Supplements</th></tr></thead><tbody><tr><td>${data.mood}</td><td>${data.sleep}</td><td>${data.meals[0]}<br/>${data.meals[1]}<br/>${data.meals[2]}</td><td>${data.exercise}</td><td>${data.meds}</td></tr></tbody></table>`
                      return bodyHTML;

                    });

                    var innerHtml = '<thead>';

                    titleLines.forEach(function(title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';

                    bodyLines.forEach(function(body, i) {
                        var colors = tooltipModel.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                        innerHtml += '<tr><td>' + span + body + '</td></tr>';
                    });
                    innerHtml += '</tbody>';

                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }

                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect();

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._fontFamily;
                tooltipEl.style.fontSize = tooltipModel.fontSize;
                tooltipEl.style.fontStyle = tooltipModel._fontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            }
          }
      }
    });

  });


})(localStorage.userName);
