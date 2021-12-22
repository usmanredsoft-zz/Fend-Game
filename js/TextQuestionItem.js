function TextQuestionItem(game, title)
{
	Phaser.Sprite.call(this, game, 0, 0);

	Object.defineProperty(this, "width", {
		get: function ()
		{
			return this.bg.width;
		}
	});
	Object.defineProperty(this, "height", {
		get: function ()
		{
			return this.bg.height;
		}
	});
	this.active = true;
	this.name = title;
	this.inputEnabled = true;

	/*this.bg = game.add.graphics();
	this.bg.beginFill(0xFFFFFF, 1);
	this.bg.drawRect(0, 0, 200 * Fend.SCALE, 100 * Fend.SCALE);
	this.addChild(this.bg);*/

	this.bg = game.add.sprite(0, 0, "text_item_bg");
	this.bg.scale.setTo(Fend.SCALE);
	this.addChild(this.bg);

	this.tf = game.add.text(0, 0, title, {font: (40 * Fend.SCALE)  + "px EkMukta-Medium", fill: "#000000", align: "center"});

	if (this.tf.width > this.bg.width)
	{
		this.tf.width = this.bg.width - 30 * Fend.SCALE;
		this.tf.scale.y = this.tf.scale.x;
	}
	this.tf.x = ((this.bg.width - this.tf.width) / 2 | 0) + 5 * Fend.SCALE;
	this.tf.y = (this.bg.height / 2 | 0) - this.tf.height + 10 * Fend.SCALE;
	this.addChild(this.tf);
}
TextQuestionItem.prototype = Object.create(Phaser.Sprite.prototype);
TextQuestionItem.prototype.constructor = TextQuestionItem;
