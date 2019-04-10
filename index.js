var config = {
	type: Phaser.AUTO,
	width: 1439,
	height: 793,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 2000 },
			debug: false
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
	this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 });
	this.load.image('platform', 'assets/15.png');
	this.load.image('arrow', 'assets/arrow.png');
}

function create() {
	this.cameras.main.setBounds(0, 0, 8000, 793);
	this.physics.world.setBounds(0, 0, 8000, 740);

	this.background7 = this.add.tileSprite(0, 0, 8000, config.height, 'background-7').setOrigin(0, 0);
	this.background6 = this.add.tileSprite(0, 0, 8000, config.height, 'background-6').setOrigin(0, 0);
	this.background5 = this.add.tileSprite(0, 0, 8000, config.height, 'background-5').setOrigin(0, 0);
	this.background4 = this.add.tileSprite(0, 0, 8000, config.height, 'background-4').setOrigin(0, 0);
	this.background3 = this.add.tileSprite(0, 0, 8000, config.height, 'background-3').setOrigin(0, 0);
	this.background2 = this.add.tileSprite(0, 0, 8000, config.height, 'background-2').setOrigin(0, 0);
	this.background1 = this.add.tileSprite(0, 0, 8000, config.height, 'background-1').setOrigin(0, 0);
	player = this.physics.add.sprite(100, 450, 'dude');

	enemies = this.physics.add.sprite(1600, 650, 'slime');

	player.setDisplaySize(124, 92);
	enemies.setDisplaySize(65, 50);
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
		key: 'attack',
		frames: this.anims.generateFrameNumbers('slime', { start: 3, end: 8 }),
		frameRate: 8,
		repeat: -1
	});
	this.anims.create({
		key: 'die',
		frames: this.anims.generateFrameNumbers('slime', { start: 16, end: 21 }),
		frameRate: 8,
		repeat: 0
	});
	enemies.setBounce(0.6);
	player.setCollideWorldBounds(true);
	player.setSize(20, 30).setOffset(15, 5);
	enemies.setSize(20, 15).setOffset(8, 10);
	enemies.setCollideWorldBounds(true);
	platforms = this.physics.add.staticGroup();
	z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
	cursors = this.input.keyboard.createCursorKeys();
	function slash() {
		if (action == 'slash') {
			enemies.anims.play('die', true);
			setTimeout(() => {
				enemies.disableBody();
			}, 550);
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

	this.physics.add.collider(player, enemies, slash);
	this.physics.add.collider(arrows, enemies, hit);
	enemies.anims.play('attack', true);
	this.cameras.main.startFollow(player, true, 0.01, 0.01);
	this.background0 = this.add.tileSprite(0, 0, 8000, config.height, 'background-0').setOrigin(0, 0);
}
var lastFired = 0;
var action = 'idol';
function update() {
	//player controls!

	if (player.body.deltaY() > 0 && player.body.onFloor()) {
		action = 'idol';
	}
	if (cursors.down.isDown) {
		player.anims.play('duck', true);
		if (player.body.onFloor()) {
			player.setVelocityX(0);
		}
	} else if (action == 'idol') {
		if (cursors.left.isDown) {
			player.setVelocityX(-200);
			player.flipX = true;
			if ((action = 'idol')) {
				player.anims.play('left', true);
			}
		} else if (cursors.right.isDown) {
			player.setVelocityX(200);
			player.flipX = false;
			if ((action = 'idol')) {
				player.anims.play('right', true);
			}
		} else {
			player.setVelocityX(0);
			player.anims.play('stand', true);
		}
	}
	if (cursors.up.isDown && action == 'idol') {
		player.anims.play('jump', true);
		if (player.body.onFloor()) {
			action = 'jump';
			player.setVelocityY(-1000);
		}
		if (cursors.left.isDown) {
			player.setVelocityX(-200);
			player.flipX = true;
		}
		if (cursors.right.isDown) {
			player.setVelocityX(200);
			player.flipX = false;
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
	if (Phaser.Input.Keyboard.JustDown(z) && player.body.onFloor() && (action == 'shoot' || action == 'idol')) {
		action = 'shoot';
		player.setVelocityX(0);
		player.anims.play('shoot', true);
	}
	if (player.anims.currentFrame.index == 8 && player.anims.currentAnim.key == 'shoot' && this.time.now > lastFired) {
		var arrow = arrows.get();
		arrow.fire(player.x, player.y, player.flipX);
		lastFired = this.time.now + 500;
	}
	if (Phaser.Input.Keyboard.JustUp(z) && player.body.onFloor() && (action == 'shoot' || action == 'idol')) {
		action = 'idol';
	}
	// enemies
	enemies.setVelocityX(-50);

	this.background2._tilePosition.x = -(this.cameras.main.midPoint.x * 0.1);
	this.background3._tilePosition.x = -(this.cameras.main.midPoint.x * 0.2);
	this.background4._tilePosition.x = -(this.cameras.main.midPoint.x * 0.3);
	this.background5._tilePosition.x = -(this.cameras.main.midPoint.x * 0.4);
	this.background6._tilePosition.x = -(this.cameras.main.midPoint.x * 0.5);
	this.background7._tilePosition.x = -this.cameras.main.midPoint.x;
}
