var config = {
	type: Phaser.AUTO,
	width: 1439,
	height: 793,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 2000 },
			debug: true
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

function preload() {
	this.load.image('background-0', 'assets/background/layer-0.png');
	this.load.image('background-1', 'assets/background/layer-1.png');
	this.load.image('background-2', 'assets/background/layer-2.png');
	this.load.image('background-3', 'assets/background/layer-3.png');
	this.load.image('background-4', 'assets/background/layer-4.png');
	this.load.image('background-5', 'assets/background/layer-5.png');
	this.load.image('background-6', 'assets/background/layer-6.png');
	this.load.image('background-7', 'assets/background/layer-7.png');
	this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 50, frameHeight: 37 });
	this.load.spritesheet('dude-bow', 'assets/dude-bow.png', { frameWidth: 50, frameHeight: 37 });
	this.load.spritesheet('hearts', 'assets/hearts-5.png', { frameWidth: 85, frameHeight: 17 });
	this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 });
	this.load.image('arrow', 'assets/arrow.png');
	this.load.image('egg', 'assets/egg.png');
	this.load.tilemapTiledJSON('map', 'assets/tilemap.json');
	this.load.image('tile', 'assets/tile.png');
}

function create() {
	this.physics.world.setBounds(0, 0, 8000, 740);
	this.background7 = this.add.tileSprite(0, 0, 8000, config.height, 'background-7').setOrigin(0, 0);
	this.background6 = this.add.tileSprite(0, 0, 8000, config.height, 'background-6').setOrigin(0, 0);
	this.background5 = this.add.tileSprite(0, 0, 8000, config.height, 'background-5').setOrigin(0, 0);
	this.background4 = this.add.tileSprite(0, 0, 8000, config.height, 'background-4').setOrigin(0, 0);
	this.background3 = this.add.tileSprite(0, 0, 8000, config.height, 'background-3').setOrigin(0, 0);
	this.background2 = this.add.tileSprite(0, 0, 8000, config.height, 'background-2').setOrigin(0, 0);
	this.background1 = this.add.tileSprite(0, 0, 8000, config.height, 'background-1').setOrigin(0, 0);

	const map = this.make.tilemap({ key: 'map' });
	const tiles = map.addTilesetImage('tile', 'tile');

	worldLayer = map.createStaticLayer('tileLayer', 0, 0).setScale(400);
	worldLayer.width = 8000;
	hearts = this.add.sprite(20, 20, 'hearts').setScrollFactor(0).setOrigin(0, 0).setDisplaySize(170, 34);

	player = this.physics.add.sprite(100, 650, 'dude').setDisplaySize(124, 92);
	player.justHurt = false;
	player.justFired = false;

	enemies = this.physics.add.sprite(1600, 650, 'slime').setDisplaySize(65, 50);

	egg = this.physics.add.sprite(7250, 120, 'egg').setOrigin(0, 0).setDisplaySize(60, 77);

	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 13 }),
		frameRate: 10
	});
	this.anims.create({
		key: 'slide',
		frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 29 }),
		frameRate: 5
	});
	this.anims.create({
		key: 'stand',
		frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 5,
		repeat: -1
	});
	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('dude', { start: 8, end: 13 }),
		frameRate: 10
	});
	this.anims.create({
		key: 'duck',
		frames: this.anims.generateFrameNumbers('dude', { start: 59, end: 59 }),
		frameRate: 5,
		repeat: -1
	});
	this.anims.create({
		key: 'jump',
		frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
		frameRate: 15,
		repeat: 0
	});
	this.anims.create({
		key: 'slash',
		frames: this.anims.generateFrameNumbers('dude', { start: 48, end: 56 }),
		frameRate: 10,
		repeat: -1
	});
	this.anims.create({
		key: 'shoot',
		frames: this.anims.generateFrameNumbers('dude-bow', { start: 0, end: 9 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'walk',
		frames: this.anims.generateFrameNumbers('slime', { start: 3, end: 8 }),
		frameRate: 8,
		repeat: -1
	});
	this.anims.create({
		key: 'attack',
		frames: this.anims.generateFrameNumbers('slime', { start: 8, end: 12 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'die',
		frames: this.anims.generateFrameNumbers('slime', { start: 16, end: 21 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'heart-1',
		frames: this.anims.generateFrameNumbers('hearts', { start: 0, end: 0 })
	});
	this.anims.create({
		key: 'heart-2',
		frames: this.anims.generateFrameNumbers('hearts', { start: 1, end: 1 })
	});
	this.anims.create({
		key: 'heart-3',
		frames: this.anims.generateFrameNumbers('hearts', { start: 2, end: 2 })
	});
	this.anims.create({
		key: 'heart-4',
		frames: this.anims.generateFrameNumbers('hearts', { start: 3, end: 3 })
	});
	this.anims.create({
		key: 'heart-5',
		frames: this.anims.generateFrameNumbers('hearts', { start: 4, end: 4 })
	});
	this.anims.create({
		key: 'heart-6',
		frames: this.anims.generateFrameNumbers('hearts', { start: 5, end: 5 })
	});
	this.anims.create({
		key: 'heart-7',
		frames: this.anims.generateFrameNumbers('hearts', { start: 6, end: 6 })
	});
	this.anims.create({
		key: 'heart-8',
		frames: this.anims.generateFrameNumbers('hearts', { start: 7, end: 7 })
	});
	this.anims.create({
		key: 'heart-9',
		frames: this.anims.generateFrameNumbers('hearts', { start: 8, end: 8 })
	});
	this.anims.create({
		key: 'heart-10',
		frames: this.anims.generateFrameNumbers('hearts', { start: 9, end: 9 })
	});
	enemies.setCollideWorldBounds(true);
	enemies.setBounce(0.6);
	enemies.setSize(20, 15).setOffset(8, 10);

	player.setCollideWorldBounds(true);
	player.setSize(20, 30).setOffset(15, 5);

	function clash() {
		enemies.anims.play('attack', true);
		if (action == 'slash') {
			enemies.disableBody();
			enemies.anims.play('die', true);
		} else if (enemies.anims.currentFrame.index == 5 && enemies.anims.currentAnim.key == 'attack') {
			player.hurt();
		}
	}
	function hit() {
		/* arrow hit action */
	}
	var Arrow = new Phaser.Class({
		Extends: Phaser.GameObjects.Image,

		initialize: function Arrow(scene) {
			Phaser.GameObjects.Image.call(this, scene, 0, 0, 'arrow');

			this.speed = Phaser.Math.GetSpeed(900, 1);
		},

		fire: function(x, y, flipX) {
			if (flipX == true) {
				this.setPosition(x - 30, y + 5);
				this.flipX = true;
			} else {
				this.setPosition(x + 30, y + 5);
			}
			this.flip = flipX;
			this.setActive(true);
			this.setVisible(true);
		},

		update: function(time, delta) {
			if (this.flip == true) {
				this.x -= this.speed * delta;
			} else {
				this.x += this.speed * delta;
			}

			if (this.x < -50) {
				this.setActive(false);
				this.setVisible(false);
			}
		}
	});
	arrows = this.add.group({
		classType: Arrow,
		maxSize: 10,
		runChildUpdate: true
	});

	this.physics.add.collider(player, enemies, clash);
	this.physics.add.collider(arrows, enemies, hit);

	player.health = 10;
	player.heal = function() {
		if (player.health < 10) {
			return ++player.health;
		}
	};

	player.hurt = function() {
		if (player.health > 0 && player.justHurt == false && !cursors.down.isDown) {
			player.justHurt = true;
			setTimeout(function() {
				player.justHurt = false;
			}, 500);
			player.setVelocityY(-300);
			return --player.health;
		} else {
			console.log('endgame');
		}
	};

	z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
	cursors = this.input.keyboard.createCursorKeys();

	this.background0 = this.add.tileSprite(0, 0, 8000, config.height, 'background-0').setOrigin(0, 0);
	this.cameras.main.setBounds(0, 0, 8000, 793);
	this.cameras.main.startFollow(player, true, 0.01, 0.01);
}
action = 'idol';
//
//
//
function update() {
	//player controls!
	playerControls();
	if (egg.y > 140) {
		egg.setGravity(0, -2050);
	} else {
		egg.setGravity(0, -1950);
	}
	// enemies
	if (player.x > enemies.x) {
		enemies.setVelocityX(50);
		enemies.flipX = true;
	} else {
		enemies.setVelocityX(-50);
		enemies.flipX = false;
	}
	if ((enemies.x > player.x + 50 || enemies.x < player.x - 50) && enemies.body.enable == true) {
		enemies.anims.play('walk', true);
	}
	updateHealth(player.health);
	//background movement
	this.background2._tilePosition.x = -(this.cameras.main.midPoint.x * 0.1);
	this.background3._tilePosition.x = -(this.cameras.main.midPoint.x * 0.2);
	this.background4._tilePosition.x = -(this.cameras.main.midPoint.x * 0.3);
	this.background5._tilePosition.x = -(this.cameras.main.midPoint.x * 0.4);
	this.background6._tilePosition.x = -(this.cameras.main.midPoint.x * 0.5);
	this.background7._tilePosition.x = -this.cameras.main.midPoint.x;
}
//
function updateHealth(health) {
	hearts.anims.play(`heart-${health}`, true);
}
function playerControls() {
	if (player.body.deltaY() > 0 && player.body.onFloor()) {
		action = 'idol';
	}
	if (cursors.left.isDown) {
		player.flipX = true;
	}
	if (cursors.right.isDown) {
		player.flipX = false;
	}
	if (cursors.down.isDown) {
		player.anims.play('duck', true);
		if (player.body.onFloor()) {
			player.setVelocityX(0);
		}
	} else if (cursors.left.isDown) {
		if (action != 'shoot' && action != 'slash') {
			player.setVelocityX(-220);
		}
		if (action == 'idol') {
			player.anims.play('left', true);
		}
	} else if (cursors.right.isDown) {
		if (action != 'shoot' && action != 'slash') {
			player.setVelocityX(220);
		}
		if (action == 'idol') {
			player.anims.play('right', true);
		}
	} else if (action == 'idol') {
		player.setVelocityX(0);
		player.anims.play('stand', true);
	}
	//Jump
	if (cursors.up.isDown && action == 'idol') {
		player.anims.play('jump', true);
		if (player.body.onFloor()) {
			action = 'jump';
			player.setVelocityY(-1100);
		}
	}
	//slash
	if (Phaser.Input.Keyboard.JustDown(x) && (action == 'idol' || action == 'jump')) {
		if (player.body.onFloor()) {
			player.setVelocityX(0);
		}
		player.anims.play('slash', true);
		action = 'slash';
		setTimeout(() => {
			action = 'idol';
		}, 450);
	}
	//shoot
	if (player.anims.currentFrame.index == 8 && player.anims.currentAnim.key == 'shoot' && player.justFired == false) {
		player.justFired = true;
		var arrow = arrows.get();
		arrow.fire(player.x, player.y, player.flipX);
		setTimeout(function() {
			player.justFired = false;
		}, 500);
	}
	if (Phaser.Input.Keyboard.JustUp(z) && player.body.onFloor() && (action == 'shoot' || action == 'idol')) {
		action = 'idol';
	}
	if (Phaser.Input.Keyboard.JustDown(z) && player.body.onFloor() && (action == 'shoot' || action == 'idol')) {
		action = 'shoot';
		player.setVelocityX(0);
		player.anims.play('shoot', true);
	}
}
