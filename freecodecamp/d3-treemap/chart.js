function draw(data) {



    // Declare the chart dimensions and margins.
    const width = 1200;
    const height = 700;
    const legendSpace = 100;

    const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemeTableau10);

    const root = d3.treemap()
        .tile(d3.treemapSquarify)
        .size([width - legendSpace, height])
        .padding(1)
        .round(true)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    const tooltip = d3.select('.chart-container').append("div")
        .attr("class", 'tooltip')
        .attr("id", 'tooltip')
        .style('opacity', '0');

    const svg = d3.select('.chart-container').append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    var svgrect = document.querySelector('svg').getBoundingClientRect();
        

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");

    leaf.append("rect")
        .attr("class", "tile")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on('mouseover', (event, d) => {
            let html = '<div><span class="tooltip-label">Name:</span> ' + d.data.name + '</div>'
            html += '<div><span class="tooltip-label">Category:</span> ' + d.data.category + '</div>'
            html += '<div><span class="tooltip-label">Value:</span> ' + format(d.data.value) + '</div>'

            tooltip.html(html)

            .style('left', event.pageX + 10 - svgrect.left + 'px')
            .style('top', event.pageY - 28 - svgrect.top + 'px');
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.attr('data-value', d.data.value)
        })
        .on('mouseout', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0);
        })

    leaf.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        //attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);


    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(' + (width - legendSpace) + ', 10)');

    const legendItems = legend.selectAll('g')
        .data(data.children)
        .enter()
        .append('g')
        .attr('transform', (d, i) => 'translate(10, ' + i * 30 + ')');

    legendItems.append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', d => color(d.name))    
        
        .attr('class', 'legend-item');


    legendItems.append('text')
        .text(d => d.name)
        .attr('transform', 'translate(30, 10)')
        .attr('fill', '#fff');

}

fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
    .then(response => response.json())
    .then(data => {
        draw(data);
    })