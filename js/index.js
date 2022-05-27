// d3.graphScroll()
//     .sections(d3.selectAll('#sections > div'))
//     .on('active', function(i){ console.log(i + 'th section active') })


let map_width = 900;
let map_height = 500
let margin = ({ top: 0, right: 0, bottom: 0, left: 0 });

let show_metro_fringe = true;
let show_open_lands = true;
let show_small_towns = true;

let dot_opacity = .7;

function update_metro_fringe_checkbox() {
  if (d3.select("#metro-fringe").property("checked")) {
    d3.selectAll(".metro-fringe-dots")
      .transition()
      .duration(0)
      .style("opacity", dot_opacity);
  } else {
    d3.selectAll(".metro-fringe-dots").transition().duration(0).style("opacity", 0);
  }
}

function update_open_lands_checkbox() {
  if (d3.select("#open-lands").property("checked")) {
    d3.selectAll(".open-lands-dots")
      .transition()
      .duration(0)
      .style("opacity", dot_opacity);
  } else {
    d3.selectAll(".open-lands-dots").transition().duration(0).style("opacity", 0);
  }
}

function update_small_towns_checkbox() {
  if (d3.select("#small-towns").property("checked")) {
    d3.selectAll(".small-towns-dots")
      .transition()
      .duration(0)
      .style("opacity", dot_opacity);
  } else {
    d3.selectAll(".small-towns-dots").transition().duration(0).style("opacity", 0);
  }
}

function update_metro_counties_checkbox() {
  if (d3.select("#metro-counties").property("checked")) {
    d3.selectAll(".counties")
      .transition()
      .duration(0)
      .style("opacity", 1);
  } else {
    d3.selectAll(".counties").transition().duration(0).style("opacity", 0);
  }
}

function render() {

  let projection = d3
    .geoAlbersUsa()
    .scale((map_width - margin.left - margin.right) * 1.1)
    .translate([
      (map_width - margin.left - margin.right) / 2,
      (map_height + margin.top + margin.bottom) / 2
    ]);

    let path = d3.geoPath().projection(projection);

  Promise.all([
    d3.csv("data/tot_pop_dots_simplified.csv"),
    d3.json("data/counties-10m-simplified-10-metro.json"),
  ]).then(function(files) {
      
    let counties = topojson.feature(files[1], files[1].objects.counties).features;
    let states = topojson.feature(files[1], files[1].objects.states).features;

    let metro_fringe = files[0].filter(function(d) { return +d.variable == 1; });
    let open_lands = files[0].filter(function(d) { return +d.variable == 2; });
    let small_towns = files[0].filter(function(d) { return +d.variable == 3; });

    let svg = d3
      .select("#container")
      .attr("class", "svg-container")
      .append("svg")
      .attr("class", "svg-content")
      .attr("viewBox", [0, 0, map_width + margin.left + margin.right, map_height + margin.bottom + margin.top])
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    const g = svg.append("g");

    g.selectAll(".counties")
      .data(counties)
      .enter()
      .append("path")
      .attr("class", "counties")
      .attr("d", path)
      .attr("fill", "#d0d2ce")
      .attr("stroke-width", "0px")
      .attr("stroke", function (d) {
        return "white";
      });

    g.selectAll(".states")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "states")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#8e8e8e")
      .attr("stroke-width", "1px")
      .attr("stroke-opacity", 1);

    g.selectAll(".dots")
      .data(metro_fringe)
      .enter()
      .append("circle")
      .attr("class", "metro-fringe-dots")
      .attr("cx", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[0];
      })
      .attr("cy", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[1];
      })
      .attr("r", 0.7)
      .attr("fill", "#259299")
      .attr("stroke", "pink")
      .attr("opacity", dot_opacity)
      .attr("stroke-width", 0.0);

    g.selectAll(".dots")
      .data(open_lands)
      .enter()
      .append("circle")
      .attr("class", "open-lands-dots")
      .attr("cx", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[0];
      })
      .attr("cy", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[1];
      })
      .attr("r", 0.7)
      .attr("fill", "#BA578C")
      .attr("stroke", "pink")
      .attr("opacity", dot_opacity)
      .attr("stroke-width", 0.0);

    g.selectAll(".dots")
      .data(small_towns)
      .enter()
      .append("circle")
      .attr("class", "small-towns-dots")
      .attr("cx", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[0];
      })
      .attr("cy", function (d) {
        if (projection([+d["lon"], +d["lat"]]) == null) {
          return;
        }
        return projection([+d["lon"], +d["lat"]])[1];
      })
      .attr("r", 0.7)
      .attr("fill", "#3F8EE6")
      .attr("stroke", "pink")
      .attr("opacity", dot_opacity)
      .attr("stroke-width", 0.0);

    d3.select("#metro-fringe").on("change", update_metro_fringe_checkbox);
    d3.select("#open-lands").on("change", update_open_lands_checkbox);
    d3.select("#small-towns").on("change", update_small_towns_checkbox);
    d3.select("#metro-counties").on("change", update_metro_counties_checkbox);

    // d3.selectAll(".dots")
    //   .transition()
    //   .duration(7500)
    //   .style("opacity", 0.7);

    // function zoomed(event) {
    //   const { transform } = event;
    //   g.attr("transform", transform);
    //   g.attr("stroke-width", 1 / transform.k);
    // }

    // const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    // svg.call(zoom);

  }).catch(function(err) {
      // handle error here
  })
}

render()
// d3.select(window).on('resize', render)

