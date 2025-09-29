function AddPerformanceLineChart(labels, data1, data2, filter, portfolioColor, benchmarkColor){	
var jsonStr = [{meta: labels[0], value: data1[0]}];
var plotObj1 = new Array();
var i=0;
var combinedArray = [].concat(data1,data2);
//console.log(combinedArray);
for (i in data1)
{
var firstLine = labels[i] + "\n"; 
plotObj1.push({meta: firstLine, value: data1[i]});
}
if(data2.length != 0){
var jsonStr = [{meta: labels[0], value: data2[0]}];
var plotObj2 = new Array();
var i=0;
for (i in data2)
{
var firstLine = labels[i] + "\n"; 
plotObj2.push({meta: firstLine, value: data2[i]});
}
}
  // Function to define the labelling strategy for X Axis to configure for Chartist
  let interpolationFunc = (value, index, labels) => index === labels.findIndex(l => l === labels) ? labels : null;
  let dateOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  switch (filter) {  
    case 'OneY':
		   let arrayValue=[];
	   interpolationFunc = (value, index, labels) =>{
        try {
           var date = new Date(value);
			var monthVal = date.getMonth();
			var finalMonth = months[monthVal];
			if(arrayValue.filter(x => x == finalMonth).length <1 ) {
				if(monthVal == 0){
				return date.getFullYear();
				}
            arrayValue.push(finalMonth);
	        return finalMonth;		
          } 
		  else {
            return null;
          }
		}
		catch(e) {
          return 'e'+e;
        }
	}	   
      break;

   case 'Inception': dateOptions = { year: 'numeric', month: 'short' };
      let arrayYear=[];
      interpolationFunc = (value, index, labels) => {
        try {       
		  var date = new Date(value);
			var yearVal = date.getFullYear();
			var finalYear = yearVal.toString().slice(-2);
		    var month = date.getMonth();
          if((month===0 || month===7) || (arrayYear.filter(x => x == months[month]+"'"+finalYear).length <1 ) ) {
            arrayYear.push(months[month]+"'"+finalYear);
	        return months[month]+"'"+finalYear;																															
          } else {
            return null;
          }
        } catch(e) {
          return 'e'+e;
        }
      }
      break;
	  
    case 'YTD': 
	   let arrayData=[];
	   interpolationFunc = (value, index, labels) =>{
        try {
           var date = new Date(value);
			var monthVal = date.getMonth();
			var finalMonth = months[monthVal];
			if(arrayData.filter(x => x == finalMonth).length <1 ) {
				if(monthVal == 0){
				return date.getFullYear();
				}
            arrayData.push(finalMonth);
	        return finalMonth;		
          } 
		  else {
            return null;
          }
		}
		catch(e) {
          return 'e'+e;
        }
	}
     break;	   
	 
    default: dateOptions = { year: 'numeric', month: 'short' };
       dateOptions = { year: 'numeric', month: 'short' };
	   let arrayMonth=[];
	   interpolationFunc = (value, index, labels) =>{
      var date = new Date(value);
			var monthVal = date.getMonth();
			var finalMonth = months[monthVal];
			var yearVal = date.getFullYear();
			if(arrayMonth.filter(x => x == finalMonth+"'"+yearVal).length <1 ) {
				if(monthVal == 0){
				return date.getFullYear();
				}
            arrayMonth.push(finalMonth);
	        return finalMonth;		
          } 
		  else {
            return null;
          }
	}
	  break;
  }
	var options = {
		showArea: true,
		showPoint: true,
		lineSmooth : false,
      	width: "100%",
        height: "200px",
		fullWidth: true,
		chartPadding: {
		right: 65
		},		
		axisX: {
        showGrid: true,
        showLabel: true,
		labelInterpolationFnc:interpolationFunc
		},
		axisY: {
        showGrid: true,
        showLabel: true,
		low: Math.min.apply(null, combinedArray),
        high: Math.max.apply(null, combinedArray),
		divisor : 20,
		ticks: null,
		labelInterpolationFnc: function (value) {
        return value +"%";
      }
		},
	};
var chart = new Chartist.Line('#wealthPerformanceChart', {
  labels: labels,
  series: [plotObj1,plotObj2],
  backgroundColor: [
        'red',
        'green'],
      borderColor: [
        'red',
        'green'
      ],
      borderWidth: 1
}, options);

chart.on('draw', function(context) {
  if(context.type === 'label' && context.axis.units.pos === 'y') {
    context.element.attr({
      x: context.axis.chartRect.width() + parseInt("100")
    });
  }
  if(context.type === 'bar') {
    context.element.attr({
      x1: context.x1 + 0.001
    });
  }
});


chart.on('draw', function(context) {
  if(context.type === 'label' && context.axis.units.pos === 'y') {
    context.element.attr({
      x: context.axis.chartRect.width() + parseInt("60")
    });
  }
  if(context.type === 'point' && context.index == labels.length-2) {

	var triangle = new Chartist.Svg('path', {
      d: ['M',
        context.x+10,
        context.y+10,
        'L',
        context.x +100,
        context.y + 10,
		'L',
        context.x +100,
        context.y - 10,
		'L',
		context.x + 10,
        context.y - 10,
		'L',
        context.x,
        context.y,
        'z'].join(' '),
      style: 'fill-opacity: 1'
    }, 'ct-area');

    // With data.element we get the Chartist SVG wrapper and we can replace the original point drawn by Chartist with our newly created triangle
  //  context.element.replace(triangle);
  }
});


// To Apply Chart Area Color
chart.on('created', function(ctx) {
  var defs = ctx.svg.elem('defs');
  defs.elem('linearGradient', {
    id: 'gradient',
    x1: 0,
    y1: 1,
    x2: 0,
    y2: 0
  }).elem('stop', {
    offset: 0,
	'stop-color': '#3E75A6'  
  }).parent().elem('stop', {
    offset: 1,
    'stop-color': '#3E75A6'
  });
});
setTimeout(function(){	
if(portfolioColor == "" && benchmarkColor == ""){
	$('.ct-series-a').find(".ct-line").attr('style',"stroke: #003E75 !important");
	$('.ct-series-b').find(" .ct-line").attr('style',"stroke: #FFB000 !important");
	$('.ct-series-a ').find(".ct-area").attr('style',"fill: #003E75 !important");
	$('.ct-series-b').find(" .ct-area").attr('style',"fill: #FFB000 !important");
	$('.ct-series-a ').find(".ct-point").attr('style',"stroke: #003E75 !important");
	$('.ct-series-b').find(" .ct-point").attr('style',"stroke: #FFB000 !important");
	}
	else if(portfolioColor == "" || benchmarkColor == ""){
	if(portfolioColor == ""){
	$('.ct-series-a').find(".ct-line").attr('style',"stroke: #003E75 !important");
	$('.ct-series-b').find(" .ct-line").attr('style',"stroke:"+ benchmarkColor+" !important");
	$('.ct-series-a ').find(".ct-area").attr('style',"fill: #003E75 !important");
	$('.ct-series-b').find(" .ct-area").attr('style',"fill:"+ benchmarkColor+" !important");
	$('.ct-series-a ').find(".ct-point").attr('style',"stroke: #003E75 !important");
	$('.ct-series-b').find(" .ct-point").attr('style',"stroke:"+benchmarkColor+" !important");
	}
	else{
	$('.ct-series-a').find(".ct-line").attr('style',"stroke: "+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-line").attr('style',"stroke: #FFB000 !important");
	$('.ct-series-a ').find(".ct-area").attr('style',"fill:"+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-area").attr('style',"fill:#FFB000 !important");
	$('.ct-series-a ').find(".ct-point").attr('style',"stroke:"+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-point").attr('style',"stroke:#FFB000 !important");
	}
	}
	else{
	$('.ct-series-a').find(".ct-line").attr('style',"stroke: "+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-line").attr('style',"stroke:"+ benchmarkColor+" !important");
	$('.ct-series-a ').find(".ct-area").attr('style',"fill:"+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-area").attr('style',"fill:"+ benchmarkColor+" !important");
	$('.ct-series-a ').find(".ct-point").attr('style',"stroke:"+portfolioColor+" !important");
	$('.ct-series-b').find(" .ct-point").attr('style',"stroke:"+benchmarkColor+" !important");
	}
});
}