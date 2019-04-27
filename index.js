var config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: 793,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			tileBias: 64,
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

//
//
//enemies
class Enemies extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.scene = scene;
		this.flipX = true;
		this.scene.add.existing(this);
		this.scene.physics.world.enableBody(this, 0);
		this.body.setCollideWorldBounds(true);
		this.alerted = false;
		this.justAttacked = false;
		this.patrol = function() {
			if (
				!(player.y > this.body.y + 100 || player.y < this.body.y - 100) &&
				!(player.x > this.body.x + 300 || player.x < this.body.x - 300)
			) {
				this.alerted = true;
			}
			if (player.x > this.body.x + 100 || player.x < this.body.x - 50) {
				this.walk();
			}
			if (this.alerted == false) {
				if (this.body.blocked.right) {
					this.body.velocity.x = -this.speed;
					this.flipX = true;
				} else if (this.body.blocked.left) {
					this.flipX = false;
					this.body.velocity.x = this.speed;
				}
			}
			this.alert();
		};
		this.alert = function() {
			if (this.alerted == true && this.justAttacked == false) {
				if (player.x > this.body.x) {
					this.flipX = false;
					this.body.velocity.x = this.speed;
				} else {
					this.body.velocity.x = -this.speed;
					this.flipX = true;
				}
			}
		};
	}
}
class Slime extends Enemies {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.walk = function() {
			if (this.alive == true) {
				this.anims.play('slime-walk', true);
			}
		};
		this.setScale(2);
		this.speed = 50;
		this.alive = true;
		this.body.setVelocityX(-this.speed);
		this.body.setMass(10);
		this.body.setSize(20, 15);
		this.body.setOffset(5, 9);
		this.attack = function() {
			if (this.alive == true) {
				this.anims.play('slime-attack', true);
				if (this.anims.currentFrame.index == 5 && this.anims.currentAnim.key == 'slime-attack') {
					player.hurt();
				}
			}
		};
		this.hurt = function() {
			this.alive = false;

			this.anims.play('slime-die', true);
			setTimeout(() => {
				this.destroy();
			}, 550);
		};
	}
}
class Minotaur extends Enemies {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.speed = 75;
		this.alive = true;
		this.setScale(2);
		this.body.setMass(10);
		this.body.setSize(35, 40);
		this.body.setOffset(32, 22);
		this.justHurt = false;
		this.health = 5;
		this.walk = function() {
			if (this.alive == true) {
				if (this.alerted == true) {
					this.anims.play('minotaur-walk', true);
				} else {
					this.anims.play('minotaur-idol', true);
				}
			}
		};
		this.hit = function() {
			this.hurt();
		};
		this.hurt = function() {
			if (this.health > 0 && this.justHurt == false) {
				this.setTintFill(0xffffff);
				killSX.play();
				setTimeout(() => {
					this.clearTint();
				}, 100);
				this.justHurt = true;
				setTimeout(() => {
					this.justHurt = false;
				}, 400);
				return --this.health;
			} else if (this.health <= 0) {
				this.alive = false;
				killSX.play();
				this.anims.play('minotaur-die', true);
				setTimeout(() => {
					this.destroy();
				}, 1000);
				this.justAttacked = true;
			}
		};
		this.attack = function() {
			if (this.alive == true && this.justAttacked == false) {
				this.justAttacked = true;
				this.body.velocity.x = 0;
				this.anims.play('minotaur-attack', true);
				setTimeout(() => {
					if (
						!(player.y > this.body.y + 100 || player.y < this.body.y - 100) &&
						!(player.x > this.body.x + 100 || player.x < this.body.x - 60)
					) {
						player.hurt();
					}
				}, 300);
			}
			setTimeout(() => {
				this.justAttacked = false;
			}, 1000);
		};
		this.alert = function() {
			if (this.alerted == true && this.justAttacked == false) {
				if (player.x > this.body.x) {
					this.flipX = false;
					this.body.velocity.x = this.speed;
				} else {
					this.body.velocity.x = -this.speed;
					this.flipX = true;
				}
			} else {
				this.body.velocity.x = 0;
			}
		};
	}
}
class Arrow extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene);
		this.setTexture('arrow');
		this.scene.add.existing(this);
		this.scene.physics.world.enableBody(this, 0).setScale(1.5);
		this.body.setAllowGravity(false);
		this.fire = function(x, y, flip) {
			if (flip == true) {
				this.setPosition(x - 30, y + 5);
				this.flipX = true;
				this.body.setVelocityX(-1000);
			} else {
				this.setPosition(x + 30, y + 5);
				this.flipX = false;
				this.body.setVelocityX(1000);
			}
		};
	}
}

function preload() {
	this.load.image('background-0', 'assets/background/layer-0.png');
	this.load.image('background-1', 'assets/background/layer-1.png');
	this.load.image('background-2', 'assets/background/layer-2.png');
	this.load.image('background-3', 'assets/background/layer-3.png');
	this.load.image('background-4', 'assets/background/layer-4.png');
	this.load.image('background-5', 'assets/background/layer-5.png');
	this.load.image('background-6', 'assets/background/layer-6.png');
	this.load.image('background-7', 'assets/background/layer-7.png');
	this.load.image('arrowkeys', 'assets/keyboardArrow.png');
	this.load.image('keyX', 'assets/keyboardX.png');
	this.load.image('keyZ', 'assets/keyboardZ.png');
	this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 50, frameHeight: 37 });
	this.load.spritesheet('dude-bow', 'assets/dude-bow.png', { frameWidth: 50, frameHeight: 37 });
	this.load.spritesheet('hearts', 'assets/hearts-5.png', { frameWidth: 85, frameHeight: 17 });
	this.load.spritesheet('slime', 'assets/slime.png', { frameWidth: 32, frameHeight: 25 });
	this.load.spritesheet('minotaur', 'assets/minotaur.png', { frameWidth: 96, frameHeight: 96 });
	this.load.image('arrow', 'assets/arrow.png');
	this.load.image('egg', 'assets/egg.png');
	this.load.tilemapTiledJSON('map', 'assets/tilemap.json');
	this.load.image('tile', 'assets/tile.png');
	this.load.image('spark', 'assets/blueParticle.png');
	this.load.image('platform', 'assets/platform.png');
	this.load.spritesheet('door', 'assets/door.png', { frameWidth: 18, frameHeight: 48 });
	this.load.spritesheet('switch', 'assets/switch.png', { frameWidth: 16, frameHeight: 16 });
	this.load.image('bow', 'assets/bow.png');
	this.load.audio('music', 'assets/music.mp3');
	this.load.audio('jumpSX', 'assets/jump.wav');
	this.load.audio('shootSX', 'assets/shoot.wav');
	this.load.audio('slashSX', 'assets/slash.wav');
	this.load.audio('stepSX', 'assets/step.wav');
	this.load.audio('hurtSX', 'assets/hurt.wav');
	this.load.audio('impactSX', 'assets/impact.wav');
	this.load.audio('killSX', 'assets/kill.wav');
	this.load.audio('doorOpen', 'assets/doorOpen.mp3');
	this.load.audio('doorClose', 'assets/doorClose.mp3');
	this.load.audio('upgrade', 'assets/upgrade.wav');
	this.load.image('logo', 'assets/logo.png');
}

function create() {
	music = this.sound.add('music', { loop: true, volume: 0.25 });
	music.play();
	jumpSX = this.sound.add('jumpSX', { volume: 0.2 });
	shootSX = this.sound.add('shootSX', { volume: 0.5 });
	slashSX = this.sound.add('slashSX', { volume: 0.7 });
	hurtSX = this.sound.add('hurtSX', { volume: 0.6 });
	impactSX = this.sound.add('impactSX', { volume: 0.1 });
	killSX = this.sound.add('killSX', { volume: 0.4 });
	stepSX = this.sound.add('stepSX', { volume: 0.1 });
	doorOpen = this.sound.add('doorOpen', { volume: 0.8 });
	doorClose = this.sound.add('doorClose', { volume: 0.8 });
	upgrade = this.sound.add('upgrade', { volume: 0.8 });
	this.physics.world.setBounds(0, 0, 8000, 735);
	this.background7 = this.add.tileSprite(0, 0, 8000, config.height, 'background-7').setOrigin(0, 0);
	this.background6 = this.add.tileSprite(0, 0, 8000, config.height, 'background-6').setOrigin(0, 0);
	this.background5 = this.add.tileSprite(0, 0, 8000, config.height, 'background-5').setOrigin(0, 0);
	this.background4 = this.add.tileSprite(0, 0, 8000, config.height, 'background-4').setOrigin(0, 0);
	this.background3 = this.add.tileSprite(0, 0, 8000, config.height, 'background-3').setOrigin(0, 0);
	this.background2 = this.add.tileSprite(0, 0, 8000, config.height, 'background-2').setOrigin(0, 0);
	this.background1 = this.add.tileSprite(0, 0, 8000, config.height, 'background-1').setOrigin(0, 0);
	this.add.image(450, 310, 'keyX').setScale(3);
	this.add.image(900, 300, 'arrowkeys').setScale(3);
	this.add.image(680, 100, 'logo');

	keyHold = this.add.text(3700, 295, 'HOLD', { fontFamily: 'Arial', fontSize: 24, color: '#d6bb9a' });
	keyY = this.add.image(3830, 310, 'keyZ').setScale(3);
	bow = this.physics.add.staticImage(3788, 250, 'bow').setScale(2);
	const map = this.make.tilemap({ key: 'map' });
	const tiles = map.addTilesetImage('tile', 'tile', 16, 16);
	keyHold.visible = false;
	keyY.visible = false;
	worldLayer = map.createDynamicLayer('tileLayer', 'tile', 0, 0).setScale(1);
	worldLayer.setCollisionByExclusion([ -1 ]);

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
		key: 'slime-walk',
		frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 7 }),
		frameRate: 8,
		repeat: -1
	});
	this.anims.create({
		key: 'slime-attack',
		frames: this.anims.generateFrameNumbers('slime', { start: 8, end: 12 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'slime-die',
		frames: this.anims.generateFrameNumbers('slime', { start: 16, end: 20 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'minotaur-walk',
		frames: this.anims.generateFrameNumbers('minotaur', { start: 10, end: 17 }),
		frameRate: 8,
		repeat: 0
	});
	this.anims.create({
		key: 'minotaur-idol',
		frames: this.anims.generateFrameNumbers('minotaur', { start: 50, end: 60 }),
		frameRate: 5,
		repeat: 0
	});
	this.anims.create({
		key: 'minotaur-attack',
		frames: this.anims.generateFrameNumbers('minotaur', { start: 30, end: 34 }),
		frameRate: 5,
		repeat: 0
	});
	this.anims.create({
		key: 'minotaur-die',
		frames: this.anims.generateFrameNumbers('minotaur', { start: 90, end: 95 }),
		frameRate: 5,
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
	hearts = this.add.sprite(20, 20, 'hearts').setScrollFactor(0).setOrigin(0, 0).setDisplaySize(170, 34);

	player = this.physics.add.sprite(100, 700, 'dude').setDisplaySize(124, 92);

	player.justHurt = false;
	player.justFired = false;
	player.moving = false;
	player.bow = false;
	player.activate = function() {
		upgrade.play();
		player.bow = true;
		bow.destroy();
		keyHold.visible = true;
		keyY.visible = true;
	};
	arrow = new Arrow(this, 0, 793);
	enemies = this.add.group();
	slimes = new Slime(this, 1700, 300);
	slime2 = new Slime(this, 2200, 300);
	minotaur1 = new Minotaur(this, 3700, 100);
	minotaur2 = new Minotaur(this, 5600, 100);
	enemies.add(slimes);
	enemies.add(slime2);
	enemies.add(minotaur1);
	enemies.add(minotaur2);
	platform1 = this.physics.add.image(4380, 490, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform1.body.setAllowGravity(false);
	platform2 = this.physics.add.image(4380, 540, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform2.body.setAllowGravity(false);
	platform3 = this.physics.add.image(4880, 500, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform3.body.setAllowGravity(false);
	platform4 = this.physics.add.image(4880, 550, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform4.body.setAllowGravity(false);
	platform5 = this.physics.add.image(5500, 350, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform5.body.setAllowGravity(false);

	platform6 = this.physics.add.image(7920, 570, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform6.body.setAllowGravity(false);

	platform7 = this.physics.add.image(7770, 470, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform7.body.setAllowGravity(false);

	platform8 = this.physics.add.image(7620, 370, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform8.body.setAllowGravity(false);

	platform9 = this.physics.add.image(7470, 270, 'platform').setImmovable(true).setOrigin(0.5, 0.5);
	platform9.body.setAllowGravity(false);

	this.tweens.timeline({
		targets: [ platform1.body.velocity, platform3.body.velocity ],
		loop: -1,
		tweens: [
			{
				x: -200,
				y: 50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: 200,
				y: 50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: 200,
				y: -50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: -200,
				y: -50,
				duration: 1000,
				ease: 'Stepped'
			}
		]
	});
	this.tweens.timeline({
		targets: [ platform2.body.velocity, platform4.body.velocity ],
		loop: -1,
		tweens: [
			{
				x: 200,
				y: -50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: -200,
				y: -50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: -200,
				y: 50,
				duration: 1000,
				ease: 'Stepped'
			},
			{
				x: 200,
				y: 50,
				duration: 1000,
				ease: 'Stepped'
			}
		]
	});
	puzzlePlatform = this.tweens.add({
		targets: platform5,
		yoyo: true,
		repeat: -1,
		x: 5500,
		y: 580,
		duration: 1500,
		paused: true
	});
	door0 = this.physics.add.sprite(4080, 360, 'door').setImmovable(true).setScale(2.3);
	door0.body.setAllowGravity(false);
	door0.open = function() {
		this.setFrame(1);
		this.body.setEnable(false);
	};
	door0.close = function() {
		this.setFrame(0);
		this.body.setEnable(true);
	};
	door1 = this.physics.add.sprite(6280, 315, 'door').setImmovable(true).setScale(2.3);
	door1.body.setAllowGravity(false);
	door1.open = function() {
		this.setFrame(1);
		this.body.setEnable(false);
	};
	door1.close = function() {
		this.setFrame(0);
		this.body.setEnable(true);
	};

	door2 = this.physics.add.sprite(6550, 680, 'door').setImmovable(true).setScale(2.3);
	door2.body.setAllowGravity(false);
	door2.closed = false;
	door2.open = function() {
		this.setFrame(1);
		this.body.setEnable(false);
	};
	door2.close = function() {
		this.setFrame(0);
		this.body.setEnable(true);
	};
	switch0 = this.physics.add.sprite(3520, 560, 'switch').setImmovable(true).setScale(4);
	switch0.body.setAllowGravity(false);
	switch0.active = false;
	switch0.hit = function() {
		if (this.active == false) {
			this.setFrame(1);
			this.active = true;
			door0.open();
			doorOpen.play();
		} else {
			this.setFrame(0);
			this.active = false;
			door0.close();
			doorClose.play();
		}
	};
	switch1 = this.physics.add.sprite(6110, 610, 'switch').setImmovable(true).setScale(4);
	switch1.body.setAllowGravity(false);
	switch1.active = false;
	switch1.hit = function() {
		if (this.active == false) {
			this.setFrame(1);
			this.active = true;
		} else {
			this.setFrame(0);
			this.active = false;
		}
		if (door1.body.enable == true) {
			door1.open();
			doorOpen.play();
		} else {
			door1.close();
			doorClose.play();
		}
		setTimeout(() => {
			if (door2.body.enable == true) {
				door2.open();
				doorOpen.play();
			} else {
				door2.close();
				doorClose.play();
			}
		}, 500);

		if (puzzlePlatform.isPlaying()) {
			puzzlePlatform.pause();
		} else {
			puzzlePlatform.resume();
		}
	};

	switch2 = this.physics.add.sprite(6193, 710, 'switch').setImmovable(true).setScale(4);
	switch2.body.setAllowGravity(false);
	switch2.active = false;
	switch2.hit = function() {
		if (this.active == false) {
			this.setFrame(1);
			this.active = true;
		} else {
			this.setFrame(0);
			this.active = false;
		}
		if (door1.body.enable == true) {
			door1.open();
			doorOpen.play();
		} else {
			door1.close();
			doorClose.play();
		}
	};
	platform7.disableBody();
	platform7.alpha = 0.5;
	platform8.disableBody();
	platform8.alpha = 0.5;
	platform9.disableBody();
	platform9.alpha = 0.5;
	switch3 = this.physics.add.sprite(6608, 530, 'switch').setImmovable(true).setScale(4);
	switch3.body.setAllowGravity(false);
	switch3.active = false;
	switch3.hit = function() {
		platform6.disableBody();
		platform6.alpha = 0.5;
		platform7.enableBody();
		platform7.alpha = 1;
		this.setFrame(1);
		setTimeout(() => {
			platform7.disableBody();
			platform7.alpha = 0.5;
			platform6.enableBody();
			platform6.alpha = 1;
			this.setFrame(0);
			impactSX.play();
		}, 2500);
	};
	switch4 = this.physics.add.sprite(6608, 430, 'switch').setImmovable(true).setScale(4);
	switch4.body.setAllowGravity(false);
	switch4.active = false;
	switch4.hit = function() {
		{
			platform7.disableBody();
			platform7.alpha = 0.5;
			platform8.enableBody();
			platform8.alpha = 1;
			this.setFrame(1);
			setTimeout(() => {
				platform8.disableBody();
				platform8.alpha = 0.5;
				this.setFrame(0);
				impactSX.play();
			}, 2500);
		}
	};
	switch5 = this.physics.add.sprite(6608, 330, 'switch').setImmovable(true).setScale(4);
	switch5.body.setAllowGravity(false);
	switch5.active = false;
	switch5.hit = function() {
		{
			platform8.disableBody();
			platform8.alpha = 0.5;
			platform9.enableBody();
			platform9.alpha = 1;
			this.setFrame(1);
			setTimeout(() => {
				platform9.disableBody();
				platform9.alpha = 0.5;
				this.setFrame(0);
				impactSX.play();
			}, 2500);
		}
	};
	player.setCollideWorldBounds(true);
	player.setSize(20, 30).setOffset(15, 5);

	//
	this.physics.add.collider(arrow, enemies.getChildren(), hit, null, this);
	player.setCollideWorldBounds(true);
	player.setSize(20, 30).setOffset(15, 5);
	this.physics.add.collider(
		arrow,
		[ switch0, switch1, switch2, switch3, switch4, switch5, door0, door1, door2 ],
		hit,
		null,
		this
	);
	this.physics.add.collider(
		arrow,
		[ worldLayer, platform1, platform2, platform3, platform4, platform5, door0, door1, door2 ],
		hit,
		null,
		this
	);
	var particles = this.add.particles('spark');
	emitter = particles.createEmitter({ scale: { start: 0.1, end: 0 } });
	emitter.setSpeed(90);
	emitter.setBlendMode(Phaser.BlendModes.ADD);
	egg = this.physics.add.sprite(7250, 120, 'egg').setOrigin(0, 0).setDisplaySize(60, 77);
	emitter.setPosition(egg.x + 30, egg.y + 50);

	this.physics.add.collider(enemies.getChildren(), player, attack, null, this);
	this.physics.add.collider(worldLayer, [ player, enemies ]);
	this.physics.add.overlap(player, bow, player.activate);
	this.physics.add.overlap(player, egg, winGame);
	this.physics.add.collider(
		[
			platform1,
			platform2,
			platform3,
			platform4,
			platform5,
			platform6,
			platform7,
			platform8,
			platform9,
			door0,
			door1,
			door2
		],
		player
	);
	camera = this.cameras.main;
	gameWon = false;
	function winGame() {
		if (gameWon == false) {
			gameWon = true;
			camera.fadeOut(1000, 255, 255, 255);
			setInterval(function() {
				if (music.volume != 0.0) {
					music.volume -= 0.01;
				}
			}, 50);
			setTimeout(() => {
				window.location.replace('https://ericmchavez.github.io/happy-birthday/');
			}, 1000);
		}
	}

	function hit(arrow, target) {
		impactSX.play();
		setTimeout(() => {
			arrow.setPosition(0, 793);
		}, 100);
		target.hit();
	}
	function attack(enemy, player) {
		enemy.attack();
		if (player.anims.currentAnim.key == 'slash') {
			enemy.hurt();
		}
	}
	player.health = 10;
	player.heal = function() {
		if (player.health < 10) {
			return ++player.health;
		}
	};

	player.hurt = function() {
		if (player.health > 0 && player.justHurt == false && !cursors.down.isDown) {
			player.setTintFill(0xffffff);
			hurtSX.play();
			setTimeout(() => {
				player.clearTint();
			}, 100);
			player.justHurt = true;
			setTimeout(function() {
				player.justHurt = false;
			}, 500);
			player.setVelocityY(-300);
			return --player.health;
		} else if (player.health == 0) {
			location.reload();
		}
	};
	worldLayer.setTileIndexCallback(13, player.hurt, this);
	worldLayer.setTileIndexCallback(14, player.hurt, this);

	z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
	cursors = this.input.keyboard.createCursorKeys();

	this.background0 = this.add.tileSprite(0, 0, 8000, config.height, 'background-0').setOrigin(0, 0);
	this.cameras.main.setBounds(0, 0, 8000, 793);
	this.cameras.main.startFollow(player, true, 0.01, 0.01);
	door1.open();
}
action = 'idol';
var previousPosition;
//
//
function update() {
	//player controls!
	playerControls();
	if (egg.y > 130) {
		egg.setGravity(0, -2050);
	} else {
		egg.setGravity(0, -1950);
	}
	emitter.setPosition(egg.x + 30, egg.y + 50);
	updateHealth(player.health);

	for (let i in enemies.getChildren()) {
		enemies.getChildren()[i].patrol();
	}
	if (player.x > 7000 && door2.closed == false) {
		door2.close();
		door2.closed = true;
	}
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
	if (previousPosition > 0 && (player.body.onFloor() || player.body.touching.down)) {
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
		if (player.body.onFloor() || player.body.touching.down) {
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
		stepSX.stop();
	}
	//Jump
	if (cursors.up.isDown && action == 'idol') {
		player.anims.play('jump', true);
		if (player.body.onFloor() || player.body.touching.down) {
			action = 'jump';
			jumpSX.play();
			player.setVelocityY(-900);
		}
	}
	//slash
	if (Phaser.Input.Keyboard.JustDown(x) && (action == 'idol' || action == 'jump')) {
		if (player.body.onFloor() || player.body.touching.down) {
			player.setVelocityX(0);
		}
		player.anims.play('slash', true);

		action = 'slash';
		setTimeout(() => {
			slashSX.play();
		}, 250);
		setTimeout(() => {
			action = 'idol';
		}, 450);
	}
	//shoot
	if (player.anims.currentFrame.index == 8 && player.anims.currentAnim.key == 'shoot' && player.justFired == false) {
		player.justFired = true;
		arrow.fire(player.x, player.y, player.flipX);
		shootSX.play();
		setTimeout(function() {
			player.justFired = false;
		}, 500);
	}
	if (
		Phaser.Input.Keyboard.JustUp(z) &&
		(player.body.onFloor() || player.body.touching.down) &&
		(action == 'shoot' || action == 'idol')
	) {
		action = 'idol';
	}
	if (
		Phaser.Input.Keyboard.JustDown(z) &&
		(player.body.onFloor() || player.body.touching.down) &&
		(action == 'shoot' || action == 'idol') &&
		player.bow == true
	) {
		action = 'shoot';
		player.setVelocityX(0);
		player.anims.play('shoot', true);
	}
	previousPosition = player.body.velocity.y;

	if (
		(player.body.onFloor() || player.body.touching.down) &&
		(player.body.velocity.x > 10 || player.body.velocity.x < -10) &&
		player.moving == false
	) {
		player.moving = true;
		stepSX.play();
		setTimeout(function() {
			player.moving = false;
		}, 300);
	}
}
