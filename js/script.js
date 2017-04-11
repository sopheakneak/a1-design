// Wait for DOM to finish loading
$(function () {
    Plotly.d3.csv('../data/antibiotics-data.csv', function (err, rows) {
        function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
        }
        var bac = unpack(rows, 'Bacteria'),
            pen = unpack(rows, 'Penicilin'),
            str = unpack(rows, 'Streptomycin'),
            neo = unpack(rows, 'Neomycin'),
            gram = unpack(rows, 'Gram.Staining'),
            allBacteriaCollection = [];
        
        // Stores every bacteria as its own object with respective name, Penicilin MIC,
        // Streptomycin MIC, Neomycin, and type of gram staining
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
        var antibioticsName = ['Penicilin', 'Streptomycin', 'Neomycin'];
        var positiveGram = [];
        var negativeGram = [];
        
        // Store gram-positive and gram-negative bacteria object in 
        // a separate collection 
        for (var i = 0; i < allBacteriaCollection.length; i++) {
            if (allBacteriaCollection[i].gramValue === 'positive') {
                positiveGram.push(allBacteriaCollection[i]);
            } else {
                negativeGram.push(allBacteriaCollection[i]);
            }
        }

        // Returns an array of all the Penicilin MIC value in the given object
        function getPenValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.penValue);
            })
            return returnArray;
        };

        // Returns an array of all the Streptomycin MIC value in the given object
        function getStrValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.strValue);
            })
            return returnArray;
        };

        // Returns an array of all the Neomycin MIC value in the given object
        function getNeoValue(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.neoValue);
            })
            return returnArray;
        };

        // Returns an array of all the bacteria name in the given object
        function getName(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.name);
            })
            return returnArray;
        };

        // Returns an array of all the bacteria stain type in the given object
        function getGram(object) {
            var returnArray = [];
            object.forEach((e) => {
                returnArray.push(e.gramValue);
            })
            return returnArray;
        };

        // Returns the average value of the given array of numbers
        function getAverage(array) {
            var sum = 0;
            for (var i = 0; i < array.length; i++) {
                sum += array[i];
            }
            return (sum / array.length);
        }

        // Returns a concatenated array of arrayOne and arrayTwo
        // maintaing the order of element in the arrays  
        function concatArray(arrayOne, arrayTwo) {
            var returnArray = arrayOne.concat(arrayTwo);
            return returnArray;
        }

        // First visualization
        // An array of trace for plotting a dot graph
        var firstCollection = [
            {
                x: getName(allBacteriaCollection),
                y: getPenValue(allBacteriaCollection),
                type: 'scatter',
                name: antibioticsName[0],
                marker: {
                    size: 14,
                    color:'#3D9970'
                },
                mode: 'lines+markers'
            },
            {
                x: getName(allBacteriaCollection),
                y: getStrValue(allBacteriaCollection),
                type: 'scatter',
                name: antibioticsName[1],
                marker: {
                    size: 14,
                    color: '#f48042'
                },
                mode: 'lines+markers',
            },
            {
                x: getName(allBacteriaCollection),
                y: getNeoValue(allBacteriaCollection),
                type: 'scatter',
                name: antibioticsName[2],
                marker: {
                    size: 14,
                    color: '#bf42f4'
                },
                mode: 'lines+markers',
            }
        ]
        var firstData = firstCollection;
        var firstLayout = {
            title: 'Antibiotic Effectiveness on Bacteria',
            margin: {
                b: 150
            },
            xaxis: {
                title: 'Bacteria Name'
            },
            yaxis: {
                title: 'Log Minimum Inhibitory Concentration (MIC)',
                zeroline: false
            }
        };
        
        // Plots a dot graph based on firstData and firstLayout 
        Plotly.newPlot(firstViz, firstData, firstLayout, { staticPlot: true });

        // Second visualization
        var xAxis = concatArray(getGram(positiveGram), getGram(negativeGram));
        var test = concatArray(getGram(positiveGram), getGram(negativeGram));
        
        // An array of trace for plotting a box plot 
        var secondData = [
            {
                x: xAxis,
                y: concatArray(getPenValue(positiveGram), getPenValue(negativeGram)),
                name: antibioticsName[0],
                marker: { color: '#3D9970' },
                type: 'box'
            },
            {
                x: xAxis,
                y: concatArray(getStrValue(positiveGram), getStrValue(negativeGram)),
                name: antibioticsName[1],
                marker: { color: '#f48042' },
                type: 'box'
            },
            {
                x: xAxis,
                y: concatArray(getNeoValue(positiveGram), getNeoValue(negativeGram)),
                name: antibioticsName[2],
                marker: { color: '#bf42f4' },
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
        
        // Graphs a dot graph based on secondData and secondLayout
        Plotly.newPlot(secondViz, secondData, secondLayout, { staticPlot: true });

        // Third visualization
        // An array of trace for graphing a grouped bar graph 
        var thirdData = [
            {
                x: antibioticsName,
                y: [getAverage(getPenValue(positiveGram)),
                getAverage(getStrValue(positiveGram)),
                getAverage(getNeoValue(positiveGram))],
                name: 'Gram-positive',
                type: 'bar'
            },
            {
                x: antibioticsName,
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
            barmode: 'group'
        };
        // Graphs a grouped bar graph based on thirdData and thirdLayout
        Plotly.newPlot(thirdViz, thirdData, thirdLayout, { staticPlot: true });
    })
});
