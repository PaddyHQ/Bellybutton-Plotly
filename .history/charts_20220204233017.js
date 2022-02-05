function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then(({samples,metadata}) => {
    // 3. Create a variable that holds the samples array. 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleFiltered = samples.filter(sampleID => sampleID.id == sample);
    //  5. Create a variable that holds the first sample in the array.
      var sampleResult = sampleFiltered[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = sampleResult.otu_ids;
      var otuLabels = sampleResult.otu_labels;
      var sampleValues = sampleResult.sample_values;

      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var washingFreq = parseFloat(result.wfreq)
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // used for loop instead of arrow function and map
    var yticks = otuIds.slice(0,10).map(x=>`OTU ${x}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barTrace = {
      y: yticks,
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels,
      orientation: "h",
      type: 'bar'
    }

    var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title:"Top 10 Bacteria Cultures Found"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout) 

    // 1. Create the trace for the bubble chart.
    var desired_maximum_marker_size = 16
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        mode: "markers",
        marker: {
          size: sampleValues,
          sizeref: 2.0 * Math.max(...sampleValues) / (desired_maximum_marker_size**2),
          color: otuIds
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title:"OTU ID"},
      text: otuLabels,
      scrollZoom:true
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washingFreq,
        max: 10,
       // title: {text: "Belly Button Washing Frequency", subTitle: "Scrubs per Week"},
        title:{text: "Belly Button Washing Frequency <br><sup>Scrubs per Week</sup>"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[0,10], tick0:0, dtick:2},
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "green" },
            { range: [8, 10], color: "darkgreen" }]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData);
  });
}