Paths.js
========

[![Build Status](https://travis-ci.org/andreaferretti/paths-js.svg?branch=master)](https://travis-ci.org/andreaferretti/paths-js)

Paths.js is a library to generate [SVG paths](http://www.w3.org/TR/SVG/paths.html), allowing you to create your own charts using a functional and testable API. It provides the primitives to create various shapes and charts starting from raw data, but it does not prescribe how you render these charts. This means you can use Paths.js to build components for your favorite frontend framework, and works even server-side on [NodeJS](http://nodejs.org/).

Paths.js offers three APIs, of increasing abstraction. The lowest level is a chainable API to generate an arbitrary SVG path. On top of this, paths for simple geometric shapes such as polygons or circle sectors are defined. At the highest level, there is an API to generate some simple graphs (pie, line chart, radar...) for a collection of data, assembling the simple shapes.

Latest version is `0.4.6` - see [this](#migration-to-04) for the necessary changes from `0.3.5`.


Table of contents
-----------------

- [Demos](#demos)
- [Philosophy](#philosophy)
- [Documentation](#documentation)
- [Resources](#resources)
- [Browser support](#browser-support)
- [Migration to 0.4](#migration-to-04)
- [Using Paths.js with the Canvas API](#using-pathsjs-with-the-canvas-api)
- [Using Paths.js with Scala.js](#using-pathsjs-with-scalajs)
- [Contributing](#contributing)

Demos
-----

Of course, when judging a chart library, the first request is to have a look at results. But Paths.js is different: it provides the geometry, and you draw the charts.

That said, we have two demos. The [first one](http://andreaferretti.github.io/paths-js-react-demo) is written using React ([source here](https://github.com/andreaferretti/paths-js-react-demo)).

The [old demo](http://andreaferretti.github.io/paths-js-demo/) is written using Ractive ([source here](https://github.com/andreaferretti/paths-js-demo)).

Philosophy
----------

Drawing beautiful charts is a craft, and often one needs to add custom interactions, styling or animations. There are some beautiful chart libraries out there, such as [Flotcharts](http://www.flotcharts.org/) or [Dimple](http://dimplejs.org/), and if those are enough for your needs, they can be a pleasure to use.

In many cases, though, what I really wanted was a library to take care of the generation of the chart, while still leaving me the possibility to render the actual thing. Paths.js does exactly this. It eventually generates [SVG paths](http://www.w3.org/TR/SVG/paths.html) with a high level API. These paths can be then used together with a template engine such as [Mustache](http://mustache.github.io/) or [Handlebars](http://handlebarsjs.com/) to display SVG graphics in the browser. If instead of a static template engine, you use a data binding library, such as [Facebook React](http://facebook.github.io/react/), [Ractive.js](http://www.ractivejs.org/) or [Angular](http://angularjs.org/), you get animated graphics for free.

In designing Paths.js, I have tried to follow a few principles:

* paths should be immutable
* all exposed methods should be pure
* from this follows that it is trivial to test components
* and that they work on Node.js as well
* it should be easy to integrate Paths.js into various frameworks


Documentation
-------------

A detailed documentation is available on the [wiki](). Here are links to the main entry points.

Paths.js offers three APIs, of increasing abstraction. The lowest level is a chainable API to generate an arbitrary SVG path. On top of this, paths for simple geometric shapes such as polygons or circle sectors are defined. At the highest level, there is an API to generate some simple graphs (pie, line chart, radar...) for a collection of data, assembling the simple shapes.

- [Installation and usage](https://github.com/andreaferretti/paths-js/wiki)
- [Low level API](https://github.com/andreaferretti/paths-js/wiki/Low%20level%20API)
- [Mid level API (shapes)](https://github.com/andreaferretti/paths-js/wiki/Mid-level-API)
- [High level API (graphs)](https://github.com/andreaferretti/paths-js/wiki/High-level-API)
- [Miscellaneous](https://github.com/andreaferretti/paths-js/wiki/Miscellaneous)

Those users who prefer explicit typed interfaces can [browse the API](http://andreaferretti.github.io/paths-scala-js) of the Scala.js bindings.

Resources
---------

These resources give a more detailed exposition of the philosophy behind Paths.js:

* [Reactive SVG charts with Ractive.js and Paths.js](http://mlarocca.github.io/01-22-2014/pathsjs_ractive.html) by Marcello La Rocca
* [My talk at MilanoJS user group](https://github.com/andreaferretti/paths-talk-slides), together with the [examples](https://github.com/andreaferretti/paths-talk-examples)
* [Reactive SVG charts with Ractive.js](http://mlarocca.github.io/graphicalweb2014/)
* [Visualization is for Sharing: Using React for Portable Data Visualization](http://viget.com/extend/visualization-is-for-sharing-using-react-for-portable-data-visualization) by Nate Hunzaker
* [How to Create Performant, Template-based Charts with Paths.js](http://www.sitepoint.com/create-performant-template-based-charts-paths-js/)

Browser support
---------------

Paths.js works in any environment that supports a modern version of Javascript, namely ES5. This includes any version of Node.js and all recent browsers. If you need support for older browsers, you can include an [ES5 polyfill](https://github.com/kriskowal/es5-shim/).

On the other hand, not every browser will be able to display the SVG graphics that you will generate. Usually, recent desktop browsers are ok, but mobile browser are slow in adopting the SVG specification. You can refer to [caniuse](http://caniuse.com/#search=svg) for more detailed information.

Migration to 0.4
----------------

Version 0.4 was rewritten in ES6 instead of CoffeeScript for future-proofing. The currently published version is `0.4.0`.

A few API changes were introduced, namely all keys are now camel cased.

In particular:

* in the low-level verbose API, `large_arc_flag` has been renamed to `largeArcFlag`, and `sweep_flag` to `sweepFlag`
* the rectangle width in the Sankey diagram, is now called `rectWidth` instead of `rect_width`

Also, the default for the `gutter` parameter is now `10` everywhere (that is, also in the `Bar` and `Waterfall` charts).

Everything else should be the same, so if you find any regression, please open a issue.

Using Paths.js with the Canvas API
----------------------------------

Paths.js does not directly support the [canvas element](http://en.wikipedia.org/wiki/Canvas_element), essentially because there is no need to do so. The [canvg](https://github.com/gabelerner/canvg) project allows to draw SVG paths on a `<canvas>` element, and it seems that canvas [will be able](http://lists.w3.org/Archives/Public/public-whatwg-archive/2012Mar/0269.html) to support SVG paths natively. Of course, canvas-based solutions limit the possibilities offered by data binding libraries for interaction, but they could be used as a fallback on less recent browsers.

Using Paths.js with Scala.js
----------------------------

It is possible to use Paths.js with [Scala.js](http://www.scala-js.org/) - [this library](https://github.com/andreaferretti/paths-scala-js) defines the bindings.

Contributing
------------

Contributions to Paths.js are always welcome! See [this wiki page](https://github.com/andreaferretti/paths-js/wiki/Contributing) for suggestions and guidelines.
