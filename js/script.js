// Wait for DOM to finish loading
$(function () {
    Plotly.d3.csv('../data/antibiotics-data.csv', function (err, rows) {
        function unpack(rows,key) {
            return rows.map(function (row) { return row[key]; });
        }
        var bac = unpack(rows, 'Bacteria'),
            pen = unpack(rows, 'Penicilin'),
            str = unpack(rows,'Streptomycin'),
            neo = unpack(rows, 'Neomycin'),
            gram = unpack(rows, 'Gram.Staining'),
        allBacteriaCollection =[];
        for (var i = 0; i < bac.length; i++) {
            var bacteriaCollection = {
                name: bac[i],
                penValue: Math.log(pen[i]),
                strValue: Math.log(str[i]),
                neoValue: Math.log(neo[i]),
                gramValue: gram[i]
            }
            allBacteriaCollection.push(bacteriaCollection);
        }
        var positiveGram = [];
        var negativeGram = [];
        for (var i = 0; i < allBacteriaCollection.length; i++ ) {
            if (allBacteriaCollection[i].gramValue === 'positive') {
                positiveGram.push(allBacteriaCollection[i]);
            } else {
                negativeGram.push(allBacteriaCollection[i]);
            }
        }
        
        function getPenValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.penValue);
            })
            return returnArray;
        };
        function getStrValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.strValue);
            })
            return returnArray;
        };
        function getNeoValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.neoValue);
            })
            return returnArray;
        };
        function getName(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.name);
            })
            return returnArray;
        };
        function getGram(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.gramValue);
            })
            return returnArray;
        };
        function getAverage(array) {
            var sum = 0;
            for (var i= 0; i< array.length; i++) {
                sum+= array[i];
            }
            return (sum/array.length);
        }
        
        function concatArray(arrayOne, arrayTwo) {
            var returnArray = arrayOne.concat(arrayTwo);
            return returnArray;
        }
        
        // first bar graph
        var firstCollection = [
            {
                x: getName(allBacteriaCollection),
                y: getPenValue(allBacteriaCollection),
                type: 'scatter',
                name: 'Penicilin',
                marker: {
                    size: 14
                },
                mode: 'lines+markers'
            },
            {
                x: getName(allBacteriaCollection),
                y: getStrValue(allBacteriaCollection),
                type: 'scatter',
                name: 'Streptomycin',
                marker: {
                    size: 14
                },
                mode: 'lines+markers',
            },
            {
                x: getName(allBacteriaCollection),
                y: getNeoValue(allBacteriaCollection),
                type: 'scatter',
                name: 'Neomycin',
                marker: {
                    size: 14
                },
                mode: 'lines+markers',
            }
        ]
        var firstData = firstCollection;
        var firstLayout = {
            title: 'Antibiotic Effectiveness on Bacteria',
            margin: {
                b:150
            },
            xaxis: {
                title: 'Bacteria Name'
            },
            yaxis: {
                title: 'Log Minimum Inhibitory Concentration (MIC)',
                zeroline: false
            }
        };
        Plotly.newPlot(firstViz,firstData,firstLayout, {staticPlot:true});
        
        // second
        var xAxis = concatArray(getGram(positiveGram),getGram(negativeGram));
        var test = concatArray(getGram(positiveGram),getGram(negativeGram));
        var secondData = [
            {   
                x: xAxis,
                y: concatArray(getPenValue(positiveGram),getPenValue(negativeGram)),
                name: 'Penicilin',
                marker: {color: '#3D9970'},
                type: 'box'  
            },
            {   
                x: xAxis,
                y: concatArray(getStrValue(positiveGram),getStrValue(negativeGram)),
                name: 'Streptomycin',
                marker: {color: '#FF4136'},
                type: 'box'  
            },
            {   
                x: xAxis,
                y: concatArray(getNeoValue(positiveGram),getNeoValue(negativeGram)),
                name: 'Neomycin',
                marker: {color: '#FF851B'},
                type: 'box'  
            }
        ];
        var secondLayout = {
            title: 'Antibiotic Minimum Inhibitory Concentration (MIC) on Gram-positive and Gram-negative Bacteria', 
            xaxis: {
                title: 'Gram Staining'
            },
            yaxis: {
                title: 'Log Minimum Inhibitory Concentration (MIC)',
                zeroline: false
            },
            boxmode: 'group'
        };
        Plotly.newPlot(secondViz,secondData,secondLayout, {staticPlot:true});

        // third neg-pos bar chart
        var thirdData = [
            {
                x: ['Penicilin', 'Streptomycin', 'Neomycin'],
                y: [getAverage(getPenValue(positiveGram)), 
                getAverage(getStrValue(positiveGram)), 
                getAverage(getNeoValue(positiveGram))],
                name: 'Gram-positive',
                type: 'bar' 
            },
            {
                x: ['Penicilin', 'Streptomycin', 'Neomycin'],
                y: [getAverage(getPenValue(negativeGram)), 
                getAverage(getStrValue(negativeGram)), 
                getAverage(getNeoValue(negativeGram))],
                name: 'Gram-negative',
                type: 'bar',
                marker: {
                    color: 'rgb(171, 0, 0)'
                } 
            }
        ];
        var thirdLayout = {
            title: 'Effectiveness of Antibiotics on Gram-positive and Gram-negative Bacteria',
            xaxis: {
                title: 'Antibiotic Name'
            },
            yaxis: {
                title: 'Average Log Minimum Inhibitory Concentration (MIC)',
                zeroline: false
            },
            barmode: 'group'};
        Plotly.newPlot(thirdViz,thirdData,thirdLayout, {staticPlot:true});
    })
});
