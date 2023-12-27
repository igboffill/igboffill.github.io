function draw(data) {
    console.log(data)

    // Declare the chart dimensions and margins.
    const width = 900;
    const height = 620;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 100;
    const marginLeft = 50;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    var timeFormat = d3.timeFormat('%M:%S');
    var timeParse = d3.timeParse('%M:%S');

    const y = d3.scaleTime()
        .domain([d3.max(data, d => timeParse(d.Time)), d3.min(data, d => timeParse(d.Time))])
        .range([height - marginBottom, marginTop]);

    // Create the SVG container.
    const svg = d3.select('.chart-container').append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr('id', 'x-axis')
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr('id', 'y-axis')
        .call(d3.axisLeft(y).tickFormat(timeFormat));

    //Add Tooltip

    const tooltip = d3.select('.chart-container').append("div")
        .attr("class", 'tooltip')
        .attr("id", 'tooltip')
        .style('opacity', '0');
   
    //Add Legend    

    const legend = svg.append("g")
        .attr("id", 'legend')

    legend.append('rect')
        .attr('x', marginLeft)
        .attr('y', height - 50)
        .attr('height', 12)
        .attr('width', 12)
        .attr('fill', '#EC9192')

    legend.append('text')
        .attr('x', marginLeft + 20)
        .attr('y', height - 40)
        .style('font-size', '14px')
        .attr('fill', '#EFF7FF')
        .text("No doping allegations");

    legend.append('rect')
        .attr('x', marginLeft + 250)
        .attr('y', height - 50)
        .attr('height', 12)
        .attr('width', 12)
        .attr('fill', '#B6174B')

    legend.append('text')
        .attr('x', marginLeft + 270)
        .attr('y', height - 40)
        .style('font-size', '14px')
        .attr('fill', '#EFF7FF')
        .text("Riders with doping allegations");

    // Add Data

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => {
            return x(d.Year);
        })
        .attr('cy', d => {

            return y(timeParse(d.Time));
        })
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => timeParse(d.Time).toISOString())
        .attr('fill', d => d.Doping === '' ? '#EC9192' : '#B6174B')
        .attr('r', 5)
        .on('mouseover', (event, d) => {
            let html = '<div><span class="tooltip-label">Doping:</span> ' + d.Doping + '</div>'
            html += '<div><span class="tooltip-label">Name:</span> ' + d.Name + '</div>'
            html += '<div><span class="tooltip-label">Nationality:</span> ' + d.Nationality + '</div>'
            html += '<div><span class="tooltip-label">Time:</span> ' + d.Time + '</div>'
            html += '<div><span class="tooltip-label">Year:</span> ' + d.Year + '</div>'

            tooltip.html(html)

            tooltip.style('left', x(d.Year) + 10 + 'px')
            tooltip.style('top', y(timeParse(d.Time)) + 10 + 'px')
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.attr('data-year', d.Year)
        })
        .on('mouseout', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0);
        })



}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => { draw(data) })

function convertToDate(t) {
    return new Date(Date.parse('2000-01-01 00:' + t))
}

