/*
 * 
 * Lust attacks
 * 
 */
Abilities.Seduction = {};


Abilities.Seduction.Sleep = new Ability();
Abilities.Seduction.Sleep.name = "Sleep";
Abilities.Seduction.Sleep.Short = function() { return "Put one enemy to sleep for a short while with magical charms."; }
Abilities.Seduction.Sleep.cost = { hp: null, sp: 20, lp: null};
Abilities.Seduction.Sleep.CastInternal = function(encounter, caster, target) {
	var parse = {
		Name   : caster.NameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc(),
		tname  : target.nameDesc(),
		tName  : target.NameDesc(),
		is     : target.is(),
		has    : target.has(),
		tnotS  : target.plural() ? "" : "s"
	};
	
	Text.Add("[Name] weave[notS] [hisher] [hand]s in alluring patterns, winking seductively at [tname]. ", parse);
	if(Status.Sleep(target, { hit : 0.6, turns : 2, turnsR : 2 })) {
		Text.Add("[tName] [is] unable to resist looking at the hypnotic display, and fall[tnotS] into a slumber. [tName] [has] been afflicted with sleep!", parse);
	}
	else {
		Text.Add("[tName] manage[notS] to shake off [poss] enchantment, resisting its drowsing effect.", parse);
	}
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.TIllusion = new Ability();
Abilities.Seduction.TIllusion.name = "T.Illusion";
Abilities.Seduction.TIllusion.Short = function() { return "Terrifies your foes by creating frightening phantasms that soak up any attacks directed at you."; }
Abilities.Seduction.TIllusion.cost = { hp: null, sp: 25, lp: 10};
Abilities.Seduction.TIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.TIllusion.CastInternal = function(encounter, caster) {
	var parse = {
		name   : caster.nameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc()
	};
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] terrifying apparitions, which rise from purple smoke; bellowing in rage while drawing their phantasmal weapons.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.Add("[p] spectral servant[s] quickly moves in the way of [aposs] attack, flowing into [ahisher] body with a spine-chilling screech, vanishing. ", parse);
		if(Status.Siphon(attacker, {turns: 1, turnsR: 2, hp: 25, sp: 5, caster: caster})) {
			Text.Add("[aName] stagger[anotS], the remnant of the revenant draining the energy from [ahisher] body. [aName] [ahas] been afflicted with siphon!", parse);
		}
		else {
			Text.Add("[aName] shrug[anotS] off the phantom’s chill.", parse);
		}
		Text.Flush();
		return false;
	} });
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.SIllusion = new Ability();
Abilities.Seduction.SIllusion.name = "S.Illusion";
Abilities.Seduction.SIllusion.Short = function() { return "Arouses your foes by creating a harem of alluring mirages."; }
Abilities.Seduction.SIllusion.cost = { hp: null, sp: 10, lp: 25};
Abilities.Seduction.SIllusion.targetMode = TargetMode.Self;
Abilities.Seduction.SIllusion.CastInternal = function(encounter, caster) {
	var parse = {
		name   : caster.nameDesc(),
		poss   : caster.possessive(),
		notS   : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		hand   : caster.HandDesc()
	};
	var num = 2;
	num += Math.random() * 3;
	parse["num"] = Text.NumToText(num);
	
	Text.Add("Weaving [hisher] [hand]s in exotic patterns, [name] create[notS] [num] mesmerising and utterly lewd images which strut about invitingly; offering comfort and release with throaty groans and soft, alluring gasps.", parse);
	Status.Decoy(caster, { copies : num, func : function(attacker) {
		var decoy = caster.combatStatus.stats[StatusEffect.Decoy];
		var num = decoy.copies;
		decoy.copies--;
		if(decoy.copies <= 0)
			caster.combatStatus.stats[StatusEffect.Decoy] = null;
		var parse = {
			p : num > 1 ? "One of " + caster.possessive() : caster.Possessive(),
			s : num > 1 ? "s" : "",
			aposs   : attacker.possessive(),
			aName   : attacker.NameDesc(),
			ahimher : attacker.himher(),
			ahisher : attacker.hisher(),
			ahas    : attacker.has(),
			anotS   : attacker.plural() ? "" : "s"
		};
		Text.Add("[p] titillating apparition[s] quickly moves in the way of [aposs] attack, flowing into [ahimher] with an orgasmic cry. ", parse);
		if(Status.Horny(attacker, { hit : 0.75, turns : 1, turnsR : 2, str : 1, dmg : 0.2 })) {
			Text.Add("[aName] stagger[anotS], flustered with visions of obscene acts. [aName] [ahas] been afflicted with horny!", parse);
		}
		else {
			Text.Add("[aName] resist[anotS], reigning in [ahisher] urges.", parse);
		}
		Text.Flush();
		return false;
	} });
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.Confuse = new Ability();
Abilities.Seduction.Confuse.name = "Confuse";
Abilities.Seduction.Confuse.Short = function() { return "Fuck a single opponent’s mind, temporarily drawing them to your side."; }
Abilities.Seduction.Confuse.cost = { hp: null, sp: 30, lp: 20};
Abilities.Seduction.Confuse.CastInternal = function(encounter, caster, target) {
	var parse = {
		Name    : caster.NameDesc(),
		hisher  : caster.hisher(),
		poss    : caster.possessive(),
		notS    : caster.plural() ? "" : "s",
		tName   : target.NameDesc(),
		tname   : target.nameDesc(),
		tis     : target.is(),
		tnotS   : target.plural() ? "" : "s",
		thimher : target.himher()
	}

	Text.Add("[Name] perform[notS] a hypnotising dance, blending in [hisher] alluring magic and attempting to assume control of [tname]. ", parse);
	
	if(Status.Confuse(target, {hit: 0.75, turns: 3, turnsR: 3})) {
		Text.Add("[tName] [tis] unable to resist [poss] power, and utterly falls under [hisher] control.", parse);
	}
	else {
		Text.Add("[tName] manage[tnotS] to compose [thimher]self, resisting [poss] unnatural influence.", parse);
	}
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.Rut = new Ability();
Abilities.Seduction.Rut.name = "Rut";
Abilities.Seduction.Rut.Short = function() { return "Hump away at target, dealing damage."; }
Abilities.Seduction.Rut.cost = { hp: null, sp: null, lp: 10};
Abilities.Seduction.Rut.CastInternal = function(encounter, caster, target) {
	var atkDmg = caster.LAttack();
	var def = target.LDefense();

	var dmg = Ability.Damage(atkDmg, def, caster.level, target.level);
	if(dmg < 0) dmg = 0;
	var atkType = new DamageType({pBlunt : 0.2, lust : 0.8});
	dmg = atkType.ApplyDmgType(target.elementDef, dmg);
	dmg = Math.floor(dmg);
			
	target.AddHPAbs(-dmg);
	target.AddLustAbs(dmg*0.25);
	
	var parse = {
		name : caster.NameDesc(),
		tName : target.nameDesc()
	}

	// TODO: Make more flavor text	
	Text.Add("[name] ruts against [tName] for " + Text.BoldColor(dmg, "#800000") + " damage! Sexy!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}

Abilities.Seduction.Fantasize = new Ability();
Abilities.Seduction.Fantasize.name = "Fantasize";
Abilities.Seduction.Fantasize.Short = function() { return "Raise own lust."; }
Abilities.Seduction.Fantasize.targetMode = TargetMode.Self;
Abilities.Seduction.Fantasize.CastInternal = function(encounter, caster) {
	var dmg = 1 * caster.LAttack();
	dmg = Math.floor(dmg);
	
	caster.AddLustAbs(dmg);
	
	var parse = {
		name : caster.NameDesc()
	}

	// TODO: Make more flavor text	
	Text.Add("[name] fantasizes, building " + Text.BoldColor(dmg, "#FF8080") + " lust! Sexy!", parse);
	Text.Flush();
	
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


Abilities.Seduction.Soothe = new Ability();
Abilities.Seduction.Soothe.name = "Soothe";
Abilities.Seduction.Soothe.cost = { hp: null, sp: 20, lp: null};
Abilities.Seduction.Soothe.Short = function() { return "Calm the wayward thoughts of your allies with the gentle touch of your voice."; }
Abilities.Seduction.Soothe.targetMode = TargetMode.Party;
Abilities.Seduction.Soothe.CastInternal = function(encounter, caster, target) {
	var targets = target.members;
	
	this.OnCast(encounter, caster, targets);
	
	for(var i = 0; i < targets.length; i++) {
		var e = targets[i];
		if(e.Incapacitated()) continue;
		
		var mult = 1 + (Math.random()-0.5)*0.2;
		var soothe = caster.Spi() * 3;
		
		e.AddLustAbs(soothe);
		
		this.OnHit(encounter, caster, e, soothe);
	}
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
Abilities.Seduction.Soothe.OnCast = function(encounter, caster, targets) {
	var group = targets.length > 1;
	var parse = { Poss: caster.Possessive(), their: group ? "their" : caster.hisher(), himher: group ? caster.hisher() + ' party' : caster.himher() };
	Text.Add("[Poss] gentle voice washes over [himher], calming [their] desires.", parse);
}
Abilities.Seduction.Soothe.OnHit = function(encounter, caster, target, dmg) {
	var parse = { tposs: target.possessive(), thimher: target.himher(), tName : target.NameDesc(), s: target.plural() ? "" : "s" };
	Text.NL();
	Text.Add("The music washes over [tposs] mind, leaving [thimher] feeling clean and pristine. [tName] lose[s] " + Text.BoldColor(dmg, "#000060") + " lust!", parse);
}


Abilities.Seduction.Captivate = new Ability();
Abilities.Seduction.Captivate.name = "Captivate";
Abilities.Seduction.Captivate.cost = { hp: null, sp: null, lp: 40};
Abilities.Seduction.Captivate.Short = function() { return "Attempt to immobilize and slow a foe with a captivating song. Success rate dependent on your charisma and the target’s lust. If it fails, the target is nevertheless slowed."; }
Abilities.Seduction.Captivate.CastInternal = function(encounter, caster, target) {
	this.OnCast(encounter, caster, target)
	
	var hit    = hitMod * caster.LHit();
	var evade  = target.LEvade();
	var toHit  = Ability.ToHit(hit, evade);
	
	var success = Math.random() < toHit;
	if(success)
		success = Status.Numb(target, { hit : 0.8, turns : 1, proc : 1 });
	
	if(success)
		this.OnHit(encounter, caster, target);
	else
		this.OnMiss(encounter, caster, target);
	
	Status.Slow(target, { hit : 0.6, factor : 2, turns : 3, turnsR : 3 });
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}
Abilities.Seduction.Captivate.OnCast = function(encounter, caster, target) {
	var parse = {
		tname: target.nameDesc(),
		name: caster.nameDesc(),
		s: caster.plural() ? "" : "s",
		hisher: caster.hisher()
	};
	Text.Add("Fixing [tname] with a piercing gaze, [name] begin[s] singing, [hisher] song’s captivating undertones ringing through the air. ", parse);
}
Abilities.Seduction.Captivate.OnHit = function(encounter, caster, target) {
	var parse = {
		tName: target.NameDesc(),
		poss: caster.possessive()
	};
	Text.Add("[tName] is utterly entranced by [poss] song and is slowed to a stop, completely immobilized.", parse);
}
Abilities.Seduction.Captivate.OnMiss = function(encounter, caster, target) {
	var parse = {
		tName: target.NameDesc(),
		s: target.plural() ? "" : "s",
		thisher: target.hisher()
	};
	Text.Add("[tName] manage[s] to resist the brunt of the mesmerizing melody, but still finds [thisher] movements slowed.", parse);
}


Abilities.Seduction.Lull = new Ability();
Abilities.Seduction.Lull.name = "Lull";
Abilities.Seduction.Lull.cost = { hp: null, sp: 10, lp: 10};
Abilities.Seduction.Lull.Short = function() { return "Put the foe to sleep with a soothing song."; }
Abilities.Seduction.Lull.CastInternal = function(encounter, caster, target) {
	this.OnCast(encounter, caster, target)
	
	var hit    = hitMod * caster.LHit();
	var evade  = target.LEvade();
	var toHit  = Ability.ToHit(hit, evade);
	
	var parse = {
		Name : caster.NameDesc(),
		poss : caster.possessive(),
		s : caster.plural() ? "" : "s",
		hisher : caster.hisher(),
		tname : target.nameDesc(),
		tName : target.NameDesc(),
		ts : target.plural() ? "" : "s"
	};
	
	Text.Add("[Name] raise[s] [hisher] voice in a soothing song, lulling [tname] with the haunting tune. ", parse);
	
	if(Status.Sleep(target, { hit : 0.8, turns : 3, turnsR : 3 })) {
		Text.Add("Overcome by [poss] song, [tname] falls asleep.", parse);
	}
	else
		Text.Add("[tName] shrug[ts] it off, managing to stay awake.", parse);
	
	Text.Flush();
	Gui.NextPrompt(function() {
		encounter.CombatTick();
	});
}


