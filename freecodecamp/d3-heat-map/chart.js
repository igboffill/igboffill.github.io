function draw(inData) {

    const minTemp = inData.monthlyVariance.reduce((prev, current) => prev.variance < current.variance ? prev : current).variance + inData.baseTemperature;
    const maxTemp = inData.monthlyVariance.reduce((prev, current) => prev.variance > current.variance ? prev : current).variance + inData.baseTemperature;

    const colorsBase = ['4575B4', 'ABD9E9', 'FFFFBF', 'FDAE61', 'D73027'];


    const colorsRgb = colorsBase.map((item, index) => {
        return {
            value: ((maxTemp - minTemp) / (colorsBase.length - 1) * index) + minTemp,
            red: parseInt(item.substring(0, 2), 16),
            green: parseInt(item.substring(2, 4), 16),
            blue: parseInt(item.substring(4, 6), 16)
        }
    });

    const data = inData.monthlyVariance.map(item => {
        const t = inData.baseTemperature + item.variance;
        return { ...item, temperature: t, color: getColorMap(colorsRgb, t) }
    });

    const minYear = d3.min(data, d => d.year);
    const maxYear = d3.max(data, d => d.year);
    document.getElementById('description').innerHTML = minYear + ' - ' + maxYear + ': base temperature ' + inData.baseTemperature + '&#8451;';

    // Declare the chart dimensions and margins.
    const width = 1600;
    const height = 620;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 120;
    const marginLeft = 80;

    // Declare the x (horizontal position) scale.

    const x = d3.scaleLinear()
        .domain([minYear - 0.5, maxYear + 0.5])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.  


    const y = d3.scaleBand()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([marginTop, height - marginBottom]);

    // Declare Legend Scale
    const leyendScaleDomain = colorsBase.map((item, index) => index);
    leyendScaleDomain.push(colorsBase.length);
    const leyendScale = d3.scaleBand()
        .domain(leyendScaleDomain)
        .range([marginLeft, marginLeft + colorsBase.length * 70]);

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
    const monthName = (m) => {
        var date = new Date(0);
        date.setUTCMonth(m);
        date.setUTCDate(15)
        let month = date.toLocaleString('default', { month: 'long' });

        return month.charAt(0).toUpperCase() + month.slice(1);
    };

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .attr('id', 'y-axis')
        .call(d3.axisLeft(y).tickFormat(monthName));

    //Add Tooltip

    const tooltip = d3.select('.chart-container').append("div")
        .attr("class", 'tooltip')
        .attr("id", 'tooltip')
        .style('opacity', '0');

    // Add Data

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => {
            return x(d.year - 0.5);
        })
        .attr('y', d => {

            return y(d.month - 1);
        })
        .attr('class', 'cell')
        .attr('data-year', d => d.year)
        .attr('data-temp', d => d.temperature)
        .attr('fill', d => d.color)
        .attr('data-month', d => d.month - 1)
        .attr('width', (width - marginLeft - marginRight) / (maxYear - minYear))
        .attr('height', (height - marginTop - marginBottom) / 12)
        .on('mouseover', (event, d) => {
            let html = '<div class="tooltip-date"> ' + d.year + ' - ' + monthName(d.month - 1) + '</div>'
            html += '<div><span class="tooltip-label">Temperature:</span> ' + (Math.round((d.temperature + Number.EPSILON) * 100) / 100) + '</div>'
            html += '<div><span class="tooltip-label">Variance:</span> ' + (d.variance > 0 ? '+' : '') + d.variance + '</div>'

            tooltip.html(html)

            tooltip.style('left', x(d.year) - 80 + 'px')
            tooltip.style('top', y(d.month - 1) - 105 + 'px')
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.attr('data-year', d.year)
        })
        .on('mouseout', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0);
        })

    //Add Leyend

    const legend = svg.append('g')
        .attr('id', 'legend');

    legend.append("g")
        .attr("transform", `translate(${marginLeft},${height - 30})`)
        .attr('id', 'leyend-axis')
        .call(d3.axisBottom(leyendScale).tickFormat((l) => {

            const w = (maxTemp - minTemp) / (colorsBase.length - 1);
            return Math.round((minTemp + w * l - w * 0.5 + Number.EPSILON) * 100) / 100;
        }));

    legend.selectAll('rect')
        .data(colorsBase)
        .enter()
        .append('rect')
        .attr('x', (d, index) => {
            return marginLeft + leyendScale(index) + 30;
        })
        .attr('y', height - 70)
        .attr('class', 'legend')
        .attr('fill', d => '#' + d)
        .attr('width', 60)
        .attr('height', 40);
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => { draw(data) })

function convertToDate(t) {
    return new Date(Date.parse('2000-01-01 00:' + t))
}

const getColorMap = (colorsRgb, value) => {

    const toHex = num => {
        let hex = num.toString(16);
        return hex.length === 2 ? hex : '0' + hex;
    }

    const right = colorsRgb.find(i => i.value >= value);
    const left = colorsRgb.slice().reverse().find(i => i.value <= value);

    const refValue = right.value > left.value ? (value - left.value) / (right.value - left.value) : 0;

    const resultColorRGB = {
        red: Math.floor(left.red + (right.red - left.red) * refValue),
        green: Math.floor(left.green + (right.green - left.green) * refValue),
        blue: Math.floor(left.blue + (right.blue - left.blue) * refValue),
    }
    const result = '#' + toHex(resultColorRGB.red) + toHex(resultColorRGB.green) + toHex(resultColorRGB.blue);

    return result;
}