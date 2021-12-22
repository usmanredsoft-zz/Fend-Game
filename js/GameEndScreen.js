function GameEndScreen(game, replay)
{
	Phaser.Group.call(this, game);

	this.scores_tf;
	this.replay_button;

	var bg = game.add.graphics();
	bg.beginFill(0x282425, 0.5);
	bg.drawRect(0, 0, game.width, game.height);
	bg.inputEnabled = true;
	bg.input.enabled = true;
	this.addChild(bg);

	var label_image = game.add.sprite(0, 0, "game_over_screen_high_score_g");
	label_image.scale.setTo(Fend.SCALE);
	label_image.x = (game.width - label_image.width) / 2 | 0;
	label_image.y = ((game.height - label_image.height) / 2 | 0) - 70 * Fend.SCALE;
	this.addChild(label_image);

	this.scores_tf = game.add.text(0, 0, "", { font: (140 * Fend.SCALE)  + "px EkMukta-Regular", fill: "#FFFFFF", align: "center" });
	this.scores_tf.y = label_image.y + (label_image.height / 2 | 0) + 105 * Fend.SCALE;
	this.addChild(this.scores_tf);

	this.send_score_button = new Button(game, "send_score_button", "send_score_button", "send_score_button", true, Fend.SCALE);
	this.send_score_button.x = game.width / 2;
	this.send_score_button.y = (label_image.y + label_image.height + this.send_score_button.height / 2 | 0) + 30 * Fend.SCALE;
	this.addChild(this.send_score_button);

	if (replay)
	{
		this.replay_button = new Button(game, "replay_button", "replay_button", "replay_button", true, Fend.SCALE);
		this.replay_button.x = game.width / 2;
		this.replay_button.y = (this.send_score_button.y + this.send_score_button.height / 2 + this.replay_button.height / 2 | 0) + 20;
		this.addChild(this.replay_button);
	}
}
GameEndScreen.prototype = Object.create(Phaser.Group.prototype);
GameEndScreen.prototype.constructor = GameEndScreen;

GameEndScreen.prototype.setup = function (scores)
{
	this.scores_tf.text = scores;
	this.scores_tf.x = (this.game.width - this.scores_tf.width) / 2 | 0;

	this.send_score_button.enabled = true;
};