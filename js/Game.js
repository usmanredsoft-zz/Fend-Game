function Fend()
{
	var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "", { preload: preload,create:create, update: update });
	//var game = new Phaser.Game(480, 800, Phaser.AUTO, "", { preload: preload, create: create, update: update });

	//
	/*game.width = 480;
	game.height = 800;*/
	game.width = window.innerWidth;
	game.height = window.innerHeight;
	//

	var config;
	var questions;
	var answer;
	var questions_amount;
	var game_time;
	var init_fall_interval;
	var fall_interval_dec;
	var min_fall_interval;
	var init_fall_speed;
	var fall_speed_inc;
	var max_fall_speed;
	var fall_speed;
	var lives_amount;
	var lives_init_amount;
	var swipe_left_border;
	var swipe_right_border;
	var item_start_move_pos;
	var item_game_over_pos;
	var images_data;
	var start_screen;
	var pause_screen;
	var game_end_screen;
	var timer_tf;
	var scores_tf;
	var timer;
	var questions_timer;
	var questions_items;
	var game_state = 0;
	var question_item_drag_bounds;
	var dragable_items;
	var selected_item;
	var right_answer_scores;
	var wrong_answer_scores;
	var lose_question_scores;
	var scores = 0;
	var right_answer_sign;
	var wrong_answer_sign;
	var yes_side;
	var no_side;
	var lives_ind_cont;
	var send_score_url;
	var replay;

	var GAME_STATE_PLAY = 1;
	var GAME_STATE_PAUSE = 2;
	var GAME_STATE_END = 3;

	//Fend.SCALE = game.width / 480;
	Fend.SCALE = game.width / 750;

	function preload()
	{
		game.load.json("config", "assets/config.json");
	}
	function create()
	{
		config = game.cache.getJSON("config");

		questions = [];

		questions_amount = config.questions.length;

		var images_urls = [];
		var question;

		for (var i = 0; i < questions_amount; i++)
		{
			question = config.questions[i];

			question.type = "text";
			question.answer = question.answer == "true" ? true : false;

			if (question.question.indexOf(".png") != -1 || question.question.indexOf(".jpg") != -1 || question.question.indexOf(".gif") != -1)
			{
				images_urls.push(question.question);
			}
			questions.push(question);
		}
		game_time = config.game_time;
		init_fall_interval = config.init_fall_interval * 1000;
		fall_interval_dec = config.fall_interval_dec * 1000;
		min_fall_interval = config.min_fall_interval * 1000;

		init_fall_speed = config.init_fall_speed * Fend.SCALE;
		fall_speed_inc = config.fall_speed_inc * Fend.SCALE;
		max_fall_speed = config.max_fall_speed * Fend.SCALE;
		fall_speed = init_fall_speed;

		right_answer_scores = +(config.right_answer_scores);
		wrong_answer_scores = +(config.wrong_answer_scores);
		lose_question_scores = +(config.lose_question_scores);
		lives_init_amount = +(config.lives);
		lives_amount = lives_init_amount;

		send_score_url = config.send_score_url;
		replay = config.replay == "true" ? true : false;

		question_item_drag_bounds = new Phaser.Rectangle(0, 0, game.width, 1);

		timer = new CountdownTimer(game, game_time);

		questions_timer = game.time.create(false);
		questions_timer.loop(init_fall_interval + 300, addQuestion, this);

		var loader = new Phaser.Loader(game);

		loader.image("bg", "assets/images/bg.jpg");
		loader.image("game_over_bottom_g", "assets/images/game_over_bottom_g.png");
		loader.image("game_over_screen_high_score_g", "assets/images/game_over_screen_high_score_g.png");
		loader.image("game_over_screen_low_score_g", "assets/images/game_over_screen_low_score_g.png");
		loader.image("game_over_sign", "assets/images/game_over_sign.png");
		loader.image("life_ind", "assets/images/life_ind.png");
		loader.image("no_side", "assets/images/no_side.png");
		loader.image("pause_button", "assets/images/pause_button.png");
		loader.image("pause_screen_g", "assets/images/pause_screen_g.png");
		loader.image("resume_button", "assets/images/resume_button.png");
		loader.image("right_answer_sign", "assets/images/right_answer_sign.png");
		loader.image("send_score_button", "assets/images/send_score_button.png");
		loader.image("start_button", "assets/images/start_button.png");
		loader.image("start_screen_hand", "assets/images/start_screen_hand.png");
		loader.image("start_screen_title_g", "assets/images/start_screen_title_g.png");
		loader.image("text_item_bg", "assets/images/text_item_bg.png");
		loader.image("wrong_answer_sign", "assets/images/wrong_answer_sign.png");
		loader.image("yes_side", "assets/images/yes_side.png");
		//loader.atlasXML("assets/images/images.png", "assets/images/images.xml");

		if (replay)
		{
			loader.image("replay_button", "assets/images/replay_button.png");
			loader.image("pause_screen_replay_button", "assets/images/pause_screen_replay_button.png");
		}
		if (images_urls.length != 0)
		{
			images_data = [];

			for(i = 0; i < images_urls.length; i++)
			{
				images_data.push([images_urls[i].substring(images_urls[i].lastIndexOf("/") + 1, images_urls[i].lastIndexOf(".")), images_urls[i]]);

				loader.image(images_data[images_data.length - 1][0], images_urls[i]);
			}
		}
		loader.onLoadComplete.add(initGame, this);

		loader.start();

		game.stage.backgroundColor = "#FFFFFF";

		timer.tickEvent.add(updateTimerDisplay, this);
		timer.timeOverEvent.add(gameOver, this);
	}
	function initGame()
	{
		questions_items = [];
		dragable_items = [];

		item_start_move_pos = 75 * Fend.SCALE;
		swipe_left_border = 76 * Fend.SCALE;
		swipe_right_border = game.width - 76 * Fend.SCALE;

		var bg = game.add.sprite(0, 0, "bg");
		bg.width = game.width;
		bg.height = game.height;

		if (images_data)
		{
			for (var i = 0; i < images_data.length; i++)
			{
				for (var j = 0; j < questions.length; j++)
				{
					if (images_data[i][1] == questions[j].question)
					{
						questions[j].type = "image";
						questions[j].question = images_data[i][0];

						break;
					}
				}
			}
		}
		builScreens();

		//
		/*setTimeout(
			function ()
			{
				startGame();
			},
			100);*/
		//

	}
	function builScreens()
	{
		timer_tf = game.add.text(0, 0, timer.text, { font: (36 * Fend.SCALE)  + "px EkMukta-Regular", fill: "#FFFFFF", align: "center" });
		timer_tf.x = (game.width - timer_tf.width) / 2 | 0;
		timer_tf.y = 15 * Fend.SCALE;

		var scores_tf_label = game.add.text(0, 0, "Score:", { font: (36 * Fend.SCALE)  + "px EkMukta-Regular", fill: "#FFFFFF", align: "left" });
		scores_tf_label.x = game.width - scores_tf_label.width - 115 * Fend.SCALE;
		scores_tf_label.y = timer_tf.y;

		scores_tf = game.add.text(0, 0, "0", { font: (56 * Fend.SCALE)  + "px EkMukta-Regular", fill: "#FFFFFF", align: "left" });
		scores_tf.x = scores_tf_label.x + scores_tf_label.width + 10 * Fend.SCALE;
		scores_tf.y = 5 * Fend.SCALE;

		var pause_button = new Button(game, "pause_button", "pause_button", "pause_button", true, Fend.SCALE);
		pause_button.x = timer_tf.x + timer_tf.width + (scores_tf_label.x - (timer_tf.x + timer_tf.width)) / 2;
		pause_button.y = (pause_button.height / 2 + 10 * Fend.SCALE) | 0;

		var game_over_bottom_area = game.add.sprite(0, 0, "game_over_bottom_g");
		game_over_bottom_area.width = game.width;
		game_over_bottom_area.scale.y = game_over_bottom_area.scale.x;
		game_over_bottom_area.y = game.height - game_over_bottom_area.height;

		yes_side = game.add.sprite(0, 0, "yes_side");
		yes_side.scale.setTo(Fend.SCALE);
		yes_side.alpha = 0.25;
		yes_side.y = ((game.height - yes_side.height) / 2 | 0) + 20 * Fend.SCALE;

		no_side = game.add.sprite(0, 0, "no_side");
		no_side.scale.setTo(Fend.SCALE);
		no_side.alpha = yes_side.alpha;
		no_side.x = game.width - no_side.width;
		no_side.y = yes_side.y;

		right_answer_sign = game.add.sprite(0, 0, "right_answer_sign");
		right_answer_sign.scale.setTo(Fend.SCALE);
		right_answer_sign.x = (game.width - right_answer_sign.width) / 2 | 0;
		right_answer_sign.y = (game.height - right_answer_sign.height) / 2 | 0;
		right_answer_sign.alpha = 0;

		wrong_answer_sign = game.add.sprite(0, 0, "wrong_answer_sign");
		wrong_answer_sign.scale.setTo(Fend.SCALE);
		wrong_answer_sign.x = (game.width - wrong_answer_sign.width) / 2 | 0;
		wrong_answer_sign.y = (game.height - wrong_answer_sign.height) / 2 | 0;
		wrong_answer_sign.alpha = 0;

		lives_ind_cont = game.add.group(0, 0);

		var live_ind;

		for (var i = 0; i < lives_amount; i++)
		{
			live_ind = lives_ind_cont.create(0, 0, "life_ind");
			live_ind.scale.setTo(Fend.SCALE);
			live_ind.x = i * (live_ind.width + 10 * Fend.SCALE);
		}
		lives_ind_cont.x = lives_ind_cont.y = 20 * Fend.SCALE;

		game.world.addChild(game_over_bottom_area);
		game.world.addChild(yes_side);
		game.world.addChild(no_side);
		game.world.addChild(right_answer_sign);
		game.world.addChild(wrong_answer_sign);
		game.world.addChild(lives_ind_cont);
		game.world.addChild(pause_button);
		game.world.addChild(timer_tf);
		game.world.addChild(scores_tf_label);
		game.world.addChild(scores_tf);

		item_game_over_pos = game_over_bottom_area.y;

		start_screen = new StartScreen(game, config.rules);
		game.world.addChild(start_screen);

		pause_screen = new PauseScreen(game, replay);
		game.world.removeChild(pause_screen);

		game_end_screen = new GameEndScreen(game, replay);
		game.world.removeChild(game_end_screen);

		pause_button.clickEvent.add(pauseGame, this);

		start_screen.start_button.clickEvent.add(startGame, this);

		pause_screen.resume_button.clickEvent.add(resumeGame, this);

		game_end_screen.send_score_button.clickEvent.add(sendScores, this);

		if (pause_screen.replay_button)
		{
			pause_screen.replay_button.clickEvent.add(replayGame, this);
		}
		if (game_end_screen.replay_button)
		{
			game_end_screen.replay_button.clickEvent.add(replayGame, this);
		}
		ScreensManager.init(game);
	}
	function startGame()
	{
		game_state = GAME_STATE_PLAY;

		game.time.events.add(300, addQuestion, this);

		questions_timer.start();
		timer.start();

		ScreensManager.hide(start_screen);
	}
	function addQuestion()
	{
		var question = questions[Math.floor(Math.random() * questions_amount)];
		//var question = questions[2];

		var question_item = question.type == "image" ? buildImageQuestion(question.question) : buildTextQuestion(question.question);
		//question_item.active = true;
		question_item.answer = question.answer;
		question_item.calculate_speed = true;
		question_item.input.enabled = true;
		question_item.input.enableDrag();
		question_item.alpha = 0;

		//question_item.x = 20 + Math.floor(Math.random() * (game.width - question_item.width - 20));
		question_item.x = (game.width - question_item.width) / 2 | 0;
		question_item.y = item_start_move_pos * Fend.SCALE;
		game.world.add(question_item);

		questions_items.push(question_item);

		if (selected_item)
		{
			game.world.addChild(selected_item);
		}
		questions_timer.events[0].delay -= fall_interval_dec;

		if (questions_timer.events[0].delay < min_fall_interval)
		{
			questions_timer.events[0].delay = min_fall_interval;
		}
		game.add.tween(question_item).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true);

		/*question_item.events.onInputDown.addOnce(startDragQuestionItem, this);
		//question_item.events.onDragUpdate.add(onDragQuestionItem, this);
		question_item.events.onDragStop.addOnce(checkAnswer, this);*/
		/*question_item.events.onInputDown.addOnce(startDragQuestionItem, this);
		question_item.events.onDragUpdate.add(onDragQuestionItem, this);
		question_item.events.onDragStop.addOnce(checkAnswer, this);*/
		question_item.events.onInputDown.add(startDragQuestionItem, this);
		question_item.events.onDragUpdate.add(onDragQuestionItem, this);
		question_item.events.onDragStop.add(checkAnswer, this);
	}
	function buildImageQuestion(question)
	{
		//var image = SpritesPool.get(question);

		//if (! image || image.active)
		//{
			var image = game.add.sprite(0, 0, question);
			//image.active = true;
			image.inputEnabled = true;
			image.scale.setTo(Fend.SCALE);
			image.name = question;

			//SpritesPool.add(question, image);

			/*image.events.onInputDown.add(startDragQuestionItem, this);
			image.events.onDragUpdate.add(onDragQuestionItem, this);
			image.events.onDragStop.add(checkAnswer, this);*/
			//image.events.onDragUpdate.add(onDragQuestionItem, this);
		//}
		return image;
	}
	function buildTextQuestion(question)
	{
		//var text_question = SpritesPool.get(question);

		//if (! text_question || text_question.active)
		//{
			var text_question = new TextQuestionItem(game, question);

			//SpritesPool.add(question, text_question);

			/*text_question.events.onInputDown.add(startDragQuestionItem, this);
			text_question.events.onDragUpdate.add(onDragQuestionItem, this);
			text_question.events.onDragStop.add(checkAnswer, this);*/
			//text_question.events.onDragUpdate.add(onDragQuestionItem, this);
		//}
		/*text_question.tf.text = question;

		if (text_question.tf.width > text_question.bg.width)
		{
			text_question.tf.width = text_question.bg.width - 30;
			text_question.tf.scale.y = text_question.tf.scale.x;
		}
		text_question.tf.x = (text_question.bg.width - text_question.tf.width) / 2 | 0;
		text_question.tf.y = (text_question.bg.height - text_question.tf.height) / 2 | 0;*/

		return text_question;
	}
	function startDragQuestionItem(item)
	{
		item.start_drag_pos = item.x;
		item.prev_drag_pos = item.x;
		game.world.addChild(item);

		selected_item = item;

		/*question_item_drag_bounds.x = -item.width;
		question_item_drag_bounds.y = item.y - 1;
		question_item_drag_bounds.width = game.width + item.width * 2;
		question_item_drag_bounds.height = item.height;

		item.input.boundsRect = question_item_drag_bounds;*/

		questions_items.splice(questions_items.indexOf(item), 1);
	}
	function onDragQuestionItem(item)
	{
		if (item.calculate_speed)
		{
			if (item.x > swipe_left_border && item.x + item.width < swipe_right_border)
			{
				item.drag_speed = item.x - item.prev_drag_pos;
				item.drag_speed_add = item.x - item.start_drag_pos;
			}
			else
			{
				item.calculate_speed = false;
			}
		}
		item.prev_drag_pos = item.x;
	}
	function checkAnswer(item)
	{
		if (item.x < swipe_left_border || item.x + item.width > swipe_right_border)
		{
			if (item.answer)
			{
				if (item.drag_speed_add < 0)
				{
					rightAnswer();
				}
				else
				{
					wrongAnswer();
				}
			}
			else
			{
				if (item.drag_speed_add > 0)
				{
					rightAnswer();
				}
				else
				{
					wrongAnswer();
				}
			}
			if (item.drag_speed == 0)
			{
				if (item.drag_speed_add < 0)
				{
					item.drag_speed = -1;
				}
				else
				{
					item.drag_speed = 1;
				}
			}
			//item.drag_speed *= 2;
			item.input.enabled = false;

			dragable_items.push(item);

			item.events.onInputDown.remove(startDragQuestionItem, this);
			item.events.onDragUpdate.remove(onDragQuestionItem, this);
			item.events.onDragStop.remove(checkAnswer, this);
		}
		else
		{
			item.calculate_speed = true;
			item.x = (game.width - item.width) / 2 | 0;

			if (item.y < item_start_move_pos)
			{
				item.y = item_start_move_pos;
			}
			else if (item.y > item_game_over_pos)
			{
				item.y = item_game_over_pos - 10 * Fend.SCALE;
			}
			if (questions_items.indexOf(item) == -1)
			{
				questions_items.push(item);
			}
		}
		selected_item = null;
	}
	function rightAnswer()
	{
		scores += right_answer_scores;

		scores_tf.text = scores;

		right_answer_sign.alpha = 0;
		game.world.addChild(right_answer_sign);

		game.add.tween(right_answer_sign).to({ alpha : 1 }, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true);
	}
	function wrongAnswer(lose_question)
	{
		scores -= ! lose_question ? wrong_answer_scores : lose_question_scores;

		if (scores < 0)
		{
			scores = 0;
		}
		scores_tf.text = scores;

		if (lose_question)
		{
			lives_amount--;

			if (lives_amount == 0)
			{
				gameOver();
			}
			game.add.tween(lives_ind_cont.children[lives_amount]).to({ alpha: 0.3 }, 300, Phaser.Easing.Cubic.Out, true);

		}
		wrong_answer_sign.alpha = 0;
		game.world.addChild(wrong_answer_sign);

		game.add.tween(wrong_answer_sign).to({ alpha : 1 }, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true);
	}
	function update()
	{
		if (game_state == GAME_STATE_PLAY)
		{
			var question_item;

			for (var i = 0; i < questions_items.length; i++)
			{
				question_item = questions_items[i];

				if (question_item.y < item_game_over_pos)
				{
					question_item.y += fall_speed;
				}
				else
				{
					/*question_item.active = false;
					question_item.input.enabled = false;*/

					questions_items.splice(i, 1);

					question_item.destroy();

					i--;

					wrongAnswer(true);

					//SpritesPool.add(question_item.name, question_item);
				}
			}
			for (i = 0; i < dragable_items.length; i++)
			{
				question_item = dragable_items[i];

				question_item.drag_speed += question_item.drag_speed < 0 ? -1 : 1;

				if (question_item.drag_speed < 0 && question_item.x + question_item.width > 0 || question_item.drag_speed > 0 && question_item.x < game.width)
				{
					question_item.x += question_item.drag_speed;

					if (question_item.drag_speed < 0 && question_item.x < swipe_left_border && yes_side.alpha == 0.25)
					{
						game.add.tween(yes_side).to({ alpha : 1 }, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true);
					}
					else if (question_item.drag_speed > 0 && question_item.x + question_item.width > swipe_right_border && no_side.alpha == 0.25)
					{
						game.add.tween(no_side).to({ alpha : 1 }, 300, Phaser.Easing.Cubic.Out, true, 0, 0, true);
					}
				}
				else
				{
					//question_item.active = false;

					dragable_items.splice(i, 1);

					question_item.destroy();

					i--;
				}
			}
		}
	}
	function pauseGame()
	{
		game_state = GAME_STATE_PAUSE;

		timer.pause();
		questions_timer.stop(false);

		//pause_screen.setup(scores);

		ScreensManager.show(pause_screen);
	}
	function resumeGame()
	{
		game_state = GAME_STATE_PLAY;

		timer.start();
		questions_timer.start();

		ScreensManager.hide(pause_screen);
	}
	function updateTimerDisplay()
	{
		timer_tf.text = timer.text;
	}
	function gameOver(event)
	{
		game_state = GAME_STATE_END;

		timer.stop();
		questions_timer.stop();

		game_end_screen.setup(scores);

		ScreensManager.show(game_end_screen);
	}
	function sendScores(button)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("POST", send_score_url);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("score=" + scores);

		button.enabled = false;
	}
	function replayGame()
	{
		game_state = GAME_STATE_PLAY;

		scores = 0;
		lives_amount = lives_init_amount;

		var question_item;

		for (var i = 0; i < questions_items.length; i++)
		{
			question_item = questions_items[i];

			/*question_item.active = false;
			question_item.input.enabled = false;
			question_item.y = game.height;*/

			//SpritesPool.add(question_item.name, question_item);

			question_item.destroy();
		}
		questions_items.length = 0;

		for (i = 0; i < dragable_items.length; i++)
		{
			question_item = dragable_items[i];
			question_item.destroy();
		}
		for (i = 0; i < lives_ind_cont.children.length; i++)
		{
			lives_ind_cont.children[i].alpha = 1;
		}
		dragable_items.length = 0;

		timer.reset();
		questions_timer.stop();

		questions_timer.loop(init_fall_interval + 300, addQuestion, this);

		timer_tf.text = timer.text;

		scores_tf.text = "";

		if (pause_screen.alpha > 0)
		{
			ScreensManager.hide(pause_screen);
		}
		else if (game_end_screen.alpha > 0)
		{
			ScreensManager.hide(game_end_screen);
		}
		ScreensManager.hide(game_end_screen);
		ScreensManager.show(start_screen);
	}

}
new Fend();