function draw(educationData, countiesData) {



    // Declare the chart dimensions and margins.
    const width = 1000;
    const height = 700;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 20;

    var path = d3.geoPath();


    const minData = educationData.reduce((prev, current) => prev.bachelorsOrHigher < current.bachelorsOrHigher ? prev : current).bachelorsOrHigher;
    const maxData = educationData.reduce((prev, current) => prev.bachelorsOrHigher > current.bachelorsOrHigher ? prev : current).bachelorsOrHigher;

    const getColor = d3.scaleThreshold()
        .domain(d3.range(minData, maxData, (maxData - minData) / 8))
        .range(d3.schemeBlues[9]);

    //Add Tooltip

    const tooltip = d3.select('.chart-container').append("div")
        .attr("class", 'tooltip')
        .attr("id", 'tooltip')
        .style('opacity', '0');


    // Create the SVG container.

    const svg = d3.select('.chart-container').append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(countiesData, countiesData.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('fill', d => {
            const educationItem = educationData.find(item => item.fips === d.id);
            return educationItem ? getColor(educationItem.bachelorsOrHigher) : getColor(0);
        })
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
            const educationItem = educationData.find(item => item.fips === d.id);
            return educationItem ? educationItem.bachelorsOrHigher : 0;
        })
        .on('mouseover', (event, d) => {
            const educationItem = educationData.find(item => item.fips === d.id);
            if (educationItem) {
                let html = `<div>${educationItem.area_name}, ${educationItem.state}: ${educationItem.bachelorsOrHigher}%</div>`

                tooltip.html(html)

                let cc = document.querySelector('.chart-container')
                var rect = cc.getBoundingClientRect();

                tooltip.style('left', event.pageX + 30 - rect.left + 'px')
                tooltip.style('top', event.pageY - rect.top + 'px')
                tooltip.transition().duration(200).style('opacity', 0.9);
                tooltip.attr('data-education', educationItem.bachelorsOrHigher)
            }

        })
        .on('mouseout', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    //Declare Legend

    const legend = svg.append("g").attr('id', 'legend');

    // Declare the x (horizontal position) scale.

    const x = d3.scaleLinear()
        .domain([minData, maxData])
        .range([marginLeft, width / 3]);

    // Add the x-axis.
    legend.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .attr('id', 'x-axis')
        .call(d3.axisBottom(x));

    const legendDomain = x.ticks();
    legendDomain.pop()

    legend.selectAll('rect')
        .data(legendDomain)
        .enter()
        .append('rect')
        .attr('x', d => x(d))
        .attr('y', height - marginBottom - 30)
        .attr('width', (width / 3 - marginLeft) / 7)
        .attr('height', 30)
        .attr('fill', d => getColor(d));

}

fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
    .then(response => response.json())
    .then(educationData => {
        fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
            .then(response => response.json())
            .then(countiesData => {
                draw(educationData, countiesData)
            })

    })