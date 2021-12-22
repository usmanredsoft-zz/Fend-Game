function PauseScreen(game, replay)
{
	Phaser.Group.call(this, game);

	this.scores_tf;
	this.resume_button

	var bg = game.add.graphics();
	bg.beginFill(0x959595, 0.7);
	bg.drawRect(0, 0, game.width, game.height);
	bg.inputEnabled = true;
	bg.input.enabled = true;
	this.addChild(bg);

	var label_image = game.add.sprite(0, 0, "pause_screen_g");
	label_image.scale.setTo(Fend.SCALE);
	label_image.x = (game.width - label_image.width) / 2 | 0;
	label_image.y = ((game.height - label_image.height) / 2 | 0) - 70 * Fend.SCALE;
	this.addChild(label_image);

	/*var tf_01 = game.add.text(0, 0, "PAUSED", { font: (50 * Fend.SCALE)  + "px Roboto Bold", fill: "#000000", align: "center" });
	tf_01.x = (game.width - tf_01.width) / 2 | 0;
	tf_01.y = ((game.height - tf_01.height) / 2 | 0) - 110;
	this.addChild(tf_01);

	var tf_02 = game.add.text(0, 0, "Score", { font: (30 * Fend.SCALE)  + "px Roboto", fill: "#000000", align: "center" });
	tf_02.x = (game.width - tf_02.width) / 2 | 0;
	tf_02.y = tf_01.y + tf_01.height + 30;
	this.addChild(tf_02);

	this.scores_tf = game.add.text(0, 0, "", { font: (45 * Fend.SCALE)  + "px Roboto Bold", fill: "#000000", align: "center" });
	this.scores_tf.y = tf_02.y + tf_02.height;
	this.addChild(this.scores_tf);*/

	this.resume_button = new Button(game, "resume_button", "resume_button", "resume_button", true, Fend.SCALE);
	this.resume_button.x = game.width / 2;
	this.resume_button.y = (label_image.y + label_image.height + this.resume_button.height / 2 | 0) + 30 * Fend.SCALE;
	this.addChild(this.resume_button);

	if (replay)
	{
		this.replay_button = new Button(game, "pause_screen_replay_button", "pause_screen_replay_button", "pause_screen_replay_button", true, Fend.SCALE);
		this.replay_button.x = game.width / 2;
		this.replay_button.y = this.resume_button.y + (this.resume_button.height / 2 | 0) + (this.replay_button.height / 2 | 0) + 25 * Fend.SCALE;
		this.addChild(this.replay_button);
	}
}
PauseScreen.prototype = Object.create(Phaser.Group.prototype);
PauseScreen.prototype.constructor = PauseScreen;

/*PauseScreen.prototype.setup = function (scores)
{
	this.scores_tf.text = scores;
	this.scores_tf.x = (this.game.width - this.scores_tf.width) / 2 | 0;
};*/
