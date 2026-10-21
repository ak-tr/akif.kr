---
title: "bins"
summary: "Procedurally generate 3D printable bins for drawer organisation, packed onto your print bed."
kind: "Web app"
language: "TypeScript"
platform: "Web"
stack: ["React", "Three.js", "TypeScript"]
started: "2024-02-17"
repo: "ak-tr/bins"
site: "https://bins.akif.kr"
image:
  src: "/static/images/projects/bins.png"
  alt: "bins generator showing a drawer split into four bins, with the box and bin settings on the right"
---

Give it a drawer's width, depth and height and it generates a set of bins to fill it. Ten parameters control the split, wall thickness, corner radius and gaps, and your settings are saved in your browser.

## Print beds

Bins are packed onto as few print beds as possible, rotated where that helps. Bins too big for your printer show up red.

Inspired by Node Dojo's [recursive bins](https://github.com/node-dojo/dojo-recursive-bins/) for Blender's Geometry Nodes.
