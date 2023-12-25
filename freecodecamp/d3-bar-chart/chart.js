function draw(data){
    // Declare the chart dimensions and margins.
    const width = 900;
    const height = 440;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 50;
    const barWidth = width / data.data.length;
     


    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain([d3.min(data.data, d=>new Date(d[0])), d3.max(data.data, d=>new Date(d[0]))])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.data, d=>d[1])])
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.select('.chart-container').append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr('id','x-axis')
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr('id','y-axis')
        .call(d3.axisLeft(y));

    //Add Tooltip

    const tooltip = d3.select('.chart-container').append("div")
        .attr("class", 'tooltip')
        .attr("id", 'tooltip')
        .style('opacity', '0');

    const tooltipDate =  tooltip.append('div')
    .attr("class", 'tooltip-date');

    const tooltipValue =  tooltip.append('div')
    .attr("class", 'tooltip-value');
    // Add Data
    
    svg.selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('x', d=>x(new Date(d[0])))
        .attr('y', d=>y(d[1]) /*- marginBottom*/)
        .attr('width', barWidth)
        .attr('height',d=>height - y(d[1])-marginBottom)
        .attr('class', 'bar')
        .attr('data-date', d=>d[0])
        .attr('data-gdp', d=>d[1])
        .attr('index', (d,i)=>i)
        .attr('fill', '#B6174B')
        .on('mouseover', (event,d)=>{
            tooltipDate.html('<span class="tooltip-label">date:</span> '+new Date(d[0]).toLocaleDateString());
            tooltipValue.html('<span class="tooltip-label">gdp:</span> '+d[1]);
            tooltip.style('left', x(new Date(d[0])) + 10 + 'px')
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.attr('data-date', d[0])
        })
        .on('mouseout', (event,d)=>{
            tooltip.transition().duration(200).style('opacity', 0);
        })
    


}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response=>response.json())
.then(data=>{draw(data)})


