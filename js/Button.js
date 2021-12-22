function Button(game, def_image_title, over_image_title, press_image_title, enabled, scale_coef, in_scroll_cont, x, y)
{
	Phaser.Sprite.call(this, game, x, y);

	this.game = game;

	Object.defineProperty(this, "enabled", {
		get: function ()
		{
			return this.input.enabled;
		},
		set: function (value)
		{
			this.input.enabled = value;

			if (value)
			{
				if (this.alpha != 1)
				{
					this.scale.setTo(this.def_scale);

					if (this.press_state.alpha != 0)
					{
						this.press_state.alpha =  0;
					}
					game.add.tween(this).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true);
				}
			}
			else
			{
				if (this.alpha != 0)
				{
					game.add.tween(this).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);

					if (this.over_state.alpha != 0)
					{
						game.add.tween(this.over_state).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);
					}
				}
			}
		}
	});
	Object.defineProperty(this, "active", {
		get: function ()
		{
			return this.input.enabled;
		},
		set: function (value)
		{
			this.input.enabled = value;
		}
	});
	Object.defineProperty(this, "width", {
		get: function ()
		{
			return this.def_state.width;
		},
		set: function (value)
		{
			this.def_state.width = value;
			this.over_state.width = value;
			this.press_state.width = value;
		}
	});
	Object.defineProperty(this, "height", {
		get: function ()
		{
			return this.def_state.height;
		},
		set: function (value)
		{
			this.def_state.height = value;
			this.over_state.height = value;
			this.press_state.height = value;
		}
	});
	this.game = game;
	this.id = 0;
	this.pressed = false;
	this.scroll_cont = null;

	this.alpha = enabled ? 1 : 0;
	this.inputEnabled = true;
	//this.input.useHandCursor = true;
	this.enabled = enabled;

	this.def_state = game.add.sprite(0, 0, def_image_title);
	//this.def_state = game.add.sprite(0, 0, "images_atlas", def_image_title);
	this.def_state.anchor.setTo(0.5, 0.5);
	this.addChild(this.def_state);

	this.over_state = game.add.sprite(0, 0, over_image_title);
	//this.over_state = game.add.sprite(0, 0, "images_atlas", over_image_title);
	this.over_state.alpha = 0;
	this.over_state.anchor.setTo(0.5, 0.5);
	this.addChild(this.over_state);

	this.press_state = game.add.sprite(0, 0, press_image_title);
	//this.press_state = game.add.sprite(0, 0, "images_atlas", press_image_title);
	this.press_state.alpha = 0;
	this.press_state.anchor.setTo(0.5, 0.5);
	this.addChild(this.press_state);

	this.width *= scale_coef || 1;
	this.height *= scale_coef || 1;
	this.def_scale = 1;
	this.press_scale = 0.9;

	this.clickEvent = new Phaser.Signal();

	this.events.onInputOver.add(this.showHighlight, this);
	this.events.onInputOut.add(this.hideHighlight, this);
	this.events.onInputDown.add(this.press, this);

	if (! in_scroll_cont)
	{
		this.events.onInputUp.add(this.click, this);
	}
}
Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

Button.prototype.showHighlight = function ()
{
	if (! this.pressed)
	{
		this.game.add.tween(this.over_state).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true);
	}
	else
	{
		this.game.add.tween(this.scale).to({ x: this.press_scale, y: this.press_scale }, 100, Phaser.Easing.Cubic.Out, true);
		this.game.add.tween(this.press_state).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true);
	}
};
Button.prototype.hideHighlight = function ()
{
	this.game.add.tween(this.over_state).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);

	if (this.press_state.alpha > 0)
	{
		this.game.add.tween(this.scale).to({ x: this.def_scale, y: this.def_scale }, 100, Phaser.Easing.Cubic.Out, true);
		this.game.add.tween(this.press_state).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);
	}
};
Button.prototype.press = function ()
{
	this.pressed = true;

	this.game.add.tween(this.scale).to({ x: this.press_scale, y: this.press_scale }, 100, Phaser.Easing.Cubic.Out, true);
	this.game.add.tween(this.press_state).to({ alpha: 1 }, 100, Phaser.Easing.Cubic.Out, true);

	/*if (this.scroll_cont)
	{
		this.scroll_cont.mousePressed(this, this.click, true);
		this.scroll_cont.addlistItemMouseOverListener(this, this.hideHighlight);
	}*/
};
Button.prototype.click = function (state, pointer, is_over)
{
	this.pressed = false;

	if (is_over)
	{
		this.clickEvent.dispatch(this);

		this.game.add.tween(this.scale).to({ x: this.def_scale, y: this.def_scale }, 100, Phaser.Easing.Cubic.Out, true);
		this.game.add.tween(this.press_state).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);
	}
};