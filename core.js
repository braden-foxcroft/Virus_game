// Virus_game
// The JS file
// By Braden Foxcroft [UCID:30090898]
// Runs the game, managing game objects, mechanics, and display.


// Canvas, context
var can, con;

// Width and height of usable canvas
var WIDTH;
var HEIGHT;
// 1024x768

// A timer for the screen refresh
var timerVar;

// Tile types: file, wall, interactive, antiVirus, infected, encrypted, dormant, AdminAccess, encryptedDormant
// Entities: you, 3 antivirus, virus C, scans.

// A level is an array of: 
// - A board (2d array, 32x24)
// - An array of length 2 (x and y of player)
// - An array of enemies. Each enemy is:
//  - A starting position
//  - An array of other positions to move to.
//  - An index to currently move towards.

// Keeps track of debugging flags
// use shift-1 through shift-7 to toggle them, shift-0 to reset all.
// Flags in order are: graphics, collision, flooding, enemy movement, encrypted files memory, fast worm, gridlines
// Graphics: clear the screen after drawing each frame, to show what was drawn that 'tick'
// Collision: show how collision is managed, by showing steps in slow-motion
// Flooding: show tiles that are on the 'just updated' list
// Enemy movement: show the target location of each enemy
// encrypted file memory: Show all tiles in a unique way.
// Fast worm: Make the worm move really fast
// Gridlines: turn on gridlines.
var debugState = [0,0,0,0,0,0,0];

// Dict tracking the key states
var keys = {w:false};

var isMenu = false;

var xMax = 32;
var yMax = 24;

// Level 1
// ---------------------------------------------------------------------
var board1 = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1],
	[1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
var board1Player = [23, 20];
var board1Enemy1 = [
	[0,0],
	[[12,16],[13,16],[13,3],[2,3],[2,16],[2,20],[17,20],[2,20],[2,16]],
	0
	];
var board1Enemy2 = [
	[0,0],
	[[13,3],[13,16],[2,16],[2,20],[17,20],[2,20],[2,3]],
	0
	];
var board1Enemy3 = [
	[0,0],
	[[21,10],[28,10],[28,3],[21,3]],
	0
	];
var board1Enemies = [board1Enemy1, board1Enemy2, board1Enemy3];
var level1 = [board1, board1Player, board1Enemies];

// Level 2
// ---------------------------------------------------------------------
var board2 = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,7,0,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
var board2Player = [2, 21];
var board2Enemy1 = [
	[0,0],
	[[2,18],[7,18]],
	0
	];
var board2Enemy2 = [
	[0,0],
	[[2,13],[7,13]],
	0
	];
var board2Enemy3 = [
	[0,0],
	[[7,10],[2,10]],
	0
	];
var board2Enemy4 = [
	[0,0],
	[[2,2],[26,2]],
	0
	];
var board2Enemy5 = [
	[0,0],
	[[15,6],[29,6],[29,21],[15,21]],
	0
	];
var board2Enemies = [board2Enemy1, board2Enemy2, board2Enemy3, board2Enemy4, board2Enemy5];
var scan2 = [13,30,1];
var level2 = [board2, board2Player, board2Enemies, scan2];

// Level 3
// ---------------------------------------------------------------------
var board3 = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
var board3Player = [23, 20];
var board3Enemy1 = [
	[0,0],
	[[3,3],[3,20],[16,20],[28,20],[3,20]],
	0
	];
var board3Enemy2 = [
	[0,0],
	[[3,3],[16,3],[16,10],[16,3],[16,20],[3,20],[28,20],[28,3]],
	0
	];
var board3Enemy3 = [
	[0,0],
	[[3,3],[28,3],[28,20],[16,20],[16,3]],
	0
	];
var board3Enemies = [board3Enemy1, board3Enemy2, board3Enemy3];
var level3 = [board3, board3Player, board3Enemies];

// Level 4
// ---------------------------------------------------------------------
var board4 = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
var board4Player = [23, 20];
var board4Enemy1 = [
	[0,0],
	[[3,3],[3,20],[16,20],[28,20],[3,20]],
	0
	];
var board4Enemy2 = [
	[0,0],
	[[3,3],[16,3],[16,10],[16,3],[16,20],[3,20],[28,20],[28,3]],
	0
	];
var board4Enemy3 = [
	[0,0],
	[[3,3],[28,3],[28,20],[16,20],[16,3]],
	0
	];
var board4Enemies = [board4Enemy1, board4Enemy2, board4Enemy3];
var scan4 = [2,4,1];
var level4 = [board4, board4Player, board4Enemies, scan4];




var currentBoard;
var currentEnemies;
var timer = 0;
var levelNum = 1;

// This is a block comment for my autohotkey autofiller to suggest relevant stuff
/*
<matchBegin>con.beginPath();<matchEnd>
<matchBegin>con.strokeRect(<matchEnd>
<matchBegin>con.fillRect(<matchEnd>
<matchBegin>con.lineTo(<matchEnd>
<matchBegin>con.moveTo(<matchEnd>
<matchBegin>con.closePath();<matchEnd>
<matchBegin>con.stroke();<matchEnd>
<matchBegin>con.fill();<matchEnd>
<matchBegin>con.lineWidth;<matchEnd>
<matchBegin>con.rotate(Math.PI / 180 * (<matchEnd>
<matchBegin>con.translate(<matchEnd>
<matchBegin>con.scale(<matchEnd>
<matchBegin>con.resetTransform();<matchEnd>
<matchBegin>con.getTransform();<matchEnd>
<matchBegin>con.ctx.setTransform(<matchEnd>
<matchBegin>con.fillStyle<matchEnd>
<matchBegin>con.strokeStyle<matchEnd>
<matchBegin>con.arc(x, y, r, Math.PI / 180 * (startAngle), Math.PI / 180 * (endAngle<matchEnd>
*/

// For arrays, you can splice(start, count), push(value), or get ar.length
// Size of grid is 32 x 24


function onLoad() {
	can = document.getElementById("can"); // can is the canvas
	// enforcing the height is necessary to ensure that there is no blurring or such.
	// blurring results from a difference in the style height and html height (or widths)
	can.width = document.getElementById("can").offsetWidth;
	can.height = document.getElementById("can").offsetHeight;
	WIDTH = can.width;
	HEIGHT = can.height;
	con = can.getContext("2d"); // con is the context
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	can.addEventListener("click", clicked);
	// window.addEventListener("resize", resize);
	// alert(con);
	timerVar = setInterval(update, 1);	// 1 per millisecond
	showMenu();
	
	
}

var playerX = 128;
var playerY = 128;

var allInfected = 0;
var allEncrypted = 0;
var currentLevelNum = 0;

var wormList = [];

var isPlaying = true;
var bar = [];
var victoryMeter = 0;

function loadLevel(levelNum) {
	for (var i in debugState) {
		debugState[i] = 0;
	}
	wormList = [];
	isMenu = false;
	winState = 0;
	isPlaying = true;
	playerAlive = true;
	currentLevelNum = levelNum;
	bonuses[4] = 0;
	victoryMeter = 0;
	if (levelNum == 1) {
		level = level1;
	}
	if (levelNum == 2) {
		level = level2;
		bar = level[3];
	}
	if (levelNum == 3) {
		level = level3;
	}
	if (levelNum == 4) {
		level = level4;
		bar = level[3];
	}
	currentBoard = level[0];
	// Reset current board
	for (y in currentBoard) {
		for (x in currentBoard[y]) {
			cleanTile(x,y);
		}
	}
	allInfected = 0;
	allEncrypted = 0;
	playerX = level[1][0] * 32 + 1;
	playerY = level[1][1] * 32 + 1;
	currentEnemies = level[2];
	// Reset enemy positions
	for (enemyNum in currentEnemies) {
		enemy = currentEnemies[enemyNum];
		enemy[2] = 0;
		enemy[0][0] = enemy[1][0][0];
		enemy[0][1] = enemy[1][0][1];
	}
	
	clear();
	drawMap();
	drawPlayer();
	timerVar = setInterval(update, 1);	// 1 per millisecond
}

var isFlashingTile = false;
var flashingTilePos = [0,0];

var playerMoving = false;
var playerAlive = true;
function update() {
	if (!isPlaying) {
		if (isFlashingTile) {
			timer += 1;
			if (timer % 128 == 0) {
				drawTrackingZone(flashingTilePos[0],flashingTilePos[1]);
			} else if (timer % 128 == 64) {
				tileDraw(flashingTilePos[0],flashingTilePos[1]);
			}
			if (timer > 2000) {
				isFlashingTile = false;
				killPlayer();
			}
			return;
		}
		if (winState == 1) {
			splashText(false);
		} else if (winState == 2) {
			splashText(true);
		}
		clearInterval(timerVar);
		return;
	}
	try {
		timer += 1;
		if (!bonuses[3] && timer % 32 == 0) {
			if (debugState[0]) {
				clear();
			}
			updateEnemies();
		}
		if (bonuses[2] && timer % 128 == 0) {
			wormStep();
		} else if (bonuses[2] && debugState[5] &&  timer % 32 == 0) {
			wormStep();
		}
		if (currentLevelNum == 3 && timer % 256 == 0) {
			victoryAdvance();
		}
		if (playerAlive) {
			playerMove();
			checkForCollisions();
		}
		if (playerAlive) {
			if (bonuses[0]) {
				playerTrail();
			}
			drawPlayer();
		} else {
			checkLoss();
		}
		if (debugState[3]) {
			drawEnemyPaths();
		}
		if (currentLevelNum == 4 && allEncrypted == 294) {
			winState = 2;
			isPlaying = false;
		}
	} catch (e) {
		alert(e);
		location.reload();
		isPlaying = false;
	}
}

function playerTrail() {
	buildSquare(playerX, playerY, setVirus);
}

function setVirus(x, y) {
	var append = false;
	if (currentBoard[y][x] == 0) {
		currentBoard[y][x] = 4;
		allInfected += 1;
		allEncrypted += 1;
		append = true;
	} else if (currentBoard[y][x] == 5) {
		currentBoard[y][x] = 4;
		allInfected += 1;
		append = true;
	}
	if (append && bonuses[2]) {
		wormList.push([x,y]);
		drawLiveWormTile(x,y);
	}
	return append;	// Says if the tile was changed
}

function victoryAdvance() {
	if (!playerAlive) {
		return;
	}
	victoryMeter += 1;
	if (victoryMeter >= 31) {
		isPlaying = false;
		winState = 2;
	}
	victoryDisplay(victoryMeter);
}

function victoryDisplay(position) {
	currentBoard[0][position] = 8;
	tileDraw(position,0);
	currentBoard[0][position] = 1;
}

function drawEnemyPaths() {
	for (enemyNum in currentEnemies) {
		enemy = currentEnemies[enemyNum];
		var enemyX = enemy[0][0]*32+16;
		var enemyY = enemy[0][1]*32+16;
		var destX = (enemy[1][enemy[2]][0])*32+16;
		var destY = (enemy[1][enemy[2]][1])*32+16;
		drawLine(enemyX,enemyY,destX,destY,"#00FF00");
	}
}

function updateEnemies() {
	// remove all
	for (enemyIndex in currentEnemies) {
		enemy = currentEnemies[enemyIndex];
		enemyIsNotHere(enemy[0][0],enemy[0][1]);
	}
	
	// remove all
	if (currentLevelNum == 2 || currentLevelNum == 4) {
		for (var i = bar[0]; i <= bar[1]; i++) {
			scanEnd(i,bar[2]);
		}
	}
	
	// update all
	for (enemyIndex in currentEnemies) {
		enemy = currentEnemies[enemyIndex];
		if (isAtDest(enemy)) {
			nextPos(enemy);
		}
		enemyMove(enemy);
	}
	// update all
	if (currentLevelNum == 2 || currentLevelNum == 4) {
		bar[2] += 1;
		if (bar[2] > 22) {
			bar[2] = 1;
		}
	}
	
	// Add all
	for (enemyIndex in currentEnemies) {
		enemy = currentEnemies[enemyIndex];
		enemyIsHere(enemy[0][0],enemy[0][1]);
	}
	// Add all
	if (currentLevelNum == 2 || currentLevelNum == 4) {
		for (var i = bar[0]; i <= bar[1]; i++) {
			scanStart(i,bar[2]);
		}
	}
}

function drawLine(x,y,x2,y2,color) {
	con.lineWidth = 2;
	con.strokeStyle = color;
	con.beginPath();
	con.moveTo(x,y);
	con.lineTo(x2,y2);
	con.stroke();
}

function enemyMove(enemy) {
	curX = enemy[0][0];
	curY = enemy[0][1];
	nextX = enemy[1][enemy[2]][0];
	nextY = enemy[1][enemy[2]][1];
	if (nextX > curX) {
		curX += 1;
	}
	if (nextX < curX) {
		curX -= 1;
	}
	if (nextY > curY) {
		curY += 1;
	}
	if (nextY < curY) {
		curY -= 1;
	}
	enemy[0][0] = curX;
	enemy[0][1] = curY;
}

function enemyIsNotHere(enX,enY) {
	for (x = enX - 1; x <= enX + 1; x++) {
		for (y = enY - 1; y <= enY + 1; y++) {
			noEnemy(x,y);
		}
	}
}

function enemyIsHere(enX,enY) {
	for (x = enX - 1; x <= enX + 1; x++) {
		for (y = enY - 1; y <= enY + 1; y++) {
			yesEnemy(x,y);
		}
	}
}

function yesEnemy(x,y) {
	if (currentBoard[y][x] == 0) {
		currentBoard[y][x] = 3;
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 4) {
		if (!bonuses[1]) {
			allInfected -= 1;
			if (currentLevelNum == 4) {
				currentBoard[y][x] = 9;
			} else {
				currentBoard[y][x] = 3;
			}
			tileDraw(x,y);
		} else {
			currentBoard[y][x] = 6;	// dormant
			tileDraw(x,y);
		}
	} else if (currentBoard[y][x] == 5) {
		currentBoard[y][x] = 9;
		tileDraw(x,y);
	}
}

function noEnemy(x,y) {
	if (currentBoard[y][x] == 3) {
		currentBoard[y][x] = 0;
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 6) {
		currentBoard[y][x] = 4;
		wormList.push([x,y]);
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 9) {
		currentBoard[y][x] = 5;
		wormList.push([x,y]);
		tileDraw(x,y);
	}
	if (bonuses[2]) {
		awakenNearby(x,y);
	}
}

function awakenNearby(x,y) {
	var directions = [[0,1],[1,0],[-1,0],[0,-1]];
	for (dirIndex in directions) {
		dirVar = directions[dirIndex];
		var newX = x + dirVar[0];
		var newY = y + dirVar[1];
		if (currentBoard[newY][newX] == 4) {
			wormList.push([newX,newY]);
			drawLiveWormTile(newX,newY);
		}
	}
	
}

function scanStart(x,y) {
	if (currentBoard[y][x] == 0) {
		currentBoard[y][x] = 3;
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 4) {
		if (currentLevelNum == 4) {
			currentBoard[y][x] = 9;
		} else {
			currentBoard[y][x] = 3;
		}
		allInfected -= 1;
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 6) {
		if (currentLevelNum == 4) {
			currentBoard[y][x] = 5;
		} else {
			currentBoard[y][x] = 3;
		}
		allInfected -= 1;
		tileDraw(x,y);
	} else if (currentBoard[y][x] == 5) {
		currentBoard[y][x] = 9;
		tileDraw(x,y);
	}
}

function cleanTile(x,y) {
	if (currentBoard[y][x] == 3) {
		currentBoard[y][x] = 0;
	} else if (currentBoard[y][x] == 4) {
		currentBoard[y][x] = 0;
	} else if (currentBoard[y][x] == 5) {
		currentBoard[y][x] = 0;
	} else if (currentBoard[y][x] == 6) {
		currentBoard[y][x] = 0;
	} else if (currentBoard[y][x] == 8) {
		currentBoard[y][x] = 7;
	} else if (currentBoard[y][x] == 9) {
		currentBoard[y][x] = 0;
	}
}

function scanEnd(x,y) {
	if (currentBoard[y][x] == 3) {
		currentBoard[y][x] = 0;
		tileDraw(x,y);
	}
	if (currentBoard[y][x] == 9) {
		currentBoard[y][x] = 5;
		tileDraw(x,y);
	}
	if (bonuses[2]) {
		awakenNearby(x,y);
	}
}

function nextPos(enemy) {
	enemy[2] += 1;
	if (enemy[2] >= enemy[1].length) {
		enemy[2] = 0;
	}
}

function isAtDest(enemy) {
	if (enemy[1][enemy[2]][0] != enemy[0][0]) {
		return false;
	}
	if (enemy[1][enemy[2]][1] != enemy[0][1]) {
		return false;
	}
	return true;
}

var collisionResult = 0;
function checkForCollisions() {
	collisionResult = 0;
	if (bonuses[4] && !playerMoving) {
		return;
	}
	buildSquare(playerX, playerY, cellCollisionCheck);
	actOnCollisions();
}

function actOnCollisions() {
	if (collisionResult == 1) {
		killPlayer();
	} else if (collisionResult == 2) {
		levelPass();
	} else if (collisionResult == 3) {
		bonuses[4] = true;
	}
}

function cellCollisionCheck(x, y) {
	if (collisionResult != 0) {
		return;
	}
	if (currentBoard[y][x] == 3 || currentBoard[y][x] == 6 || currentBoard[y][x] == 9) {
		collisionResult = 1;	// Fail.
		if (debugState[1] && !bonuses[0]) {
			isFlashingTile = true;
			flashingTilePos[0] = x;
			flashingTilePos[1] = y;
			timer = 0;
		}
	} else if (currentBoard[y][x] == 2) {
		collisionResult = 2;	// Objective met.
	} else if (currentBoard[y][x] == 7) {
		collisionResult = 3;	// Get powerup
		currentBoard[y][x] = 8;
	}
}

function checkLoss() {
	if (playerAlive) {
		return;
	}
	if (allInfected > 0) {
		return;
	}
	levelFail();
}

function killPlayer() {
	playerAlive = false;
	if (!isFlashingTile) {
		buildSquare(playerX,playerY,tileDraw);
	}
}

var winState = 0;

function levelFail() {
	isPlaying = false;
	winState = 1;
}

function levelPass() {
	isPlaying = false;
	winState = 2;
}

var walls = false;
function playerMove() {
	var move = false;
	
	var oldX = playerX;
	var oldY = playerY;
	
	isWall = false;
	
	if (keys['left']) {
		playerX --;
		move = true;
	}
	if (keys['right']) {
		playerX ++;
		move = true;
	}
	if (keys['up']) {
		playerY --;
		move = true;
	}
	if (keys['down']) {
		playerY ++;
		move = true;
	}
	
	
	if (move) {
		// fix Y axis
		if (!bonuses[3]) {
			if (isWalled(playerX,playerY)) {
				if (isWalled(playerX,oldY)) {
					playerX = oldX;
				}
				if (isWalled(oldX,playerY)) {
					playerY = oldY;
				}
			}
		} else {
			if (playerX < 1) {
				playerX = 1;
			} else if (playerX > 993) {
				playerX = 993;
			}
			if (playerY < 1) {
				playerY = 1;
			} else if (playerY > 737) {
				playerY = 737;
			}
		}
		buildSquare(oldX, oldY, tileDraw);
	}
	playerMoving = move;
}

function wormStep() {
	var tempList = wormList;
	var newList = [];
	wormList = [];
	// Remove extraneous elements
	for (tileIndex in tempList) {
		var tile = tempList[tileIndex];
		var x = tile[0];
		var y = tile[1];
		if (currentBoard[y][x] == 4) {
			newList.push([x,y]);
		}
	}
	// act on good elements
	var directions = [[0,1],[1,0],[-1,0],[0,-1]];
	for (tileIndex in newList) {
		var tile = newList[tileIndex];
		var x = tile[0];
		var y = tile[1];
		for (dirVarIndex in directions) {
			var dirVar = directions[dirVarIndex];
			var newX = x + dirVar[0];
			var newY = y + dirVar[1];
			var wasChanged = setVirus(newX,newY);
			if (currentBoard[newY][newX] == 7) {
				collisionResult = 3;
				actOnCollisions();
				currentBoard[newY][newX] = 8;
			} else if (currentBoard[newY][newX] == 2) {
				collisionResult = 2;
				actOnCollisions();
			}
			
			if (wasChanged) {
				if (!debugState[2]) {
					tileDraw(newX,newY);
				}
			}
		}
		if (debugState[2]) {
			tileDraw(x,y);
		}
	}
}

function drawLiveWormTile(x, y) {
	if (debugState[2]) {
		drawSquare(x*32+1,y*32+1,"#C00000","#F00000");
	}
}

function isWalled(x, y) {
	walls = false;
	buildSquare(x, y, wallCheck);
	return walls;
}

function wallCheck(x, y) {
	if (currentBoard[y][x] == 1) {
		walls = true;
	}
}

function drawMap() {
	for (var x = 0; x < xMax; x++) {
		for (var y = 0; y < yMax; y++) {
			tileDraw(x,y);
		}
	}
	if (currentLevelNum == 3) {
		for (var i = 0; i < victoryMeter + 1; i++) {
			victoryDisplay(i);
		}
	}
}

function clear() {
	con.clearRect(0,0,can.width,can.height);
	con.fillStyle = "#FFFFFF";
	con.fillRect(0,0,can.width,can.height);
	con.fillStyle = "#000000";
	con.fillRect(1,1,can.width - 2,can.height - 2);
}

function tileDraw(x, y) {
	// 0 = passable
	// 1 = wall
	// 2 = objective
	// 3 = AntiVirus
	// 4 = infected
	// 5 = encrypted
	// 6 = dormant
	// 7 = adminAccess
	// 8 = adminAccessObtained
	// 9 = encryptedDormant
	
	if (currentBoard[y][x] == 0) {
		drawSquare(32*x+1,32*y+1,"#000055","#000077");
	} else if (currentBoard[y][x] == 1) {
		drawSquare(32*x+1,32*y+1,"#090909","#0C0C0C");
	} else if (currentBoard[y][x] == 2) {
		drawSquare(32*x+1,32*y+1,"#0F0F0F","#CFCFCF");
	} else if (currentBoard[y][x] == 3) {
		drawSquare(32*x+1,32*y+1,"#003F00","#007000");
	} else if (currentBoard[y][x] == 4) {
		if (debugState[2] && playerMoving && tileUnderPlayer(x,y)) {
			drawLiveWormTile(x,y);
		} else {
			drawSquare(32*x+1,32*y+1,"#3F0000","#500000");
		}
	} else if (currentBoard[y][x] == 5) {
		drawSquare(32*x+1,32*y+1,"#000055","#300077");
	} else if (currentBoard[y][x] == 6) {
		if (debugState[4]) {
			drawSquare(32*x+1,32*y+1,"#003F00","#507000");
		} else {
			drawSquare(32*x+1,32*y+1,"#003F00","#007000");
		}
	} else if (currentBoard[y][x] == 7) {
		drawSquare(32*x+1,32*y+1,"#0F000F","#F000F0");
	} else if (currentBoard[y][x] == 8) {
		drawSquare(32*x+1,32*y+1,"#0F000F","#500050");
	} else if (currentBoard[y][x] == 9) {
		if (debugState[4]) {
			drawSquare(32*x+1,32*y+1,"#003F00","#307077");
		} else {
			drawSquare(32*x+1,32*y+1,"#003F00","#007000");
		}
	}
}


var tileToLookFor = [0,0];
var foundTileToLookFor = false;
function tileUnderPlayer(x,y) {
	if (!playerAlive) {
		return false;
	}
	tileToLookFor[0] = x;
	tileToLookFor[1] = y;
	foundTileToLookFor = false;
	buildSquare(playerX,playerY,checkTileToLookFor);
	return foundTileToLookFor;
}

function checkTileToLookFor(x,y) {
	if (x == tileToLookFor[0] && y == tileToLookFor[1]) {
		foundTileToLookFor = 1;
	}
}

function buildSquare(x, y, func) {
	var xTLow = Math.floor((x-1) / 32);
	var yTLow = Math.floor((y-1) / 32);
	var xTHigh = Math.ceil((x-1) / 32);
	var yTHigh = Math.ceil((y-1) / 32);
	
	
	func(xTLow,yTLow);
	func(xTHigh,yTLow);
	func(xTLow,yTHigh);
	func(xTHigh,yTHigh);
	
}

function drawPlayer() {
	x = playerX;
	y = playerY;
	buildSquare(playerX, playerY, tileDraw);
	
	if (debugState[1]) {
		buildSquare(playerX,playerY, drawTrackingZone);
	}
	if (bonuses[4] && !playerMoving) {
		drawSquare(x,y,"#0F0000","#400000");
	} else {
		drawSquare(x,y,"#0F0000","#A00000");
	}
	
}

var warningOrange = "#ba8a04"
function drawTrackingZone(x,y) {
	drawSquare(32*x+1,32*y+1,warningOrange,warningOrange);
}

function drawSquare(x,y,c1,c2) {
	if (!debugState[6]) {
		c1 = c2;
	}
	con.fillStyle = c1;
	con.fillRect(x,y,32,32);
	con.fillStyle = c2;
	con.fillRect(x + 1,y + 1,30,30);
}

// 1024x768

var curserX = 0;
var curserY = 0;
var levelChoice = 0;
var bonuses = [false,false,false,false,false];
function showMenu() {
	if (isFlashingTile) {
		return; // Ignore if a tile is flashing right now.
	}
	try {
		isPlaying = false;
	} catch(e) {};
	clear();
	isMenu = true;
	bonuses = [false,false,false,false,false];
	levelChoice = 0;
	curserX = 0;
	curserY = 0;
	// quadrants();
	drawTitle();
	drawLevelSelect();
	drawBonusSelect();
	drawGoButton();
	
	
}

function splashText(isWin) {
	if (isWin) {
		drawBox(400,260,224,80,"#E0E0E0","#0F0F0F");
		drawText("Win!","70px Arial","#C00000",440,325);
	} else {
		drawBox(400,260,224,80,"#E0E0E0","#0F0F0F");
		drawText("Lose...","70px Arial","#00C000",410,325);
	}
}

function drawTitle() {
	drawText("Virus_game.exe.rar.ini.zip","50px Arial","#0190FF",200,100);
	drawText("By Braden Foxcroft","20px Arial","#0190FF",415,130);
}

function drawLevelSelect() {
	drawText("Level:","30px Arial","#C0C0C0",471,175)
	for (var i = 0; i < 4; i++) {
		var off = -105;
		if (curserY == 0 && curserX == i) {
			drawBox(277 + 70*i - off,200,50,50,"#10C010","#00FF00");
			drawText((i+1).toString(),"30px Arial","#000000",294+70*i - off,238);
		} else if (curserY != 0 && levelChoice == i) {
			drawBox(277 + 70*i - off,200,50,50,"#10C090","#00FF00");
			drawText((i+1).toString(),"30px Arial","#000000",294+70*i - off,238);
		} else {
			drawBox(277 + 70*i - off,200,50,50,"#105010","#FFFFFF");
			drawText((i+1).toString(),"30px Arial","#CFCFCF",294+70*i - off,238);
		}
	}
	
	drawBox(200,260,624,80,"#E0E0E0","#0F0F0F");
	if (levelChoice == 0) {
		levelText("Play as a normal virus.",0);
		levelText("Dodge antivirus, and reach passwords.txt!",1);
	} else if (levelChoice == 1) {
		levelText("Play as a rootkit.",0);
		levelText("Gain admin permissions, and become invisible when stationary.",1);
		levelText("Use your powers to sneak past the antivirus!",2);
	} else if (levelChoice == 2) {
		levelText("Play as spyware (a keylogger).",0);
		levelText("Stay alive, passively stealing user's data!",1);
		levelText("Survive until the bar at the top fills up!",2);
	} else if (levelChoice == 3) {
		levelText("Play as ransomware.",0);
		levelText("Infect files to permanently encrypt them.",1);
		levelText("Encrypt every file!",2);
	}
	
	
	
}

function levelText(cont, line) {
	drawText(cont,"20px Arial","#000000",205,280 + 25 * line);
}

function bonusText(cont, line) {
	drawText(cont,"20px Arial","#000000",205,280 + 25 * line + downOff);
}

var downOff = 200;
function drawBonusSelect() {
	drawText("Bonuses:","30px Arial","#C0C0C0",445,175+downOff)
	for (var i = 0; i < 4; i++) {
		var off = -105;
		if (curserY == 1 && curserX == i) {
			if (bonuses[i]) {
				drawBox(277 + 70*i - off,200 + downOff,50,50,"#10C010","#0000FF");
			} else {
				drawBox(277 + 70*i - off,200 + downOff,50,50,"#10C010","#00FF00");
			}
			drawText((i+1).toString(),"30px Arial","#000000",294+70*i - off,238 + downOff);
		} else if (bonuses[i]) {
			drawBox(277 + 70*i - off,200 + downOff,50,50,"#10C090","#0000FF");
			drawText((i+1).toString(),"30px Arial","#000000",294+70*i - off,238 + downOff);
		} else {
			drawBox(277 + 70*i - off,200 + downOff,50,50,"#105010","#FFFFFF");
			drawText((i+1).toString(),"30px Arial","#CFCFCF",294+70*i - off,238 + downOff);
		}
	}
	
	drawBox(200,260 + downOff,624,80,"#E0E0E0","#0F0F0F");
	if (curserY == 1) {
		if (curserX == 0) {
			bonusText("Normal virus behavior.",0);
			bonusText("When you interact with files, you infect them.",1);
			bonusText("Click on an infected file to run it, making an infected process!",2);
		} else if (curserX == 1) {
			bonusText("You gain the powers of a logic bomb.",0);
			bonusText("The antivirus fails to notice infected files.",1);
			bonusText("Watch out for scans, though!",2);
		} else if (curserX == 2) {
			bonusText("Gain the power of a worm.",0);
			bonusText("Infected files automatically spread their infection.",1);
		} else if (curserX == 3) {
			bonusText("You are now running in Adobe Flash.",0);
			bonusText("The user has already turned off antivirus so they can run you.",1);
			bonusText("Flash isn't properly sandboxed, so you can walk through walls!",2);
		}
	}
	
	
}

function drawGoButton() {
	if (curserY == 2) {
		drawBox(512 - 50,570,100,50,"#10C010","#00FF00");
		drawText("Go","40px Arial","#000000",512-30,610);
	} else {
		drawBox(512 - 50,570,100,50,"#105010","#FFFFFF");
		drawText("Go","40px Arial","#CFCFCF",512-30,610);
	}
}

function drawBox(x,y,width,height,color,border) {
	con.fillStyle = border;
	con.fillRect(x,y,width,height);
	con.fillStyle = color;
	con.fillRect(x+1,y+1,width-2,height-2);
}

function drawText(contents,font,color,x,y) {
	
	con.font = font;
	con.fillStyle = color;
	con.fillText(contents, x, y);
}

function quadrants() {
	drawBox(0,0,1024/2,768/2,"#000000","#FFFFFF");
	drawBox(1024/2,0,1024/2,768/2,"#000000","#FFFFFF");
	drawBox(0,768/2,1024/2,768/2,"#000000","#FFFFFF");
	drawBox(1024/2,768/2,1024/2,768/2,"#000000","#FFFFFF");
}

var keysDown = false;
function menuKey(e,isPressed) {
	if (!isPressed) {
		if (e.key == "Enter" || e.key == " ") {
			if (curserY == 2) {
				loadLevel(levelChoice + 1);
			}
		}
		keysDown = false;
		return;
	}
	if (keysDown) {
		return;
	}
	keysDown = true;
	if (e.key == "ArrowRight" || e.key == "d") {
		menuRight();
	} else if (e.key == "ArrowLeft" || e.key == "a") {
		menuLeft();
	} else if (e.key == "ArrowUp" || e.key == "w") {
		menuUp();
	} else if (e.key == "ArrowDown" || e.key == "s") {
		menuDown();
	} else if (e.key == "Enter" || e.key == " ") {
		if (curserY == 1) {
			bonuses[curserX] = !bonuses[curserX];
			drawBonusSelect();
		} else if (curserY == 0) {
			menuDown();
		}
	}
}

function curserBind() {
	if (curserY == 0 && curserX > 3) {
		curserX = 3;
	}
	if (curserY == 1 && curserX > 3) {
		curserX = 3;
	}
	if (curserX < 0) {
		curserX = 0;
	}
}

function menuRight() {
	curserX += 1;
	curserBind();
	if (curserY == 0) {
		levelChoice = curserX;
		drawLevelSelect();
	} else {
		drawBonusSelect();
	}
}

function menuLeft() {
	curserX -= 1;
	curserBind();
	if (curserY == 0) {
		levelChoice = curserX;
		drawLevelSelect();
	} else {
		drawBonusSelect();
	}
}

function menuUp() {
	curserY = Math.max(curserY - 1,0);
	if (curserY == 0) {
		curserX = levelChoice;
	} else if (curserY == 1) {
		curserX = 0;
	}
	curserBind();
	drawLevelSelect();
	drawBonusSelect();
	drawGoButton();
}

function menuDown() {
	curserY = Math.min(curserY + 1,2);
	if (curserY == 0) {
		curserX = levelChoice;
	} else if (curserY == 1) {
		curserX = 0;
	}
	curserBind();
	drawLevelSelect();
	drawBonusSelect();
	drawGoButton();
}


function keyDown(e) {
	// alert(e.key);
	if (isMenu) {
		menuKey(e,true);
		return;
	}
	
	if (e.key == "ArrowRight" || e.key == "d") {
		keys['right'] = true;
	} else if (e.key == "ArrowLeft" || e.key == "a") {
		keys['left'] = true;
	} else if (e.key == "ArrowUp" || e.key == "w") {
		keys['up'] = true;
	} else if (e.key == "ArrowDown" || e.key == "s") {
		keys['down'] = true;
	} else if (e.key == "Enter" || e.key == " ") {
		// alert(Math.floor(playerX / 32));
		// alert(Math.floor(playerY / 32));
		if (!isPlaying) {
			if (winState == 2) {
				showMenu();
			} else if (winState == 1) {
				loadLevel(currentLevelNum);
			} else {
				showMenu();
			}
		}
	} else if (e.key == "Escape") {
		showMenu();
	}
}

function toggleDebug(flagNum) {
	if (flagNum == 1) {
		if (debugState[0]) {
			drawMap();
		}
		debugState[0] = !debugState[0];
	} else if (flagNum == 2) {
		debugState[1] = !debugState[1];
		drawMap();
	} else if (flagNum == 3) {
		debugState[2] = !debugState[2];
		drawMap();
	} else if (flagNum == 4) {
		if (debugState[3]) {
			drawMap();
		}
		debugState[3] = !debugState[3];
	} else if (flagNum == 5) {
		debugState[4] = !debugState[4];
		drawMap();
	} else if (flagNum == 6) {
		debugState[5] = !debugState[5];
	} else if (flagNum == 7) {
		debugState[6] = !debugState[6];
		drawMap();
	}
	
}

function resetDebugAll() {
	for (ind in debugState) {
		if (debugState[ind]) {
			toggleDebug(ind+1);
		}
	}
}

function keyUp(e) {
	if (isMenu) {
		menuKey(e,false);
		return;
	}
	
	if (e.key == "ArrowRight" || e.key == "d") {
		keys['right'] = false;
	} else if (e.key == "ArrowLeft" || e.key == "a") {
		keys['left'] = false;
	} else if (e.key == "ArrowUp" || e.key == "w") {
		keys['up'] = false;
	} else if (e.key == "ArrowDown" || e.key == "s") {
		keys['down'] = false;
	} else if (e.key == "!") {
		toggleDebug(1);
	} else if (e.key == "@") {
		toggleDebug(2);
	} else if (e.key == "#") {
		toggleDebug(3);
	} else if (e.key == "$") {
		toggleDebug(4);
	} else if (e.key == "%") {
		toggleDebug(5);
	} else if (e.key == "^") {
		toggleDebug(6);
	} else if (e.key == "&") {
		toggleDebug(7);
	} else if (e.key == "\)") {
		resetDebugAll();
	}
}

function clicked(e) {
	if (isMenu) {
		return;
	}
	
	xPos = Math.floor((e.offsetX - 1) / 32);
	yPos = Math.floor((e.offsetY - 1) / 32);
	
	
	if (currentBoard[yPos][xPos] == 4) {
		buildSquare(playerX,playerY,tileDraw);
		if (debugState[2]) {
			playerAlive = false;
			drawMap();
		}
		playerX = xPos * 32 + 1;
		playerY = yPos * 32 + 1;
		playerAlive = true;
	}
}




