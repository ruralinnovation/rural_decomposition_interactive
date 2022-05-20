// d3.graphScroll()
//     .sections(d3.selectAll('#sections > div'))
//     .on('active', function(i){ console.log(i + 'th section active') })


let map_width = 850;
let map_height = 500
let margin = ({ top: 0, right: 10, bottom: 10, left: 0 });

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
    d3.csv("data/tot_pop_dots.csv"),
    d3.json("data/counties-10m.json"),
  ]).then(function(files) {
      
    let counties = topojson.feature(files[1], files[1].objects.counties).features;
    let states = topojson.feature(files[1], files[1].objects.states).features;


    let dta = files[0];
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
      //.style("background-color", "white");

    const g = svg.append("g");

    g.selectAll(".counties")
      .data(counties)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke-width", "0px")
      .attr("stroke", function (d) {
        return "white";
      });

    g.selectAll(".states")
      .data(states)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#d0d2ce")
      .attr("stroke-width", "1px");

    g.selectAll(".dots")
      .data(dta)
      .enter()
      .append("circle")
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
      .attr("fill", function(d) {
        if (d.variable == "rural_in_metro") {
          return "#259299";
        }

        if (d.variable == "rural_in_nonmetro") {
          return "#BA578C";
        }

        return "#3F8EE6";
      })
      .attr("stroke", "pink")
      .attr("opacity", 0.7)
      .attr("stroke-width", 0.0);

    // Title
    g.append("text")
      .style("font-family", "Montserrat")
      .style("font-size", "18px")
      .style("font-weight", 500)
      .text("Open lands")
      .attr("text-anchor", "middle")
      .attr("x", map_width / 2)
      .attr("y", 40);

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

