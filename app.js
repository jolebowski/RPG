var randomMove;
var map;
var layer;
var pfall;
var startWalk = false;
var init = false;
var tp = false;
var killTp;
var playerWalk = true;
var pvel = 200;
var racail;
var music;
var player;
var throwed = false;
var spook;
var d;
var lastMove;
var t;
var slot = {
	item: 0
};

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload () {
	//chargement images 
	game.load.audio('mus', 'assets/hero.ogg');
	game.load.image('map', 'assets/map/map.png');

	game.load.image('lbridge', 'assets/map/lbridge.png');
	game.load.image('rbridge', 'assets/map/rbridge.png');

	game.load.image('splash', 'assets/map/test1.gif');
	game.load.image('over', 'assets/map/over.png');
	game.load.image('pokeball', 'assets/map/pokeball.png');

	game.load.image('puurp', 'assets/map/puurp.png');

	game.load.image('rock', 'assets/map/rock.png');

	game.load.image('water', 'assets/map/www.png');
	game.load.image('solidWater', 'assets/map/cw.png');

	game.load.image('pokeLean', 'assets/npc/pokeLean.png');
	game.load.image('roucoul', 'assets/npc/roucoul.png');

	game.load.image('bag', 'assets/player/bag.png');

	game.load.image('text1', 'assets/textbox/text1.png');
	game.load.image('text3', 'assets/textbox/txt3.png');
	game.load.image('text2', 'assets/textbox/txt2.png');
	game.load.image('text4', 'assets/textbox/text4.png');
	game.load.image('text8', 'assets/textbox/text8.png');
	game.load.image('node', 'assets/textbox/node.png');
	game.load.image('lnode', 'assets/textbox/lnode.png');
	game.load.image('push', 'assets/textbox/push.png');
	game.load.image('tp', 'assets/textbox/tp.png');
	game.load.image('spush', 'assets/textbox/spush.png');
	game.load.image('aye', 'assets/textbox/aye.png');
	game.load.image('haha', 'assets/textbox/haha.png');
	game.load.image('pot', 'assets/map/pot.png');
	game.load.spritesheet('player', 'assets/player/link.png', 32, 48, 16);
	
	game.load.image('f1', 'assets/player/f1.gif');
}

function create () {
	//setup + affichage	
	//on prepare
	d = game.input.keyboard.addKey(Phaser.Keyboard.D);
	t = game.input.keyboard.addKey(Phaser.Keyboard.T);

	music = game.add.audio('mus');

	music.play();

	game.world.setBounds(0, 0, 1600, 480);
	//* ce qui va permet d animer tous les objets
	//* arcade est un mode physique y en a dautres
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//position de la ma
	// 00 pour que son poin de pivot s ailligne a langle du plateau
	map = game.add.sprite(0, 0, 'map');

	npc = game.add.physicsGroup();
	spook = npc.create(920, 80, 'pokeLean');
	//pour activer le mode physique
	game.physics.arcade.enable(spook);
	spook.body.immovable = true;


	pfall = game.add.physicsGroup();

	bag = game.add.sprite(830, 2, 'bag');
	bag.scale.setTo(0.5, 0.5);
	bag.fixedToCamera = true;
	bag.cameraOffset.x = 600;
	bag.cameraOffset.y = 2;


	pokeball = game.add.sprite(400, 15, 'pokeball');
	game.physics.arcade.enable(pokeball);
	pokeball.body.immovable = true;

	pot = game.add.sprite(20, 20, 'pot');
	game.physics.arcade.enable(pot);
	pot.body.immovable = true;

	rouc = game.add.physicsGroup();

	rockWaterTop = game.add.physicsGroup();

	for (var i = 0; i < 4; i++) {
		
		randx = Math.floor(Math.random() * (480 - 245 + 1) + 465);
		randy = Math.floor(Math.random() * (420 - 230 + 1) + 450);
		rouc.create(randx, randy, 'roucoul');
		rouc.children[i].body.collideWorldBounds = true;
	}

	var loopTop = 0;
	
	for (var i = 0; i < 18; i++) {
		y = 270;
		rockWaterTop.create(loopTop, y, 'rock');
		loopTop += 25;
	}

	rockWaterBot = game.add.physicsGroup();

	var loopBot = 0;

	for (var i = 0; i < 18; i++) {
		y = 390;
		rockWaterBot.create(loopBot, y, 'rock');
		loopBot += 30;
	}

	rockWaterRight = game.add.physicsGroup();

	var loopRight = 390;

	for (var i = 0; i < 6; i++) {
		x = 455;
		rockWaterRight.create(x, loopRight, 'rock');
		loopRight -= 30;
	}

	rockPathRight = game.add.physicsGroup();

	var loopPathRight = 455;

	for (var i = 0; i < 50; i++) {
		x = 830;
		rockPathRight.create(x, loopPathRight, 'rock');
		loopPathRight -= 30;
	}

	rockPathLeft = game.add.physicsGroup();

	var loopPathLeft = 455;

	for (var i = 0; i < 10; i++) {
		x = 750;
		rockPathLeft.create(x, loopPathLeft, 'rock');
		loopPathLeft -= 25;
	}

	rockPathTop = game.add.physicsGroup();

	var loopPathTop = 800;

	for (var i = 0; i < 15; i++) {
		y = 105;
		rockPathTop.create(loopPathTop, y, 'rock');
		loopPathTop -= 25;
	}

	rockPathBot = game.add.physicsGroup();

	var loopPathBot = 720;

	for (var i = 0; i < 12; i++) {
		y = 230;
		rockPathBot.create(loopPathBot, y, 'rock')
		loopPathBot -= 25;
	}

	for (var i = 0; i < rockPathBot.children.length; i++)
		rockPathBot.children[i].body.immovable = true;

	for (var i = 0; i < rockPathLeft.children.length; i++)
		rockPathLeft.children[i].body.immovable = true;

	for (var i = 0; i < rockPathTop.children.length; i++)
		rockPathTop.children[i].body.immovable = true;

	for (var i = 0; i < rockWaterTop.children.length; i++) {
		if (i !== 0 && i !== 1)
			rockWaterTop.children[i].body.immovable = true;
	}

	for (var i = 0; i < rockWaterBot.length; i++)
		rockWaterBot.children[i].body.immovable = true;

	for (var i = 0; i < rockWaterRight.length; i++)
		rockWaterRight.children[i].body.immovable = true;

	for (var i = 0; i < rockPathRight.length; i++)
		rockPathRight.children[i].body.immovable = true;

/*	bridges = game.add.physicsGroup();
	bridges.create(299, 320, 'lbridge');
	bridges.create(360, 320, 'rbridge');*/

	fallWater = game.add.sprite(330, 320, 'water');
	game.physics.arcade.enable(fallWater);
	fallWater.body.immovable = true;

	water = game.add.physicsGroup();

	textBox = game.add.physicsGroup();

	
	player = game.add.sprite(790, 440, 'player');
	game.physics.arcade.enable(player);
	game.camera.follow(player);
	player.body.collideWorldBounds = true;

	player.animations.add('right', [8, 9, 10, 11, 8], 10, true);
	player.animations.add('left', [4, 5, 6, 7, 4], 10, true);
	player.animations.add('up', [12, 13, 14, 15, 12], 10, true);
	player.animations.add('down', [0, 1, 2, 3, 0], 10, true);


	splash = game.add.sprite(0,0,'splash');
	splash.fixedToCamera = true;
	splash.cameraOffset.x = 0;
	splash.cameraOffset.y = 0;
	//* kan je touche les touches de clavier pour que ca affecte
	cursors = game.input.keyboard.createCursorKeys();

	initGame = function () {

		txt1 = textBox.create(spook.body.x, spook.body.y - 50, 'text1'); // add !!!
		playerWalk = false;
		game.time.events.add(2000, function () {

			txt1.kill();
			txt1 = textBox.create(player.body.x - 90, player.body.y - 100, 'text4');

			game.time.events.add(4000, function () {

				txt1.kill();
				txt1 = textBox.create(spook.body.x + 40, spook.body.y - 50, 'node');

				game.time.events.add(2000, function () {

					txt1.kill();
					txt1 = textBox.create(spook.body.x, spook.body.y - 50, 'text2');

					game.time.events.add(2000, function () {

						txt1.kill();
						txt1 = textBox.create(spook.body.x - 75, spook.body.y - 55, 'text3');

						game.time.events.add(3500, function () {
							txt1.kill();
							txt1 = textBox.create(player.body.x - 40, player.body.y - 60, 'lnode');

							game.time.events.add(2000, function () {

								txt1.kill();
								txt1 = textBox.create(player.body.x - 110, player.body.y - 60, 'text8');

								game.time.events.add(2000, function () {

									txt1.kill();
									txt1 = textBox.create(spook.body.x - 50, spook.body.y - 50, 'push');

									game.time.events.add(2000, function () {
										txt1.kill();
										playerWalk = true;
										rockPathTop.children[14].body.immovable = false;
										rockPathTop.children[13].body.immovable = false;
									}, this);
								}, this);
							}, this);
						}, this);
					}, this);
				}, this);
			}, this);
		}, this);
// rock can be push player can move // bool variable

		init = true;

	};

}

killTp = function () {

	spook.body.velocity.y = 0; // teleportation
	teleportation = textBox.create(spook.body.x - 90, spook.body.y - 50, 'tp');

	game.time.events.add(2000, function () {

		/* delete sprite */
		for (var i = 0; i < textBox.children.length; i++) {
			textBox.children[i].destroy();
		}
		spook.destroy();
		/* recreate spook */
		spook = npc.create(380, 140, 'pokeLean');
		game.physics.arcade.enable(spook);
		spook.body.immovable = true;

		/* end tp phase allow player to move */
		tp = true;
		playerWalk = true;
	}, this);
};

function update () {
	//logique du jeu
	game.physics.arcade.collide(player, fallWater, falldown, null, this); // function to set up new world
	game.physics.arcade.collide(player, spook, startLore, null, this);
	game.physics.arcade.collide(player, rockWaterTop);
	game.physics.arcade.collide(player, rockWaterRight);
	game.physics.arcade.collide(player, rockWaterBot); // function delete to let pass user not possible to move if dialog not setup
	game.physics.arcade.collide(rockWaterTop, rockWaterBot);
	game.physics.arcade.collide(player, rockPathRight);
	game.physics.arcade.collide(player, rockPathTop);
	game.physics.arcade.collide(player, rockPathLeft);
	game.physics.arcade.collide(player, rockPathBot);
	game.physics.arcade.collide(player, pokeball, inventory, null, this);
	game.physics.arcade.collide(rockPathTop, racail, vel, null, this);
	game.physics.arcade.collide(racail, player);
	game.physics.arcade.collide(rouc, rockPathLeft);
	game.physics.arcade.collide(rouc, rockPathBot); //check chicken box for mutual hit
	game.physics.arcade.collide(rouc, rockWaterRight); // move camera
	game.physics.arcade.collide(rouc, rockWaterTop);
	game.physics.arcade.collide(rouc, rockWaterBot);
	game.physics.arcade.collide(player, pot, fonsd, null, this);
	game.physics.arcade.collide(racail, pokeball, catc, null, this);
	game.physics.arcade.collide(pokeball, rockPathTop, release, null, this);
	game.physics.arcade.collide(pokeball, rockPathBot, release, null, this);
	game.physics.arcade.collide(pokeball, rockWaterTop, release, null, this);
	game.physics.arcade.collide(pokeball, rockPathBot, release, null, this);
	game.physics.arcade.collide(pokeball, rockWaterRight, release, null, this);
	game.physics.arcade.collide(pokeball, rockWaterBot, release, null, this);
	game.physics.arcade.collide(pokeball, rockPathRight, release, null, this);
	game.physics.arcade.collide(pokeball, rockPathLeft, release, null, this);
	/* set physics between rouc */
	for (var i = 0; i < rouc.children.length; i++) {
		rouc.children[i].body.collideWorldBounds = true;

		ways = ['left', 'right', 'top', 'bot', 'fix'];
		way = ways[Math.floor(Math.random() * ways.length)];

		speeds = [50, 100, 150, 200];
		speed = speeds[Math.floor(Math.random() * speeds.length)];

		randomMove(i, speed, way);

	}
	//* permet a  la velocity de revenir a 0 kan on arrete d appuyer sur la
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	if (!startWalk) {

		if (spook.body.y < 70)
			spook.body.velocity.y += 2;
		else
			spook.body.velocity.y -= 2
	}
	else {
		if (!tp) {
			playerWalk = false;
			killTp();
		}

	}
// check ordre et technique pour propre
if (d.isDown && slot.item) {
	throwed = true;
	pokeball.destroy();
	pokeball = game.add.sprite(400, 15, 'pokeball');
	game.physics.arcade.enable(pokeball);
	pokeball.body.immovable = true;
}

if (t.isDown && slot.item) {
	pokeball.destroy();
	pokeball = game.add.sprite(player.body.x + 10, player.body.y, 'pokeball');
	game.physics.arcade.enable(pokeball);
	pokeball.body.velocity.x += 200;
}
	if (playerWalk) {
		if (cursors.left.isDown) {
			splash.destroy();
			if (player.body.y <= 230)
				startWalk = true;
			player.animations.play('left', 10, false);
			player.body.velocity.x = -pvel;
			lastMove = 'x';
		} else if (cursors.right.isDown) {
			splash.destroy();
			if (player.body.y <= 230)
				startWalk = true;
			player.animations.play('right', 10, false);
			player.body.velocity.x = pvel;
			lastMove = 'x';
		}
		if (cursors.up.isDown) {
			splash.destroy();
			if (player.body.y <= 230)
				startWalk = true;
			player.animations.play('up', 10, false);
			player.body.velocity.y = -pvel;
			lastMove = 'y';
		} else if (cursors.down.isDown) {
			splash.destroy();
			if (player.body.y <= 230)
				startWalk = true;
			player.animations.play('down', 10, false);
			player.body.velocity.y = pvel;
			lastMove = 'y';
		}
	}
}

function randomMove (i, speed, way) {

	switch (way) {
		case 'left':
			game.time.events.add(3000, function () {
				rouc.children[i].body.velocity.x -= speed;
			}, this);
			break;
		case 'right':
			game.time.events.add(3000, function () {
				rouc.children[i].body.velocity.x = speed;
			}, this);
			break;
		case 'top':
			game.time.events.add(3000, function () {
				rouc.children[i].body.velocity.y -= speed;
			}, this);
			break;
		case 'bot':
			game.time.events.add(3000, function () {
				rouc.children[i].body.velocity.y = speed;
			}, this);
			break;
	}
}

function inventory () {
	playerWalk = false;
	pokeball.destroy();
	pokeball = game.add.sprite(610, 5, 'pokeball');
	game.physics.arcade.enable(pokeball);
	pokeball.body.collideWorldBounds = true;

	pokeball.fixedToCamera = true;
	pokeball.cameraOffset.x = 605;
	pokeball.cameraOffset.y = 4;


	tt = game.add.text(pokeball.body.x - 50, pokeball.body.y, 'D  s en debarasser');
	game.physics.arcade.enable(tt);
	tt.fixedToCamera = true;
	tt.cameraOffset.x = 200;
	tt.cameraOffset.y = 4;

	tt1 = game.add.text(pokeball.body.x - 50, pokeball.body.y + 30, 'T le lancer');
	game.physics.arcade.enable(tt1);
	tt1.fixedToCamera = true;
	tt1.cameraOffset.x = 200;
	tt1.cameraOffset.y = 24;

	game.physics.arcade.enable(tt);

	slot.item = 1;

	if (!throwed) {
		spook.body.velocity.x -= 20;
		spook.body.velocity.y += 20;
	}

	game.time.events.add(3000, function () {
			spook.body.velocity.x = 0;
			spook.body.velocity.y = 0;
			adv = textBox.create(spook.body.x - 30, spook.body.y - 50, 'spush');
			game.time.events.add(1000, function () {
				adv.destroy();
				playerWalk = true;
			}, this)
		}, this);
}

function startLore () {
	if (!init)
		initGame();
}

function vel () {
	aye = textBox.create(racail.body.x + 50, racail.body.y + 10, 'aye');

	game.time.events.add(1000, function (){
		for (var i = 0; i < textBox.children.length; i++) {
			textBox.children[i].destroy();
		}
	}, this)
}

function falldown () {
		player.visible = false;
			test = game.add.sprite(player.body.x + 30, player.body.y + 10, 'f1');
			game.add.text(100, 100, 'Sorry mec tu es mort');
			textBox.create(spook.body.x + 10, spook.body.y - 50, 'haha');
			game.time.events.add(3000, function () {
				over = game.add.sprite(0,0,'over');
				game.time.events.add(2000, function () {
					location.reload();
				}, this)
			}, this);
}

function fonsd () {
	pot.destroy();
	music.playbackRate=0.5;
	puurp = game.add.sprite(0, 0, 'puurp');
	puurp.alpha = 0.6;
	pvel = 400;
	game.time.events.add(2000, function () {
		puurp.alpha = 0.7;
		game.time.events.add(2500, function () {
			puurp.alpha = 0.6;
			game.time.events.add(3000, function () {
				puurp.alpha = 0.5;
				game.time.events.add(3500, function () {
					puurp.alpha = 0.4;
					game.time.events.add(1000, function () {
						puurp.alpha = 0.3;
						game.time.events.add(1000, function () {
							puurp.alpha = 0.2;
							game.time.events.add(1000, function () {
								puurp.alpha = 0.1;
								game.time.events.add(1000, function () {
									puurp.visible = false;
									pvel = 200;
								}, this);
							}, this);
						}, this);
					}, this);
				}, this);
			}, this);
		}, this);
	}, this)
}

function catc () {
	throwed = true;
	if (throwed) {
		slot.pok = 1;
		racail.destroy();
	}
}

function release () {
	if (slot.pok == true) {
		game.add.sprite(pokeball.body.x + 10, pokeball.body.y, 'racail');
		slot.pok == false;
	}
}
