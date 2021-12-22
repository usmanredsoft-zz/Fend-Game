function ScreensManager()
{

}
ScreensManager.init = function (game)
{
	this.game = game;
};
ScreensManager.show = function (screen)
{
	screen.visible = true;
	screen.alpha = 0;
	this.game.world.addChild(screen);

	var tween = this.game.add.tween(screen).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true);
};
ScreensManager.hide = function (screen)
{
	var tween = this.game.add.tween(screen).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.Out, true);
	tween.onComplete.add(ScreensManager.removeScreen, this);
};
ScreensManager.removeScreen = function (screen)
{
	screen.visible = false;
	this.game.world.removeChild(screen);
};