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
            scale = 4500;
        //console.log("sample" + bac);
        sample =[],
        bacName= [],
            penData = [],
            strData = [],
            neoData = [],
            gramType = [],
            hoverText = [];
        for (var i = 0; i < bac.length; i++) {
            var bacteriaCollection = {
                name: bac[i],
                penValue: Math.log(pen[i]),
                strValue: Math.log(str[i]),
                neoValue: Math.log(neo[i]),
                gramValue: gram[i]
            }
            // var name = bac[i];
            //     penValue = Math.log(pen[i]),
            //     strValue = Math.log(str[i]),
            //     neoValue = Math.log(neo[i]),
            //     gramValue = gram[i];
            // bacName.push(name);
            // penData.push(penValue);
            // strData.push(strValue);
            // neoData.push(neoValue);
            // gramType.push(gram);
            //console.log(bacteriaCollection);
            sample.push(bacteriaCollection);
        }
        var positiveGram = [];
        var negativeGram = [];
        for (var i = 0; i < sample.length; i++ ) {
            if (sample[i].gramValue === 'positive') {
                positiveGram.push(sample[i]);
            } else {
                negativeGram.push(sample[i]);
            }
        }
        console.log(positiveGram);

        var penTrace = {
            y: getName(sample),
            x: getPenValue(sample),
            mode: 'markers',
            type: 'scatter',
            marker: {size: 12}
        };
        var strTrace = {
            y: getName(sample),
            x: getStrValue(sample),
            mode: 'markers',
            type: 'scatter',
            marker: {size: 12}
        };
        var neoTrace = {
            y: getName(sample),
            x: getNeoValue(sample),
            mode: 'markers',
            type: 'scatter',
            marker: {size: 12}
        };
        
        //getPenValue(positiveGram);
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
        var secondData = [penTrace, strTrace];
        var secondLayout = { 
            title:'Data Labels Hover'
        };
        Plotly.newPlot(firstViz,secondData,secondLayout);
        // var firstCollection = [
        //     {
        //         x: bacName,
        //         y: penData,
        //         type: 'bar',
        //         name: 'Penicilin',
        //         showlegend: false
        //     },
        //     {
        //         x: bacName,
        //         y: strData,
        //         type: 'bar',
        //         name: 'Streptomycin',
        //         showlegend: false
        //     },
        //     {
        //         x: bacName,
        //         y: neoData,
        //         type: 'bar',
        //         name: 'Neomycin',
        //         showlegend: false
        //     }
        // ]
        // var firstData = firstCollection;
        // var firstLayout = {barmode: 'group'};
        // Plotly.newPlot(firstViz,firstData,firstLayout);
    })
});
