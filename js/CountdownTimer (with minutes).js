function CountdownTimer(game, game_time)
{
	this.time = game_time;
	this.cur_time = 0;

	this.timer = game.time.create(false);

	this.setup();

	this.tickEvent = new Phaser.Signal();
	this.timeOverEvent = new Phaser.Signal();
}
CountdownTimer.prototype.constructor = CountdownTimer;

CountdownTimer.prototype.setup = function()
{
	this.minutes = Math.floor(this.time / 60);
	this.seconds = this.time - this.minutes * 60;

	this.text = (this.minutes < 10 ? "0" + this.minutes : this.minutes) + ":" + (this.seconds < 10 ? "0" + this.seconds : this.seconds);

	/*this.cur_time = this.minutes * 60 + this.seconds;

	this.text = this.cur_time < 10 ? "0" + this.cur_time : this.cur_time;*/

	this.timer.loop(1000, this.tick, this);
};
CountdownTimer.prototype.tick = function()
{
	if (this.minutes > 0 || this.seconds > 0)
	{
		if (this.seconds > 0)
		{
			this.seconds--;
		}
		else
		{
			if (this.minutes > 0)
			{
				this.minutes--;

				this.seconds = 59;
			}
		}
	}
	else
	{
		this.stop();

		this.timeOverEvent.dispatch();
	}
	this.text = (this.minutes < 10 ? "0" + this.minutes : this.minutes) + ":" + (this.seconds < 10 ? "0" + this.seconds : this.seconds);

	/*this.cur_time = this.minutes * 60 + this.seconds;

	this.text = this.cur_time < 10 ? "0" + this.cur_time : this.cur_time;*/

	this.tickEvent.dispatch();
};
CountdownTimer.prototype.start = function()
{
	this.timer.start();
};
CountdownTimer.prototype.pause = function()
{
	this.timer.stop(false);
};
CountdownTimer.prototype.stop = function()
{
	this.timer.stop();
};
CountdownTimer.prototype.reset = function()
{
	this.timer.stop();
	this.setup();
};