function StartScreen(game, msg)
{
	Phaser.Group.call(this, game);

	var bg = game.add.graphics();
	bg.beginFill(0x959595, 0);
	bg.drawRect(0, 0, game.width, game.height);
	bg.inputEnabled = true;
	bg.input.enabled = true;
	this.addChild(bg);

	var title_g = game.add.sprite(0, 0, "start_screen_title_g");
	title_g.scale.setTo(Fend.SCALE);
	title_g.x = (game.width - title_g.width) / 2 | 0;
	title_g.y = 50 *  Fend.SCALE;
	this.addChild(title_g);

	var yes_side = game.add.sprite(0, 0, "yes_side");
	yes_side.scale.setTo(Fend.SCALE);
	yes_side.y = (game.height - yes_side.height) / 2 | 0 + 20 * Fend.SCALE;
	this.addChild(yes_side);

	var no_side = game.add.sprite(0, 0, "no_side");
	no_side.scale.setTo(Fend.SCALE);
	no_side.x = game.width - no_side.width;
	no_side.y = yes_side.y;
	this.addChild(no_side);

	var msg_tf = game.add.text(0, 0, msg, { font: (60 * Fend.SCALE)  + "px EkMukta-Medium", fill: "#FFFFFF", align: "center" });

	if (msg_tf.width > game.width - 100)
	{
		msg_tf.width = game.width - 100;
		msg_tf.scale.y = msg_tf.scale.x;
	}
	msg_tf.x = (game.width - msg_tf.width) / 2 | 0;
	msg_tf.y = ((game.height - msg_tf.height) / 2 | 0) - 120;
	this.addChild(msg_tf);

	var hand_g = game.add.sprite(0, 0, "start_screen_hand");
	hand_g.scale.setTo(Fend.SCALE);
	hand_g.x = (game.width - hand_g.width) / 2 | 0;
	hand_g.y = msg_tf.y + msg_tf.height + 70 *  Fend.SCALE;
	this.addChild(hand_g);

	this.start_button = new Button(game, "start_button", "start_button", "start_button", true, Fend.SCALE);
	this.start_button.x = game.width / 2;
	this.start_button.y = game.height - (this.start_button.height / 2 | 0) - 140 *  Fend.SCALE;
	this.addChild(this.start_button);
}
StartScreen.prototype = Object.create(Phaser.Group.prototype);
StartScreen.prototype.constructor = StartScreen;