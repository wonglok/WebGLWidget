# Improvments made before deadline.
1. Better detection code.
2. iOS Support for GPU Particle Simulation.

# WebGL Widget Description
1. Logo Cube Scene + Noise Texture + Mobile Perf friendly Gaussian Blur Post Processing
2. GPU Simulated Particle Cloud Scene with 5 different animation mode
	* Cyber Squares
	* Edge Pulse + Gaussian Blur Post process.
	* Wave
	* Strom
	* WormHole
3. Built version's download size with gzip on GitHub-Page is about 18.5KB+-
4. Mobile Perf Oriented.
	* Memory Pool to reuse objects
	* Frame Budget Task Manager
	* No redundant GL calls
5. Learn how to use raw gl calls correctly.

# Control in Particle Scene:
1. up,down,left,right to rotate
2. w,a to zoom
3. p to pause particle.


# Credit:

## HTML5 Game Development Insights Book
1. Memory Pool for mvMatrixStack to reuse high churn object
2. Task Manager to defer overbudget background task
3. Eliminated Redundant Calls

## LearningWebGL.com
1. Organising a lot of moving object in LogoFan Scene
2. Textured Cube

## GL-Matrix Library
1. ViewModel,Projection Matrix Manipulation

## xissburg
1. Guassian Blur
	* I fixed mobile bug/limitation
	* http://xissburg.com/faster-gaussian-blur-in-glsl/
	* https://github.com/xissburg/XBImageFilters/ (MIT Licensed)

## Mr.doob & zz85
1. Magic Dust Example
2. FBO Util
3. Particle Simulation GLSL Inspiration
	* http://mrdoob.com/lab/javascript/webgl/particles/magicdust.html


## SilkJS
1. Doulbly Linked List
https://github.com/mschwartz/SilkJS

