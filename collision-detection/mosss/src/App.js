import React, { Component } from 'react';
import './App.css';
import d3 from 'd3'

class App extends Component {

    componentDidMount() {
        var width = 1000,
      height = 900;

  var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
      root = nodes[0],
      // color = d3.scale.category20();
      color = ['#d4d912', '#dedf46', '#c1bf1d', '#e5e552', '#d8d831']


      // console.log(color, "im the color")

  root.radius = 0;
  root.fixed = true;

  var header = nodes[1]
  header.radius = 270;
  header.fixed = true;


  var force = d3.layout.force()
      .gravity(0.02)
      .charge(function(d, i) { return i ? 0 : -2000; })
      .nodes(nodes)
      .size([width, height]);

  force.start();
  console.log(this.refs.main);
  var svg = d3.select(this.refs.main).append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("circle")
      .data(nodes.slice(2))
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d, i) { return color[i % 5]; });

  force.on("tick", function(e) {
      header.x = width / 2;
      header.y = height / 2;
    var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

    while (++i < n) {
        q.visit(collide(nodes[i]));
    }

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
  });

  function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }
    }


  render() {


    return (
      <div className="App">
        <div className="App-header">
          <h1>collision detection</h1>
        </div>
        <h2 id='h2-text'>What would you like to design today?</h2>
            <div className="ui compact menu my-content">
                <div className="ui simple dropdown item">
                    Pick a Room
                    <i className="dropdown icon"></i>
                    <div className="menu">
                        <div className="item">Living room</div>
                        <div className="item">Bedroom</div>
                        <div className="item">Office</div>
                        <div className="item">Kitchen</div>
                    </div>
                </div>
            </div>
            <div id="main" ref="main">
        </div>
      </div>
    );
  }
}

export default App;
