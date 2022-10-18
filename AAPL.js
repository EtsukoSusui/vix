

function fetchJSONFile(path, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}
fetchJSONFile('./AAPL.json', function (data) {
    drawChart(data);
});

function drawChart(data){
    
    let current_value = data[data.length-1].close
    let profit = (data[data.length-1].close-data[data.length-1].open) / data[data.length-1].open  * 100
    let time = new Date()
    let open = data[data.length-1].open
    let low = data[data.length-1].low
    let high = data[data.length-1].high
    let close = data[data.length-1].high
    let _52_wk_high = Math.max(...(data.map(item=>(item.close))));
    let _52_wk_low = Math.min(...(data.map(item=>(item.close))));
    
    let color = "#afecd5"
    if(profit>0)
    {
        color = "#afecd5"
        $("#profit").removeClass("red")
    }
    else
    {
        color = "#ee6952"
        $("#profit").addClass("red")
    }
    
    time = time.toString()
    $("#current-value").html(current_value.toFixed(2));
    $("#profit").html(`${(data[data.length-1].close-data[data.length-1].open).toFixed(2)} (${profit.toFixed(2)})% today`);
    $("#time").html(`${time.substring(4, 10)}, ${time.substring(16, 21)} GMT${time.substring(28, 31)}`);
    $("#open").html(open);
    $("#low").html(low);
    $("#high").html(high);
    $("#close").html(close);
    $("#52_wk_high").html(_52_wk_high);
    $("#52_wk_low").html(_52_wk_low);

    let seriesData = []; 
    if (data) {
        $.each(data, function (index, value) {
            reference_date = new Date(value.date).getTime();
            if (index == 0) minDate = reference_date;
            maxDate = reference_date;
            seriesData.push([
                reference_date,
                value.close
            ]);
        })
    }

    let chart = Highcharts.stockChart('container', {
        chart: {
            panning: false,
            pinchType: '',
            type: 'area'
        },
        credits: {
            enabled: false
        },
        exporting:{
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                enabled: true
            }
        },
        navigator : {
            enabled : false
        },
        rangeSelector: {
            buttons: [
                { 
                    type: 'day', 
                    count: 1, 
                    text: '1D' ,
                    events: {
                        click: function(a, b, c) {
                            let min = chart.xAxis[0].max - this._range;
                            let max = chart.xAxis[0].max;
                            changeRange(min,max,"today")
                        }
                    }
                },
                { 
                    type: 'day', 
                    count: 5,
                    text: '5D',
                    events: {
                        click: function(a, b, c) {
                            let min = chart.xAxis[0].max - this._range;
                            let max = chart.xAxis[0].max;
                            changeRange(min,max, "Last 5 Day")
                        }
                    }
                },
                { 
                    type: 'month',
                    count: 1,
                    text: '1M',
                    events: {
                        click: function(a, b, c) {
                            let min = chart.xAxis[0].max - this._range;
                            let max = chart.xAxis[0].max;
                            changeRange(min,max, "Past Month")
                        }
                    } 
                },
                { 
                    type: 'month',
                    count: 6,
                    text: '6M',
                    events: {
                        click: function(a, b, c) {
                            let min = chart.xAxis[0].max - this._range;
                            let max = chart.xAxis[0].max;
                            changeRange(min,max, "Last 6 Months")
                        }
                    }
                },
                { 
                    type: 'ytd',
                    text: 'YTD',
                    events: {
                        click: function(a, b, c) {
                            let max = chart.xAxis[0].max;
                            let min = new Date(`${new Date(max).getFullYear()}-1-11`).getTime()
                            changeRange(min,max, "This Year")
                        }
                    }
                 },
                { 
                    type: 'year',
                    count: 1, 
                    text: '1Y',
                    click: function(a, b, c) {
                        let min = chart.xAxis[0].max - this._range;
                        let max = chart.xAxis[0].max;
                        changeRange(min,max, "Past 1 Year")
                    }
                },
                { 
                    type: 'year', 
                    count: 5, 
                    text: '5Y',
                    click: function(a, b, c) {
                        let min = chart.xAxis[0].max - this._range;
                        let max = chart.xAxis[0].max;
                        changeRange(min,max, "Last 5 Year")
                    }
                },
                { 
                    type: 'all',
                    text: 'MAX',
                    click: function(a, b, c) {
                        let min = chart.xAxis[0].min;
                        let max = chart.xAxis[0].max;
                        changeRange(min,max, "All")
                    }
                 },
                
            ],
            selected: 0,
            labelStyle:{
                display:"none"
            },
            inputEnabled: false,
        },
        title: {
          text: ' '
        },
        yAxis: {
        //   reversed: true,
          showFirstLabel: true,
        //   showLastLabel: true
        },
    
        series: [{
          name: 'AAPL Stock Price',
          data: seriesData,
          threshold: null,
        
          tooltip: {
            valueDecimals: 2
          }
        }],

        plotOptions: {
            series: {
                animation: false,
                states: {
                    inactive: {opacity: 1}
                },
                marker: {
                    enabled: false
                },
                dataGrouping: {
                    enabled:false
                }
            },
            area:{
                lineColor: color,
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 1,
                    x2: 0,
                    y2: 0
                  },
                  stops: [
                    [0, Highcharts.color(color).setOpacity(0).get('rgba')],
                    [1, color],
                  ]
                },
            }
        },

        tooltip : {
            useHTML : true,
            shadow : {
                color : '#333333',
                offsetX : 2,
                offsetY : 4,
                opacity : 0.1,
                width : 10,
            },
            backgroundColor : '#ffffff',
            borderColor : '#dddddd',
            style : { fontSize:'12px' }
        
        },
        xAxis: {
            tickPixelInterval: 120,
            minRange: 86400000,
            minTickInterval: 86400000,
            type : 'datetime',
            labels: {
              
                format: '{value:%y/%m}'
            }
        }
      });

      function changeRange(minX,maxX, period){
        let index = 0;
        let color
        while (!(data.filter(item=>(Math.abs(new Date(item.date).getTime() - minX) <= 3600 * 24 * index))[0])){
            index++
        }
        open = data.filter(item=>(Math.abs(new Date(item.date).getTime() - minX) <= 3600 * 24 * index))[0].open
        profit = (data[data.length-1].close - open) / open * 100
        if(profit>0)
        {
            color = "#afecd5"
            $("#profit").removeClass("red")
        }
        else
        {
            color = "#ee6952"
            $("#profit").addClass("red")
        }
        $("#profit").html(`${(data[data.length-1].close - open).toFixed(2)} (${profit.toFixed(2)})% ${period}`);       

        chart.update({
            plotOptions:{
                area:{
                    lineColor: color,
                    fillColor: {
                    stops: [
                        [0, Highcharts.color(color).setOpacity(0).get('rgba')],
                        [1, color],
                    ]
                    },
                }
            }
        })
      }
}
  