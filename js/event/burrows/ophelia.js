/*
 * 
 * Define Ophelia
 * 
 */

Scenes.Ophelia = {};

function Ophelia(storage) {
	Entity.call(this);
	
	this.name              = "Ophelia";
	this.body.DefFemale();
	
	this.body.SetRace(Race.rabbit);
	TF.SetAppendage(this.Back(), AppendageType.tail, Race.rabbit, Color.white);
	this.body.SetBodyColor(Color.white);
	this.body.SetEyeColor(Color.blue);
	
	this.flags["Met"] = 0; // note, bitmask
	
	if(storage) this.FromStorage(storage);
}
Ophelia.prototype = new Entity();
Ophelia.prototype.constructor = Ophelia;

Ophelia.Met = {
	Recruited : 1,
	Broken    : 2,
	InParty   : 4
};

Ophelia.prototype.FromStorage = function(storage) {
	this.LoadPersonalityStats(storage);
	
	// Load flags
	this.LoadFlags(storage);
}

Ophelia.prototype.ToStorage = function() {
	var storage = {};
	
	this.SavePersonalityStats(storage);
	
	this.SaveFlags(storage);
	
	return storage;
}

Ophelia.prototype.Recruited = function() {
	return this.flags["Met"] & Ophelia.Met.Recruited;
}
Ophelia.prototype.Broken = function() {
	return this.flags["Met"] & Ophelia.Met.Broken;
}
Ophelia.prototype.InParty = function() {
	return this.flags["Met"] & Ophelia.Met.InParty;
}

Ophelia.prototype.IsAtLocation = function(location) {
	location = location || party.location;
	if(location == world.loc.Burrows.Lab) {
		if(this.Recruited()) return false;
		if(this.Broken())    return false;
		return world.time.hour >= 8 && world.time.hour < 22;
	}
	return false;
}

Scenes.Ophelia.LabDesc = function() {
	var parse = {
		old : ophelia.flags["Met"] != 0 ? " old" : ""
		
	};
	
	Text.Add("You are standing in Ophelia’s[old] makeshift laboratory, which is cast in bright light with a strangely greenish hue. Scrolls and books are stacked on narrow shelves alongside earthenware pots containing who-knows-what and odd mixtures boiling in large glass flasks. Grime and smoke have added a permanent patina of grease to everything in the room, which speaks to you of the wisdom of having an alchemical lab without a proper air vent. A handful of lapine guinea-pigs are shackled to one wall, either waiting for new experiments or under observation.", parse);
	Text.NL();
	if(ophelia.Recruited()) {
		if(ophelia.InParty()) {
			if(ophelia.Broken()) {
				Text.Add("<i>”My old lab!”</i> Ophelia pipes up happily, <i>”I want… want…”</i> the lagomorph stretches a trembling paw towards one of the flasks, perhaps eager to see what effects it would have on her body. Before she can make a grab for it, her replacement slaps the hand down, fussing to you about keeping Ophelia in check.", parse);
				Text.NL();
				Text.Add("<i>”Sister no longer good for this kind of work,”</i> the rabbit tells you, urging you to leave.", parse);
			}
			else {
				Text.Add("<i>”My old lab!”</i> Ophelia hums fondly. She spends the time chatting with her replacement while you look around.", parse);
			}
		}
		else {
			if(ophelia.Broken())
				Text.Add("The lab is run by one of the brainy lagomorphs after Ophelia’s downfall. You wonder what she’s up to now, back in [camp]. Perhaps you should pay your lapine slut a visit.", parse);
			else
				Text.Add("Ophelia’s replacement is busy with some experiment, but takes the time to inquire how her sister is faring in your care. You assure her that there is nothing to worry about.", parse);
		}
	}
	else {
		if(ophelia.Broken())
			Text.Add("The lab is run by one of the brainy lagomorphs after Ophelia’s downfall. These days, the former alchemist spends all her time in the Pit with her mother; a dutiful breeding slut to Lagon.", parse);
		else if(ophelia.IsAtLocation())
			Text.Add("Ophelia is at her workbench, working on a new experiment of some sort.", parse);
		else
			Text.Add("You don’t see the owner of the lab anywhere, though signs of relatively recent activity tell you she probably isn’t very far away. Perhaps she has gone to sleep, or to speak with her father.", parse);
	}
	Text.NL();
}

Scenes.Ophelia.LabApproach = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>”So much to do.”</i> Ophelia fusses as she scurries about, snatching herbs and bottles from the overladen shelves. <i>”Did you have something for me, [playername]?”</i>", parse);
	Text.Flush();
	
	Scenes.Ophelia.LabPrompt();
}

Scenes.Ophelia.LabPrompt = function() {
	var parse = {
		
	};
	
	//[name]
	var options = new Array();
	if(burrows.flags["BruteTrait"] == Burrows.TraitFlags.Inactive) {
		options.push({ nameStr : "Cactoid",
			func : function() {
				Text.Clear();
				Text.Add("<i>”The cactoids should be fairly easy to catch, if you find them. The problem is the environment they live in. I’ve heard the desert is harsh.”</i> Ophelia goes on to describe the critter in greater detail. <i>”Look for small turtle-like creatures. They have needles on their backs, so be careful.”</i>", parse);
				Text.NL();
				Text.Add("<i>”I’m going to need three of them to complete my experiments.”</i>", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the cactoids."
		});
	}
	else if(burrows.flags["BruteTrait"] == Burrows.TraitFlags.Gathered) {
		options.push({ nameStr : "Cactoid",
			func : Scenes.Ophelia.DeliverCactoids, enabled : true,
			tooltip : "Deliver the cactoids."
		});
	}
	else { // turned in
		options.push({ nameStr : "Brawny trait",
			func : function() {
				Text.Clear();
				Text.Add("<i>”I… I’m not certain that it was a good idea to introduce this strain.”</i> Ophelia looks troubled. <i>”The specimens show great strength, and are considerably larger than the usual offspring, large enough to easily overpower regular men. It comes at a price however.”</i>", parse);
				Text.NL();
				Text.Add("<i>”The brutes have even less control of their natural urges than my other brothers and sisters… they are almost like feral beasts.”</i>", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the brawny trait."
		});
	}
	if(burrows.flags["HermTrait"] == Burrows.TraitFlags.Inactive) {
		options.push({ nameStr : "Gol husk",
			func : function() {
				Text.Clear();
				Text.Add("<i>”The Gol are large feral insects, quite dangerous if you are caught unawares. In fact, you should probably run if you come across a live one,”</i> Ophelia cautions you. <i>”Trust me, you’ll know it when you see it - they are larger than horses.”</i> She shows you a picture of a husk from one of her books, so you know what to look for.", parse);
				Text.NL();
				Text.Add("<i>”The Gol usually keep to the deep forest, but they sometime stray near the outskirts. I’m going to need three pieces of husk in order to finish my experiments. Just make sure you take them from dead Gols, or find parts that have been shed in their growth process.”</i>", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the Gol husks."
		});
	}
	else if(burrows.flags["HermTrait"] == Burrows.TraitFlags.Gathered) {
		options.push({ nameStr : "Gol husk",
			func : Scenes.Ophelia.DeliverGolHusks, enabled : true,
			tooltip : "Deliver the Gol husks."
		});
	}
	else { // turned in
		options.push({ nameStr : "Herm trait",
			func : function() {
				Text.Clear();
				Text.Add("<i>”This one was certainly interesting. I think I might even consider it myself...”</i> Ophelia trails off thoughtfully. <i>”All the males seem to enjoy their cocks so much, I wonder what it would feel like...”</i>", parse);
				Text.NL();
				Text.Add("You can’t seem to get anything more coherent out of her on the topic at the moment.", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the herm trait."
		});
	}
	if(burrows.flags["BrainyTrait"] == Burrows.TraitFlags.Inactive) {
		options.push({ nameStr : "Algae",
			func : function() {
				Text.Clear();
				Text.Add("<i>”The algae should be the easiest ones, since you can find them at the shores of the lake. They should look something like this.”</i> She shows you a scroll, depicting an odd aquatic plant. <i>”Just make sure to get the red ones. The yellow ones are apparently lethal to the touch. I think that is what the scroll says anyways, the writer is a bit unclear about it.”</i>", parse);
				Text.NL();
				Text.Add("<i>”I’ll need three samples.”</i>", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the red algaes."
		});
	}
	else if(burrows.flags["BrainyTrait"] == Burrows.TraitFlags.Gathered) {
		options.push({ nameStr : "Algae",
			func : Scenes.Ophelia.DeliverAlgae, enabled : true,
			tooltip : "Deliver the red algaes."
		});
	}
	else { // turned in
		options.push({ nameStr : "Brainy trait",
			func : function() {
				Text.Clear();
				Text.Add("<i>”I had hoped that this one would help mother, but it seems my alchemy wasn’t strong enough.”</i> Ophelia shrugs dejectedly. <i>”At the very least, I can have some slightly more stimulating conversations with my brothers and sisters now.”</i>", parse);
				Text.Flush();
				Scenes.Ophelia.LabPrompt();
			}, enabled : true,
			tooltip : "Ask Ophelia about the brainy trait."
		});
	}
	options.push({ nameStr : "Potions",
		func : function() {
			Text.Clear();
			Text.Add("<i>”If you have any, I’ll trade you coins for new alchemical brews that may be of use to the colony.”</i>", parse);
			Text.NL();
			Text.Add("Do you offer any potions to Ophelia?", parse);
			Text.Flush();
			
			Scenes.Ophelia.PotionsPrompt();
		}, enabled : true,
		tooltip : "Donate some of your alchemical stock to Ophelia."
	});
	
	//TODO
	/*
	options.push({ nameStr : "name",
		func : function() {
			Text.Clear();
			Text.Add("", parse);
			Text.NL();
			Text.Flush();
		}, enabled : true,
		tooltip : ""
	});
	*/
	Gui.SetButtonsFromList(options, true);
}

Scenes.Ophelia.PotionsPrompt = function() {
	var parse = {
		playername : player.name
	};
	
	var options = new Array();
	if(ophelia.flags["Felinix"] == 0) {
		options.push({ nameStr : "Felinix",
			func : function() {
				Text.Clear();
				Text.Add("<i>”Feline you say?”</i> Ophelia looks thoughtfully at the offered bottle, giving it a swirl experimentally. Finally, she shakes her head and returns the bottle to you.", parse);
				Text.NL();
				Text.Add("<i>”We are already quicker than the cats. I don’t really see how this will help us.”</i>", parse);
				Text.Flush();
				
				ophelia.flags["Felinix"] = 1;
				
				Scenes.Ophelia.PotionsPrompt();
			}, enabled : party.Inv().QueryNum(Items.Felinix),
			tooltip : "Introduce Felinix into the diet of the colony."
		});
	}
	if(ophelia.flags["Lacertium"] == 0) {
		options.push({ nameStr : "Lacertium",
			func : function() {
				Text.Clear();
				Text.Add("<i>”To be honest, I’m not sure what giving this to rabbits would do...”</i> Ophelia studies the bottle of Lacertium carefully. <i>”Protective scales? Perhaps it will make us lay eggs? Only one way to find out I guess...”</i> The lapine alchemist hops over to two of her chained test subjects, one male and one female.", parse);
				Text.NL();
				Text.Add("<i>”Now, be good assistants and drink up!”</i> She nods encouragingly to the bunnies as they gulp down the strange substance. <i>”Have a seat,”</i> she suggests, gesturing to a bench. The potion begins to take hold almost immediately, as both of the guinea pigs grow slightly sleeker, and the faintest hints of pale scales poke out from under their fur on their arms, legs and shoulders. Their tails elongate to about three feet, and are covered in smooth, soft scales on their underside, with white fluffy fur on the top. The same soft scales snake down their stomachs, from chest to crotch.", parse);
				Text.NL();
				Text.Add("The solution seems to have some rather more dire effects as well, as both the male and female lagomorph fall to the ground, grunting and moaning as they clutch their stomachs. Ophelia looks briefly concerned, before it becomes clear that it isn’t pain, but pleasure, that ails them. With her foot, she carefully rolls the male over onto his back, gasping in surprise as his genitalia are revealed. Where before there was but one member, two thick shafts sprout from his groin, glistening wetly in the faint light.", parse);
				Text.NL();
				Text.Add("<i>”Quite interesting!”</i> Ophelia croons excitedly. <i>”There doesn’t seem to be any traces of a reptilian slit, and his testes are still intact. Good thing too, as he’s likely to need them if he’s to sire a new strain.”</i> A startled whimper diverts the alchemist’s attention to the other rabbit, who is sitting with her hands covering her lap, legs pressed together tightly and blushing fiercely.", parse);
				Text.NL();
				Text.Add("<i>”What is wrong girl? Don’t tell me you grew one too. Now then,”</i> the lagomorph scientist tuts, forcing the bunny’s legs apart, <i>”what do we have-”</i> You peek over her shoulder curiously, wondering why she grew silent. It’s quite a sight.", parse);
				Text.NL();
				Text.Add("Nested between her thighs, there are about a dozen pink eggs, each roughly the size of an apple. Ophelia picks one of them up in wonder. <i>”Never thought I’d see this pop out between someones legs,”</i> she confesses. <i>”So many of them too… no! Down!”</i> The alchemist irritably swats away the girl’s hands, as she possessively reaches for her egg.", parse);
				Text.NL();
				Text.Add("<i>”They aren’t fertilized, silly,”</i> Ophelia scoffs, though she relents and returns the egg to the agitated bunny, who cradles it protectively. <i>”That will be the next step of the test.”</i> Rubbing her hands together excitedly, she calls for some guards to escort the new hybrids to a breeding chamber, to see how well the strain will proliferate.", parse);
				Text.NL();
				Text.Add("<i>”I need to observe the strength of the offspring, and how long the gestation period is. Still, I think it shows promise… perhaps some minor alterations to the formula.”</i> Ophelia hands you a bag of coins from her hidden stash, already deep in thought on how to further improve the new strain.", parse);
				Text.NL();
				Text.Add("<b>You receive 150 coins!</b>", parse);
				Text.Flush();
				
				party.coin += 150;
				world.TimeStep({hour: 1});
				ophelia.flags["Lacertium"] = 1;
				
				Scenes.Ophelia.PotionsPrompt();
			}, enabled : party.Inv().QueryNum(Items.Lacertium),
			tooltip : "Introduce Lacertium into the diet of the colony."
		});
	}
	if(ophelia.flags["Equinium"] == 0) {
		options.push({ nameStr : "Equinium",
			func : function() {
				Text.Clear();
				Text.Add("<i>”Oh, I’ve been searching for this!”</i> Ophelia almost snatches the bottle from your hand, swirling the liquid around excitedly. <i>”We lagomorphs may be quick on our feet, but we are not very physically strong. Well, if you discount my father,”</i> she corrects herself. <i>”Either way… the reproductive rates of my own race combined with the strength and size of the equines… I need to test this right now!”</i>", parse);
				Text.NL();
				Text.Add("You wonder if this might have been a bad idea, worrying briefly about huge rabbit centaurs plaguing the countryside before coming to your senses. Surely it wouldn’t do something like that, would it? Either way, you are about to find out. Ophelia has already selected two subjects for her experiment, one male and one female, looking rather miserable in their chains.", parse);
				Text.NL();
				Text.Add("<i>”Down the hatch!”</i> she grins, pouring the concoction down their throats. The effects are gradual, but both of the guinea pigs look like they have gained a fair amount of tone, their bodies athletic but not overtly bulging with muscles. A lush mane grows down their backs, disappearing just above their new long tails, the fine hairs smooth as silk. There is a subtle change in their faces too, the muzzle slightly longer and the nose a bit broader.", parse);
				Text.NL();
				Text.Add("None of this seems to faze any of the three lagomorphs however, as their full attention is firmly fixed on the slowly rising monolith between the legs of the male. Most of the rabbits you’ve seen so far have had at least respectable members, especially considering their small stature, but this one is almost intimidating. It’s as thick as his arm, and long enough to reach his chin, looking almost comical on his slight frame. The poor bunny looks like he is about to pass out, though whether from shock or from the massive reallocation of blood to the veiny, flared monster between his legs isn’t clear. The air is heavy with his musk, spreading from the huge, overfilled scrotum at the base of his cock.", parse);
				Text.NL();
				Text.Add("<i>”Wow… that is… nice...”</i> Ophelia stammers dreamily, still transfixed by the now fully erect majestic shaft. She is practically drooling, and it looks like she is preventing herself from throwing herself on it by sheer force of will. The female test subject, meanwhile, is prevented by the sheer force of metal chains, though it looks like the jury is still out on which of them will win the battle. The alchemist shakes her head, trying to clear it of sexual thoughts.", parse);
				Text.NL();
				Text.Add("<i>”H-however! Will that even… fit?”</i> She looks worried for a moment, before brightening up. <i>”Unless… girl! On all fours. Come on now, do you want to be fucked or not?”</i>", parse);
				if(player.SubDom() < -30)
					Text.Add(" You are halfway to your knees before it dawns on you that she is addressing the other bunny, not you. Slightly embarrassed - and maybe a little disappointed - you straighten back up, pretending nothing happened.", parse);
				Text.NL();
				Text.Add("The rabbit is panting with need, and eagerly obeys, begging for her restraints to be undone so she can throw herself at the magnificent horsecock. Ophelia circles the girl, pulling her long tail aside to expose her dripping pussy. The scientist carefully inserts two fingers into the folds of her test subject, followed by two more when she meets no resistance.", parse);
				Text.NL();
				Text.Add("<i>”Hey, [playername], have a look at this!”</i> she calls out to you, simultaneously shoving her entire fist inside the bunny-girl. <i>”She can take my entire forearm without even blinking!”</i> Ophelia marvels at the girl’s flexible cunt, <i>”I guess they are meant for each other.”</i> There is a large visible bulge on the lagomorph’s stomach, yet she doesn’t seem to experience any pain or discomfort from the intruding limb, continuing to beg for the tantalizing equine dick just outside her reach. The alchemist pulls out her arm, releasing a waft of musk so heady it feels like a punch in the face. Almost instinctively, she gives the fluid a lick, shaking her head in confusion.", parse);
				if(burrows.flags["Access"] >= Burrows.AccessFlags.QuestlineComplete)
					Text.Add(" Her cock is straining against the fabric of her labcoat, aching to be buried in that sweet honeypot.", parse);
				Text.NL();
				Text.Add("The strong secretions reach the male lagomorph-equine hybrid, who groans almost as if in pain, thrashing against his bonds, his cock impossibly stiff and leaking pre like a broken bucket. The rest of the chained test subjects are also stirring, roused and aroused by the strong scents that now permeate the entire lab. Ophelia’s guards pick this moment to step inside to see what all the fuss is about, their jaws dropping in unison as they drink in the scene before them. As one, they jump towards the pair, overcome by their lust.", parse);
				Text.NL();
				Text.Add("<i>”I- uh, I got to take care of this,”</i> Ophelia frets, vaguely waving a hand at the chaos unfolding behind her. You are not completely certain what she means by that, but she seems to have some plan, so you allow yourself to be ushered out of the lab.", parse);
				Text.Flush();
				
				Gui.NextPrompt(function() {
					Text.Clear();
					Text.Add("<b>Some time later…</b>", parse);
					Text.NL();
					Text.Add("An exhausted Ophelia waves you inside again, breathing heavily and slick with sweat. The room is in a state of disarray - more than usually, that is - and there are large amounts of unidentifiable fluids soaking into the ground. Except for a few wide-eyed, chained lagomorphs, the room is completely deserted.", parse);
					Text.NL();
					Text.Add("<i>”Well, that’s done,”</i> the disheveled alchemist sighs, wavering slightly as she adjusts her glasses. There is more of the sticky stuff dripping from her hair and trickling down her inner thigh.", parse);
					Text.NL();
					Text.Add("<i>”I sent them off to a breeding chamber,”</i> she answers your silent question, <i>”there were a few… complications.”</i> It doesn’t look like she wants to say anything more on the subject, so you leave it at that. Ophelia wordlessly hands you a bag of coins for your trouble.", parse);
					Text.NL();
					Text.Add("<b>You receive 250 coins!</b>", parse);
					Text.Flush();
					
					party.coin += 250;
					world.TimeStep({hour: 1});
					ophelia.flags["Equinium"] = 1;
					
					Scenes.Ophelia.PotionsPrompt();
				});
			}, enabled : party.Inv().QueryNum(Items.Equinium),
			tooltip : "Introduce Equinium into the diet of the colony."
		});
	}
	
	Gui.SetButtonsFromList(options, true, Scenes.Ophelia.LabPrompt);
}

Scenes.Ophelia.DeliverCactoids = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>”Ah, nice!”</i> Ophelia takes the squirming little creatures, handling them carefully in order to not get stung. You turn your head uncomfortably as she summarily salvages the ingredients she needs from the innocent critters before releasing them again.", parse);
	Text.NL();
	Text.Add("<i>”Now, what were the other things I needed...”</i> she muses, browsing through one of her scrolls. <i>”Give me an hour or so, I need to try a few things.”</i> You settle down to wait as the bunny-morph begins to mix the contents of various jars with the ground cactoid needles. After a while, you begin to space out, your gaze dropping down to Ophelia’s cute little butt as it scurries about - barely hidden under her short labcoat - her puffy tail bobbing with excitement.", parse);
	Text.NL();
	Text.Add("The alchemist curses a few times, brewing up new mixtures as the delicate balance of one of her solutions turns sour. Finally, she swirls around triumphantly, a bottle in hand containing a bubbly concoction with a garish green color.", parse);
	Text.NL();
	Text.Add("<i>”This should do it!”</i> she announces. <i>”This should increase the bodily strength of the colony, making our soldiers sturdier! I’m sure daddy’ll like this one… just need to test it.”</i> Motioning for you to follow, she hops over to the wall where her volunteers are held. Picking out one of the male lagomorphs, a rather scrawny fellow, she hands him the potion and instructs him to drink it.", parse);
	Text.NL();
	Text.Add("Giving the alchemist a look of absolute trust, the lagomorph accepts the bottle and downs it in one swig, the chains around his wrists clinking together at his enthusiasm. Silently, you hope that the liquid isn’t toxic. However, nothing could prepare you for the effects of the solution.", parse);
	Text.NL();
	Text.Add("A shock runs through the subject’s body, the bunny twitching from head to toe as the potion begins to take effect. He cries out as he begins to violently change, his muscles swelling rapidly, his body mass increasing to many times his former scrawny frame. The metal shackles around his wrists and ankles shatter as if they were made from twine, providing no resistance to the bulky bunny.", parse);
	Text.NL();
	Text.Add("Growing from his meager five feet to six, seven, passing eight feet in height and half that over his shoulders, the lagomorph looks nothing like his former self. Bulging, rippling muscles stretch over his chest, arms and legs. His face looks completely transformed; his brows sunken and his chin broad.", parse);
	Text.NL();
	Text.Add("The most impressive change to his physique, however, lies between his powerful thighs. A bobbing third leg, almost three feet in length and several inches thick, looms like a monument to the bunny’s newfound masculinity. A pair of balls the size of coconuts hang beneath it, swollen with seed.", parse);
	Text.NL();
	Text.Add("This last change doesn’t seem to have gone unnoticed by the other volunteers; their gazes are entranced by the monstrous shaft, their mouths watering as globs of precum form on the bulbous tip. Looking in wonder at his new body, the brute doesn’t seem to have missed the attention he’s receiving either.", parse);
	Text.NL();
	Text.Add("<i>”Did you see that?”</i> Ophelia pipes at your shoulder, peeking out behind you. <i>”Quite impressive reaction, I’d say!”</i> She frowns as the hulking lagomorph sways his gaze around, fixating on one of the female bunnies.", parse);
	Text.NL();
	Text.Add("<i>”Hey, you big lump, are you listening?”</i> the alchemist yips, pouting as the brute ignores her. Instead, he chooses to bodily pick up his fellow test subject, absently breaking her bonds without effort. With a vapid broad smile on his face, the bulky jock cradles the female, placing her astride his erect battering ram. The smaller bunny blushes, her cheeks aflame with arousal. Rivulets of sweet femcum lather the thick pole, her body instinctively preparing to be taken by the powerful male.", parse);
	Text.NL();
	Text.Add("<i>”Well, those parts certainly seem to be working,”</i> Ophelia huffs, a slight flush on her cheeks. The brute is surprisingly gentle as he caresses his smaller lover; massaging her pert breasts and fondling her hair with fists the size of her head. With nothing else to support her, the girl is suspended by nothing more than the enormous cock, the male’s arousal seemingly more than enough to uphold her slight frame. <i>”E-even bigger than father’s… will it even be able to fit?”</i> Though she seems a bit sceptical, Ophelia scrambles to get hold of her notepad, her eyes never leaving her test subjects.", parse);
	Text.NL();
	Text.Add("<i>”Initial penetration… problematic,”</i> she murmurs beneath her breath as she starts scribbling notes. It’s like she says; even with her snatch wet like an ocean, the bunnygirl has trouble stretching far enough to allow the brute to enter her. After several failed tries, the frustrated jock lifts her up by the waist, bringing his broad tongue to her crotch. His lover relaxes with a shudder, allowing him to ease her folds apart, preparing her for what’s to come.", parse);
	Text.NL();
	Text.Add("<i>”Interesting technique,”</i> Ophelia notes, her breath coming short. Glancing down, you see that she’s placed her pad on a table in front of her, writing notes growing scrawlier by the minute as her other hand busies itself under her labcoat. Even a rabbit as smart as she can’t escape her true nature.", parse);
	Text.NL();
	Text.Add("Eager to give it another go, the bulky bunny gets down on his back, motioning for his partner to take a seat on his towering member. She straddles him, her pussylips hesitantly kissing the magnificent pole as she hovers above it. The poor girl has to stand on her tiptoes to even reach the ground, so big is it. Gulping down the last remains of her lingering doubt, the bunny surrenders to her lusts, sinking down on the massive shaft. Her cunt is stretched impossibly wide by the sheer girth of her lover, but by the sound of her ecstatic cries, she’s far from complaining. It’s physically impossible for her to take all of her lover - but you don’t suspect that the bunnies are particularly good at physics. Either way, they both seem more than willing to try, as the girl impales herself deeper with each downward thrust.", parse);
	Text.NL();
	Text.Add("Unable to help himself, the brute starts to rock his hips, mercilessly pounding his monstrous cock into the delirious girl. His initial composed demeanor seems to be eroding by the second as the potion affects not only his body, but also his mind.", parse);
	Text.NL();
	Text.Add("<i>”I’d say a more... in depth study is needed,”</i> the alchemist murmurs, biting her lip as she watches the coupling intently. By now, she’s given up even the semblance of taking notes, reclining on a bench beside you with her coat open, her fingers busy probing her wet snatch.", parse);
	Text.NL();
	Text.Add("You can feel heat rising in your own body, the urge to join in… and what? Help Ophelia? Or take your own turn at riding this immense monolith of lagomorph meat? Either way, your musings are cut short by the brute’s sudden climactic eruption, his gigantic orgasm all but blasting his lover several feet into the air - though not before filling her womb to the brim with his thick seed.", parse);
	Text.NL();
	Text.Add("Both you and Ophelia are stunned by the display, the alchemist absently wiping a stray glob of cum blasted across the room from her cheek. Sucking on her finger thoughtfully, she studies her partially soiled notes, adding: <i>”Final verdict: promising. Warrants further experimentation.”</i>", parse);
	Text.NL();
	Text.Add("The other test subjects perk up at this, eager to be helpful.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	burrows.flags["BruteTrait"] = Burrows.TraitFlags.Active;
	
	Gui.NextPrompt(function() {
		Scenes.Ophelia.DeliverFollowup(Burrows.Traits.Brute);
	});
}

Scenes.Ophelia.DeliverGolHusks = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>”I hope you didn’t have any trouble finding these.”</i> Ophelia quickly relieves you of the husks, bringing them over to her workbench. <i>”Gols can be terribly ferocious, I’ve heard. Very territorial.”</i>", parse);
	Text.NL();
	Text.Add("The alchemist cracks open one of the carapaces, carefully grinding it into fine dust. You settle down to watch her work, occasionally handing her a jar or bottle that she requests. She seems to be enjoying this line of work, cracking a triumphant smile as the mixture changes in hue and consistency under her deft care. It’s a while later when she finally twirls around, grinning as she brandishes her accomplishment.", parse);
	Text.NL();
	Text.Add("<i>”All done!”</i> she proclaims, holding the clear bottle up toward the light.", parse);
	Text.NL();
	Text.Add("What does it do?", parse);
	Text.NL();
	Text.Add("<i>”Frankly, I have no idea. The scroll was a little vague. Why don’t we find out?”</i> Not waiting on your response, Ophelia strides over to her volunteers, calling for their attention.", parse);
	Text.NL();
	Text.Add("<i>”Who wants to prove themselves for Lagon, perhaps gain his favor?”</i> The chained rabbits clamor for attention, one of the females hopping to the front and opening her mouth expectantly.", parse);
	Text.NL();
	Text.Add("<i>”Very well, you shall be the first test subject!”</i> The alchemist hands the eager girl the bottle, ruffling her hair while she greedily drinks it up. At first it seems like nothing has happened, but the bunny suddenly flops over, hugging herself as she moans in delirious pleasure. Her fellow captives gather around in concern, blocking your view, and Ophelia shoves them away again, adjusting her glasses in annoyance. <i>”So, how do you feel?”</i> she asks the bunny, readying her pen.", parse);
	Text.NL();
	Text.Add("Her ears still twitching and her face flushed, the lagomorph pulls herself up to her knees, hands covering her crotch. You look her over - a pretty little thing, to be sure - but the potion doesn’t seem to have had any obvious effects. Ophelia taps her hip impatiently. <i>”Come on now, don’t be shy.”</i>", parse);
	Text.NL();
	Text.Add("The aroused bunny squirms, gulping nervously as she removes her hands and reveals her newly grown cock. It’s no monster, jutting out just above her pussy at a modest five inches, but it nonetheless looks out of place on her.", parse);
	Text.NL();
	Text.Add("<i>”Now this is interesting!”</i> Ophelia exclaims, prodding the stiff rod with her pen, enticing a soft moan and a spurt of thick pre from the test subject. Curious, since the transformation apparently didn’t make her grow any balls. Smiling sweetly, the alchemist turns to one of the male volunteers, wagging another bottle of the mixture in front of him. <i>”You’re next!”</i>", parse);
	Text.NL();
	Text.Add("His eyes droop, but he accepts the mixture, downing it in one swig. You watch curiously, wondering what effects this concoction will have on a jock. You aren’t disappointed; if anything, the changes are all the more apparent on the male than it was on the female. That, and this time Ophelia is certain that the effects aren’t hidden by any naughty bunny paws.", parse);
	Text.NL();
	Text.Add("Not that the unfortunate rabbit would have much luck hiding the changes to his body. Like most males of his race the jock is lithe and athletic, and he expresses some concern as he begins to fill out - a little here, a little there, a broadening and rounding of the hips and thighs, a swelling of the butt. Interesting things are happening to the bunny’s chest too - a pair of modest breasts rising from his former flatness.", parse);
	Text.NL();
	Text.Add("By now, <i>her</i> would probably be a better way to address the lagomorph. The former male’s balls recede into his crotch, forming a thin gash just below the base of his quivering cock. The transformed bunny gives out a yelp - significantly higher in pitch than before - as Ophelia gives her newly formed pussy an experimental touch. <i>”Not quite what I expected, I must admit,”</i> the alchemist confesses, jotting down a few more notes in her pad.", parse);
	Text.NL();
	Text.Add("The two recently freed and very much aroused test subjects waste no time in throwing themselves at each other, eager to test out their respective new equipment. Ophelia gives them a few rounds to let off steam, before rolling her eyes and pulling one of them away.", parse);
	Text.NL();
	Text.Add("<i>”I need to have something to show daddy, don’t I?”</i> she answers the bunny’s accusatory stare. She turns back to the other volunteer - you are not quite sure which one, male or female. <i>”I… I’m sure the others can help you out. It should go soft if you do it a few more times. I think.”</i> The herm doesn’t seem to be complaining, quickly finding a group of her siblings to fuck and be fucked by.", parse);
	Text.Flush();

	world.TimeStep({hour: 1});
	
	burrows.flags["HermTrait"] = Burrows.TraitFlags.Active;
	
	Gui.NextPrompt(function() {
		Scenes.Ophelia.DeliverFollowup(Burrows.Traits.Herm);
	});
}

Scenes.Ophelia.DeliverAlgae = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("<i>”Very good, [playername]! I have great hopes for this one!”</i> Ophelia seems unusually animated as she takes the plants from you, bringing them over to her workbench. You settle down and she begins chopping them into thin strands, putting them into a pot of boiling water. The alchemist goes on to explain that this particular scroll - she waves it in the air enthusiastically - suggests that it describes a potion that sharpen one’s senses.", parse);
	Text.NL();
	Text.Add("<i>”I’m not sure if you’ve caught on to it, but most of my siblings aren’t very bright. Enthusiastic, certainly,”</i> she hurries to defend them, <i>”but not the most stimulating conversationalists. They prefer stimulating in different ways.”</i> The bespectacled bunny sighs, absentmindedly stirring the contents of the pot. <i>”I used to be able to talk to mother. Before she changed.”</i> Her ears droop with sadness, before she cheers herself up again.", parse);
	Text.NL();
	Text.Add("<i>”Who knows, this might bring her back!”</i> she adds optimistically. You’re a bit more sceptical; having met Vena, you doubt that a mere potion will be enough to bring her back from the depths of perverse decadence she wallows in.", parse);
	Text.NL();
	Text.Add("Ophelia seems hopeful to the contrary at least, and hums to herself quietly as she prepares the potion, fidgeting with excitement even as she waits for the mixture to reach the correct temperature. Finally, after double-checking everything with the scroll again, she seems to be happy with the results.", parse);
	Text.NL();
	Text.Add("<i>”You!”</i> she exclaims, pointing out one of the female volunteers. Brimming with excitement, Ophelia frees the bunny from her chains, leading her over to the workbench and offering her a seat. <i>”Drink,”</i> the alchemist instructs, watching intently as her little sister chugs the potion, holding the bottle in both hands. The bunny gives a small hiccup, but there doesn’t seem to be any other effects. She looks about herself in confusion.", parse);
	Text.NL();
	Text.Add("<i>”How… do you feel?”</i> Ophelia asks apprehensively.", parse);
	Text.NL();
	Text.Add("<i>”G-good, I think?”</i> the girl scratches her head in confusion. <i>”I feel… weird. The words just come tumbling into my head, like a waterfall.”</i> She focuses on her sister. <i>”Ophelia? What did that potion contain?”</i>", parse);
	Text.NL();
	Text.Add("The alchemist lets out a delighted woop, hugging the bunny close. <i>”It worked, [playername]!”</i> she exclaims. <i>”We need to show this to father, I’m sure he’ll find this useful!”</i>", parse);
	Text.NL();
	Text.Add("You still have your doubts. While the lagomorph certainly seems more articulate than before, her mind seems to wander easily. Ophelia tries to show her a few books, but she seems more interested in returning to her fellow volunteers and fuck them. Can’t win every battle, you suppose.", parse);
	Text.Flush();
	
	world.TimeStep({hour: 1});
	
	burrows.flags["BrainyTrait"] = Burrows.TraitFlags.Active;
	
	Gui.NextPrompt(function() {
		Scenes.Ophelia.DeliverFollowup(Burrows.Traits.Brainy);
	});
}

Scenes.Ophelia.DeliverFollowup = function(trait) {
	var parse = {
		playername : player.name,
		himher : player.mfFem("him", "her")
	};
	
	Text.Clear();
	Text.Add("<i>”Thank you for gathering the ingredients for me,”</i> Ophelia nods, satisfied with the results of her new concoction. She fills a large bottle with the substance, adjusting her glasses and smoothing out her labcoat before turning back to you.", parse);
	Text.NL();
	
	if(burrows.flags["Access"] < Burrows.AccessFlags.Stage1) {
		burrows.flags["Access"] = Burrows.AccessFlags.Stage1;
		
		Text.Add("<i>”We should take this to father right away, I know he’ll love this!”</i> You have your reservations, but you are interested in the payment offered, so you follow behind the excited bunny. Once in the tunnels, the guards silently close in around you, escorting you towards Lagon’s throneroom.", parse);
		Text.NL();
		Text.Add("The ruler of the burrows seems a tad busy, grunting as he drives himself balls deep into a pretty little lagomorph, impaling her on his massive meatstick. She is moaning incoherently, driven to her limits as her body is wracked by a shattering orgasm - and by the envious looks of Lagon’s harem, it’s far from her first. They keep their voices lowered respectfully, though many can’t resist touching themselves, whimpering quietly as they imagine themselves prone under their mighty leader. Lagon grits his teeth, tensing as he pours his hot seed inside of his latest fucktoy, no doubt impregnating the girl. Her stomach bloats slightly as her womb is filled to the brim, the excess dripping down between her thighs. She passes out, the intense experience finally too much for her.", parse);
		Text.NL();
		Text.Add("At last, Lagon notices your arrival. Nonchalantly, he pulls the senseless rabbit off his still erect member, studying you curiously as he deposits her on the floor. A few gallant youths hop forth quickly, taking care of the poor girl - though their lustful gazes and bobbing cocks make you doubt their chivalrous intentions.", parse);
		Text.NL();
		Text.Add("<i>”And to what do I owe the pleasure of my daughter’s presence?”</i> the patriarch drawls, eyeing you in passing. <i>”If you want a fuck, you’ll have to get in line.”</i> He mockingly gestures at the needy females surrounding his throne on their knees, each begging to be his next bitch.", parse);
		Text.NL();
		Text.Add("<i>”N-not now, father,”</i> Ophelia blushes, her eyes flitting over to you for a second. <i>”I-I finished it, with the help of [playername] here! I finished the potion!”</i> Excited, she goes on to describe the effects of the new solution, proudly presenting her test subject to him. Lagon’s eyes are unreadable as he studies the flask.", parse);
		Text.NL();
		Text.Add("<i>”And how much of this do you think you can make?”</i>", parse);
		Text.NL();
		Text.Add("<i>”I can probably produce two or three flasks of that size in a day… provided I can get more raw materials. I used up most of it making this. Maybe a little more, once I get the process down.”</i>", parse);
		Text.NL();
		Text.Add("<i>”What, do you expect our resourceful friend to slaughter monsters for you all day long? You must be offering [himher] quite the favors for such diligence.”</i> Lagon laughs at his colorful joke, enjoying his daughter’s discomfort.", parse);
		Text.NL();
		Text.Add("<i>”Never mind that, I have a far more… efficient solution.”</i> With that he hops out of his throne, leading the way out of the chamber, flask in hand. Ophelia shrugs at you, setting out after her father, her guards in tow. Before long, the rhythmic drone makes it apparent that you are heading towards the Pit, the large breeding cavern at the center of the colony. On all sides, the participants of the perpetual orgy quiet down as their leader walks among them. A worshipful silence fills the huge space, as the entire room focuses intently on your small group, paused mid-coitus.", parse);
		Text.NL();
		Text.Add("<i>”...Father? What is going on?”</i> Ophelia asks in a small voice, perhaps already suspecting where this is headed. <i>”I… I have plenty of test subjects in the pens of my lab, there is no need-”</i>", parse);
		Text.NL();
		Text.Add("<i>”Shut it,”</i> Lagon growls, <i>”you said it yourself, didn’t you? You only have enough to mutate a few measly runts with this. My method only needs one large dose.”</i> He comes to a halt in front of the great matriarch of the lagomorphs, Vena. The matron looks confused, her fractured and clouded mind not grasping why no one is fucking her.", parse);
		Text.NL();
		Text.Add("<i>”Vena,”</i> Lagon says, almost fondly, <i>”do you recognize the face of your master?”</i>", parse);
		Text.NL();
		Text.Add("<i>”La-gon.”</i> Her voice is stuttering at first, before becoming more sure. <i>”Lagon. Husband.”</i> She looks down at him curiously, actually blushing a bit. <i>”We… breed?”</i>", parse);
		Text.NL();
		Text.Add("<i>”I’ll fuck you senseless just like you want, but first… this!”</i> The wiry rabbit smoothly hops up, straddling the aroused matriarch’s chest, planting his cock in the valley between her enormous breasts. When she instinctively opens her maw, seeking to envelop the thick treat presented to her, Lagon instead forces the neck of the glass flask between her lips.", parse);
		Text.NL();
		Text.Add("<i>”Just drink up, girl,”</i> he murmurs, pouring the volatile substance down her throat. Vena has little choice but to swallow the potion, chugging down a dose at least three times the amount that Ophelia subjected her guinea pig to.", parse);
		Text.NL();
		
		Scenes.Ophelia.DeliverFollowup(trait);
	}
	else if(burrows.flags["Access"] < Burrows.AccessFlags.Stage2) {
		burrows.flags["Access"] = Burrows.AccessFlags.Stage2;
		
		Text.Add("Ophelia thoughtfully pours the rest of the brew into a larger flask. She squares her shoulders, looking determined. <i>”Shall we? I have a thing or two I wish to talk with father about.”</i> With that, you set out towards the throne room, guards in tow. For once Lagon isn’t fucking someone, instead merely reclining on his throne, munching on some snacks.", parse);
		Text.NL();
		Text.Add("<i>”Father, I’ve finished another potion.”</i> The lagomorph scientist trots out her morphed test subject, dejectedly showcasing the mutations that her latest concoction causes. Lagon nods, studying his daughter closely.", parse);
		Text.NL();
		Text.Add("<i>”Something on your mind, girl?”</i> he asks when she’s finished, noting her reluctance. <i>”Speak up.”</i>", parse);
		Text.NL();
		Text.Add("<i>”I-It’s just…”</i> she stutters, <i>”I did some experiments earlier, I’ve really improved, I think this one could be produced at a larger scale, perhaps if I had more assistants-”</i> With each word, Lagon’s countenance sours, until his face is a mask of barely contained anger.", parse);
		Text.NL();
		Text.Add("<i>”Enough!”</i> he snaps, silencing Ophelia. <i>”You have a problem with my way of doing things? I have no interest in your opinions, and I could find <b>far</b> better use for that mouth of yours. We will do it the same way as last time.”</i>", parse);
		Text.NL();
		Text.Add("For a moment, it looks like Ophelia will back down, but she gathers her courage and pushes on, a slightly wild look in her eyes. <i>”B-but what about mother? What if there are side effects of so many different chemicals, do you not care for-”</i>", parse);
		Text.NL();
		Text.Add("<i>”Silence.”</i> He was angry before, but now he looks closer to a cold, calculated rage. <i>”Why would I care about that slut? She is only one among many. I’ve said it before,”</i> he growls, getting up and stalking closer to the two of you, <i>”anyone here is mine to take as I please. <b>Anyone.</b>”</i> His face is inches from the frightened alchemist, looming above her threateningly.", parse);
		Text.NL();
		Text.Add("<i>”You don’t want to cross me, daughter.”</i>", parse);
		Text.Flush();
		
		//[Stop him][Divert][Watch]
		var options = new Array();
		options.push({ nameStr : "Stop him",
			func : function() {
				Text.Clear();
				Text.Add("This has gone far enough. You pull Ophelia back from her enraged father, wrapping a protective arm around her as you face down with Lagon. At first, he looks incredulous, but his face quickly turns unreadable.", parse);
				Text.NL();
				Text.Add("<i>”I will be lenient this once, as you are not familiar with our ways.”</i> Each word is spoken through gritted teeth, his seething rage barely held in check. <i>”Never cross me again, or, outsider or no, you’ll feel my wrath.”</i> With that, he turns away, leading the way towards the Pit again. Guards close in behind you, prodding you and Ophelia to follow with the butts of their spears.", parse);
				Text.NL();
				Text.Add("<i>”T-thank you,”</i> the frightened rabbit whispers to you.", parse);
				
				lagon.relation.DecreaseStat(-100, 25);
				ophelia.relation.IncreaseStat(100, 25);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Stand up for her."
		});
		options.push({ nameStr : "Divert",
			func : function() {
				Text.Clear();
				Text.Add("The situation is quickly heading down the drains, and you hurriedly suggest that you should all head for the Pit, to see the effects of the new potion. Lagon studies your face, barely keeping his rage in check. He nods slowly.", parse);
				Text.NL();
				Text.Add("<i>”Yes, I think we will do just that.”</i> He grabs Ophelia by the scruff of her neck, dragging her along. You follow behind them closely, glad to have at least mostly prevented the alchemist from getting harmed.", parse);
				
				lagon.relation.DecreaseStat(-100, 5);
				ophelia.relation.IncreaseStat(100, 10);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "Step in before something ugly happens."
		});
		options.push({ nameStr : "Watch",
			func : function() {
				Text.Clear();
				Text.Add("You watch in silence as father and daughter lock gazes. She holds out for a short while, but, after a few moments, she sullenly looks down, admitting defeat.", parse);
				Text.NL();
				Text.Add("<i>”Don’t think you’ll get off the hook that easily,”</i> Lagon growls, grabbing hold of her jaw, forcing it open. <i>”A bad girl like you needs to be punished...”</i> He studies her pained expression as she struggles weakly against his iron grip.", parse);
				Text.NL();
				Text.Add("<i>”Perhaps you are right, perhaps I shouldn’t use Vena anymore. Perhaps you’d like to take her place? A mindless breeding slut, being fucked and impregnated day in and day out, is that the kind of life you yearn for?”</i> The lagomorph patriarch pries the alchemical draught from Ophelia’s hands, forcing it to her unwilling lips. <i>”Would you like to start right now?”</i>", parse);
				Text.NL();
				Text.Add("She shakes her head vehemently, and he relents, handing the bottle to you. <i>”In that case, your punishment has to be something... different.”</i> Under Lagon’s directions, Ophelia lies down on her back, opening her stained labcoat and spreading her legs wide. The larger male wastes no time on foreplay, soaking his stiff shaft in his daughter’s wet cunt before adjusting his aim, placing the head of his giant cock against Ophelia’s tight rosebud.", parse);
				Text.NL();
				Text.Add("There is no love in his ruthless fucking, just a cruel, animalistic lust and the assertion of dominance. Gradually, the girl’s cries of pain turns to pleading, begging for him to finish. His point made, he increases his pace, roaring as he deposits his load in her.", parse);
				Text.NL();
				Text.Add("<i>”Now, we have work to do.”</i> Without further ado, cock still dripping spunk, Lagon heads off, forcing you to keep up. Ophelia pulls up beside you, tugging her coat tightly around herself, avoiding looking in your direction. You trudge along in silence, feeling uncomfortable with yourself.", parse);
				
				lagon.relation.IncreaseStat(100, 5);
				ophelia.relation.DecreaseStat(-100, 25);
				
				PrintDefaultOptions();
			}, enabled : true,
			tooltip : "It’s not worth sticking your neck out for. What is she to you, after all?"
		});
		Gui.SetButtonsFromList(options, false, null);
		
		Gui.Callstack.push(function() {
			Text.NL();
			Text.Add("Before long, you’ve reached the large breeding cavern. The heat here is palpable, and a thick musk permeates the air despite the gathered rabbits gradually quieting down in the presence of their master. Lagon ignores the pleading and groveling sex-crazed peons, heading straight for Vena.", parse);
			Text.NL();
			Text.Add("<i>”I have another treat for you, my dear,”</i> he grins maliciously, presenting the matriarch with the large flask. Lithely, he springs up on her chest, pouring the volatile fluids down Vena’s gaping maw.", parse);
			Text.Flush();
			
			Scenes.Ophelia.DeliverFollowup(trait);
		});
	}
	else if(burrows.flags["Access"] < Burrows.AccessFlags.Stage3) {
		burrows.flags["Access"] = Burrows.AccessFlags.Stage3;
		
		Text.Add("<i>”Well… lets go see father.”</i> Ophelia looks a little scared, no doubt reluctant since her last encounter with Lagon, but not daring to disobey him. The two of you head towards the throne room, successful test subject and guard troop in tow. The alchemist looks morose, constantly fidgeting and adjusting her glasses nervously.", parse);
		Text.NL();
		Text.Add("After trodding along in silence, you reach the large royal chamber where Lagon holds court. The ruler of the burrows seems to be busy, balls deep inside a pretty little thing, a girl who looks like she could be Ophelia’s younger sister. Upon further consideration, she probably is.", parse);
		Text.NL();
		Text.Add("<i>”What do you have for me this time, my nerdy little slut?”</i> Lagon greets his daughter, grunting slightly as he rewards his lover with a fat sticky wad of cum. He gives her a slap on her butt as she awkwardly stumbles away with her hands between her legs, trying to prevent the semen from leaking out of her gaping cunt.", parse);
		Text.NL();
		Text.Add("<i>”I have a new potion for you, father,”</i> Ophelia explains demurely, waving for the test subject to be brought forth. He nods appreciatively, satisfied with the results of her research. <i>”No arguments today?”</i>", parse);
		Text.NL();
		Text.Add("<i>”...No.”</i> Ophelia bites her lip, sullenly hopping up beside you as all of you head towards the Pit. Lagon seems to be in a good mood for once, smirking to himself as he walks along briskly. You feel distinctly uncomfortable, walking down the vast cavern with the eyes of hundreds of horny rabbits focused on you, though the leader of the colony pays them no mind. Lagon has his subjects clear a space for your party at the center of the Pit, just next to where Vena is.", parse);
		Text.NL();
		Text.Add("<i>”Come, girl.”</i> He waves Ophelia to his side. <i>”Why don’t we go visit your mother?”</i> She follows him uncertainly, suspicious about his sudden joviality. She goes to the prone matriarch, pulling the woman’s lush hair from her clouded eyes.", parse);
		Text.NL();
		Text.Add("<i>”I thought I’d give you the honors,”</i> Lagon grasps her shoulder, handing her the bottle. He has one of his feet planted squarely on Vena’s chest, looming over the pair. Ophelia gulps, tears in her eyes as she feeds the final draft to her mother with trembling hands. <i>”Good girl, now wait over there.”</i> The alchemist hurriedly joins your side, watching anxiously as the effects begin to take hold.", parse);
		
		Scenes.Ophelia.DeliverFollowup(trait);
	}
	else {
		Text.Add("THIS IS A BUG. Burrows flag: [flag].", {flag: burrows.flags["Access"]});
		Text.Flush();
		Gui.NextPrompt();
	}
}

Scenes.Ophelia.DeliverFollowup = function(trait) {
	var parse = {
		playername : player.name
	};
	
	burrows.flags["Access"]++;
	
	Text.NL();
	if(trait == Burrows.Traits.Brute) {
		Text.Add("Just like with the test subject, the effects on Vena are immediate, if not quite as violent. All her limbs grow thicker, longer, filling out with muscle. It looks like she is gaining a good few feet on her already large frame. She looks much more athletic, her features toned but not overly bulging.", parse);
		Text.NL();
		if(burrows.HermActive()) {
			Text.Add("...Except, that is, for the third leg between her thighs. With this additional mutation, Vena’s cock has grown to an almost ridiculous size, at least two feet long and thick as an arm.", parse);
			Text.NL();
		}
		Text.Add("The matriarch flexes experimentally, trying out the reach of her enlarged limbs, hesitantly touching the significantly more defined muscles on her arm.", parse);
		Text.NL();
		Text.Add("<i>”Birth me many strong sons and daughters,”</i> Lagon murmurs.", parse);
		if(burrows.HermActive())
			Text.Add(" He is eyeing her immense member almost nervously, perhaps a bit intimidated by her size.", parse);
		if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
			Text.Add(" <i>”This is going to be interesting,”</i> Lagon chuckles, grinning maliciously.", parse);
	}
	else if(trait == Burrows.Traits.Herm) {
		Text.Add("<i>”Going to be interesting to see the effects of this one, it should make things… more efficient.”</i> Lagon chuckles as Vena squirms, crossing her legs feebly as unfamiliar feelings race through her body, focusing to a pinpoint on her clit. The matriarch cries out in surprise as the sensitive organ begins to grow rapidly, gaining inch upon inch and thickening significantly. The bulging new shaft is about nine inches when a cumslit forms on the head, squirting thick white fluids into the air.", parse);
		Text.NL();
		Text.Add("In the place of her clit stands a girthy rod that would put most men to shame, swollen in the middle and throbbing slightly. Thick rivulets of girl cum ooze down its length, making the mouths of every female in close vicinity water. It is clear that the matriarch is going to have even more rabbits vying for her attentions from now on.", parse);
		Text.NL();
		if(burrows.BruteActive()) {
			Text.Add("Her transformation has barely begun, however, as Vena’s other mutations kick in, her increased body mass reflecting itself on her new organ. Before the massive shaft has finally stopped growing, it is over two feet long and as thick as an arm.", parse);
			Text.NL();
		}
		Text.Add("Vena looks almost exhausted, but her erection shows no signs of diminishing.", parse);
		if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3)
			Text.Add(" <i>”Haha, this will be fun!”</i> Lagon gloats, grinning maliciously.", parse);
	}
	else if(trait == Burrows.Traits.Brainy) {
		Text.Add("Vena’s eyes flutter shut, her hands clutching her head as sparks of intelligence try to break the surface of her shattered mind. For a brief moment, she almost looks lucid, before her eyes are once again clouded by lust.", parse);
		Text.NL();
		Text.Add("<i>”Are you really too far gone, mother?”</i> Ophelia murmurs sadly, crestfallen to see how little effect even such a powerful dose had. Lagon just shrugs, more concerned with what effect the drug will have on her children than on the woman herself.", parse);
		
		if(burrows.flags["Access"] >= Burrows.AccessFlags.Stage3) {
			Text.NL();
			Text.Add("Vena shudders as a wave of arousal courses through her body, triggered by her new mutations. In no time, her immense cock is at full mast, eager to bury itself in some needy cunt.", parse);
			Text.NL();
			Text.Add("<i>”Ah, perfect timing,”</i> Lagon gloats, smiling maliciously.", parse);
		}
	}
	Text.Flush();
	
	Gui.NextPrompt(Scenes.Ophelia.Reward);
}

//TODO
Scenes.Ophelia.Reward = function() {
	var parse = {
		playername : player.name
	};
	
	Text.Clear();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.NL();
	Text.Add("", parse);
	Text.Flush();
}

