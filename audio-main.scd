//close other servers
Server.killAll;
//MIDI reset routine
~init_state = {
	arg i;
	var random = Array[0,1,2,3,13,14];
	var small  = Array[8,9,10,11];
	var zero   = Array[4,5];
	var half   = Array[6,7,12,15];
	var funcs  = Array[
		{127.rand.asInteger}, //random
		{5.rand.asInteger},   //small
		{0},                    //zero
		{63}                    //half
	];
	var choice;
	if(random.includes(i), {choice=0}, {});
	if(small.includes(i),  {choice=1}, {});
	if(zero.includes(i),   {choice=2}, {});
	if(half.includes(i),   {choice=3}, {});
	//choice.postln;
	funcs[choice].value;
};
MIDIClient.init;
//connect supercollider to MFT in jack graph
m = MIDIOut.new(0);
//reset every 2 hours
{
	{
		60.wait;
		16.do({|i| m.control(
			chan: 0, ctlNum: i, val:~init_state.value(i)
		)});
	}.loop;
}.fork;

//MIDI mapping
~domap = {
	arg state, params, diff;
	//--- FIRST ROW ---
	params.put(\modfreq,     state[ 0].linlin(0, 1,  0,    5.0));
	params.put(\modamp,      state[ 1].linlin(0, 1,  0,    0.5));
	params.put(\filtfreq,    state[ 2].linlin(0, 1,  0,   10.0));
	params.put(\scaledur,    state[ 3].linlin(0, 1, 12,   96  ));
	//--- SECOND ROW ---
	params.put(\freeziness,  state[ 4].linlin(0, 1,  0,    1  ));
	params.put(\freezepitch, state[ 5].linlin(0, 1,  1.1,  0.1));
	params.put(\durskew,     state[ 6].linlin(0, 1, -0.5,  0.5));
	params.put(\overlap,     state[ 7].linlin(0, 1,  1,    3  ));
	//--- THIRD ROW ---
	params.put(\tempo,       state[ 8].linlin(0, 1,  5,   15  ));
	params.put(\burstiness,  state[ 9].linlin(0, 1, 10,   20  ));
	params.put(\nburst,      state[10].linlin(0, 1,  2,    6  ));
	params.put(\chorddur,    state[11].linlin(0, 1,  8,   64  ));
	//--- FOURTH ROW ---
	params.put(\voicingdur,  state[12].linlin(0, 1,  4,   64  ));
	params.put(\noctaves,    state[13].linlin(0, 1,  1,    5  ));

	//--- METAPARAMETERS ---
	params.put(\dist,             diff.linlin(0, 0.7,0.5, 50.0));
};
//MIDI control
~state  = Array.fill(16,{0});
~past   = Array.fill(16,{0});
~future = Array.fill(16,{0});
~diff   = [0,0];
//volume (last knob) has less memory
~kgain  = 0.9;
~gain   = 16.collect({~kgain});
~gain[15] = 0.2;
~gain[3]  = 0.2;
		//\scaledur \chorddur \voicingdur \noctaves
~params = IdentityDictionary[
	// --- TIMBRE ---
	\modfreq->0,     //LFO freq
	\modamp->0,      //LFO depth
	\filtfreq->0,    //multiples of f0
	// --- SEQUENCING ---
	\overlap->1,     //note overlap
	\tempo->20,      //bpm
	\burstiness->20, //number of slow notes between fast notes
	\nburst->5,      //number of fast notes in burst
	\durskew->0,     //tilt note duration PDF
	// --- HARMONY ---
	\compactness->0, //octave variance
	\scaledur->12,   //num notes per tonality
	\chordur->12,    //num notes per chord
	\voicingdur->12, //num notes per pitch->octave mapping
	\noctaves->3,    //num octaves to spread chord over
	//\scaleblur->0,   //1 vs. 2 simultaneous tonalities
	//\clumping->0,    //draw single notes vs. chords
	//\enharm->0,      //enharmonic vs. isomorphic tonality changes
	//\chord->0,       //which chord in o1 to cycle with (4 triad, 3 tetrad)
	//\modecycle->0,   //mode progression type
	// -- EFFECTS ---
	\freeziness->0,  //prob
	\freezepitch->1, //vari rate
	\dist->0,        //distortion
	//\verb->0,        //reverb
	//\verbcrush->0    //runaway reverb feedback and/or reverb freezing

];
//push current knob state to ~future
MIDIIn.connectAll;
16.do({|num| MIDIdef.cc(num.asSymbol,
	{|val, num| ~future[num] = val/127.0}
)});

//~state smooths out knob-turns on a fixed clock
{
	{
		1.0.wait;
		//lowpass knob values
		~state = ~gain*~past+(1-~gain)*~future; //present
		//take aggregate change
		~diff[1] = (0.3*(~state-~past).abs.sum)+(0.7*~diff[0]); //present
		//step forward
		~diff[0] = ~diff[1]; //past
		~past  = ~state; //past
		//apply values to synth
		~domap.value(~state,~params,~diff[0]);
	}.loop;
}.fork;

//patterns and effects
s.waitForBoot({

	"audio-synthdefs.scd".loadRelative;

	//pitch-system resources
	//scales 0-5 = otonality rows, scales 6-11 = utonality columns
	~scale   = IdentityDictionary[
		0->\partch_o1, 1->\partch_o2, 2->\partch_o3,
		3->\partch_o4, 4->\partch_o5, 5->\partch_o6,
		6->\partch_u1, 7->\partch_u2, 8->\partch_u3,
		9->\partch_u4, 10->\partch_u5, 11->\partch_u6
	];
	~scale.keysValuesChange({|key, value| Scale.at(value)});

	//pluck
	//integrator
	~linen=Env.linen(0.1,0.8,0.1);
	~linen=0.to(8192).collect({|t| ~linen.at(t/8192)});
	Buffer.loadCollection(s,~linen,action:{|bufenv|
		//--- ROUTING ---
		~sources  = Group.new;
		~effects1 = Group.after(~sources);
		~effects2 = Group.after(~effects1);
		~mbus     = Bus.audio(s, 2);
		~rbus     = Bus.audio(s, 2);

		//--- HARMONY ---
		//scale index 0 to 11
		//sequentially loop major and minor modes
		~pscale  = Pdup(
			n: Pfunc{~params.at(\scaledur).asInteger},
			pattern: Pseq([6,7,8,9,10,11,0,1,2,3,4,5],inf)
		);
		//cycle over three tetrads: 1-3-5-7, 9-11-7-2, 5-11-3-2
		~pchord  = Pdup(Pfunc{~params.at(\chorddur).asInteger},
			Pseq([[0,2,4,5],[1,3,5,6],[2,3,4,6]],inf));
		//randomly pick notes from tetrad
		~pdegree = Pindex(~pchord,Prand([0,1,2,3]),inf);
		//one octave for each scale degree, rotating every \voicingdur notes
		~pvoicing = (~pdegree + Pdup(Pfunc{~params.at(\voicingdur)},Pwhite(0,5,inf)));
		//octaves 3 to 6, with squishing
		~pvoicing = (~pvoicing % Pfunc{~params.at(\noctaves)}.asInteger).asInteger+4;
		//TODO: should low octave range always mean low pitches?
		//TODO: subset tetrads to triads?
		//TODO: what about panning?
		//TODO:
		//TODOTODO: what about (1) more carefully choosing the mode cycle (like
		// o1->u1->u3->o3->o1->o9->u9->o5->o7->u7->o1) , and
		//(2)actually always having kind of a narrow octave range and moving it around?
		//      or a beta distribution with an excluded middle?
		//(3) is burst actually working?? it might be because octaves but I can't hear it

		//--- RHYTHM ---

		//sample durations from a beta distribution
		//Pbeta:
		//    7,7 -> gaussian
		//    1,7 -> low value-skewed
		//    7,1 -> high value-skewed
		~get_prob1 = {|skew| 7-(6*skew.isNegative.asInteger*skew.abs)};
		~get_prob2 = {|skew| 7-(6*skew.isPositive.asInteger*skew.abs)};
		//scale distribution samples by tempo
		~pdur  = (60/Pfunc{~params.at(\tempo)})*Pbeta(
			lo: 0.05,
			hi: 1,
			prob1: Pfunc{~get_prob1.value(~params.at(\durskew))},
			prob2: Pfunc{~get_prob2.value(~params.at(\durskew))},
			length:inf
		);
		//switch between short and regular durations
		~pburst = 1-(0.99*(                            //formula = 1-0.9*dutyPulse
			Pseries(0,1,inf)                            //clock ramp up
			%((Pfunc{~params.at(\burstiness)}+          //N=burstiness, M=nburst
				Pfunc{~params.at(\nburst)})             //every N slow notes,
			>(Pfunc{~params.at(\burstiness)}-           //have M fast notes
				Pfunc{~params.at(\nburst)})).asInteger)
		);

		//--- INSTRUMENT ---
		Pdef(\broad,Pbind(

			//integer index for 12 modes
			\scale,Pdict(~scale,~pscale),

			//diamond to tuning indexing
			\degree, ((~pscale<6).asInteger*2-1).asInteger*~pdegree+~pscale % 5,

			//shorten durations via burst
			\dur,~pburst*~pdur,

			//slowly switch between noise and sinusoid filter LFO
			\instrument,Pindex(
				[\simplesaw_sinmod25,\simplesaw_noisemod25],
				Pbrown(0.0,2.0,0.5).asInteger
			),

			//slowly modulate LFO frequency
			\modfreq,(Pbrown(0.0,10.0,1.05)+Pfunc{~params.at(\modfreq)}).clip(0,10.0),

			//slowly modulate LFO depth
			\modamp,(Pbrown(0,0.7,0.1)+Pfunc{~params.at(\modamp)}).clip(0,0.9),

			//LPF frequency relative to fundamental
			\filtfreq,Prand([0.5,1,2,3,3.5],inf)+Pfunc{~params.at(\filtfreq)},
			\octave,~pvoicing,

			//scale volume by octave and note density
			\amp,0.2*(-0.2*(Pkey(\octave)-3)+1)*(1/Pfunc{~params.at(\overlap)}),

			//scale sustains by overlap and octave
			\sustain,Pfunc{~params.at(\overlap)}*~pdur*(-0.1*Pkey(\octave)+1),

			//routing
			\out,~rbus,
			\addAction,\addToHead,
			\target,~sources
		)).play;

		//--- EFFECTS ---
		//beat repeat effect
		Pdef(\repeat,Pmono(\fx_sweetrepeat27,\inBus,~rbus,\out,~mbus,
			\loopdur,3,\envbuf,bufenv,\target,~effects1,\addAction,\addToHead,
			\dur,3,\freeze,Pwhite(0,
				Pfunc{~params.at(\freeziness)*1.5+1.05}
			).clip(0,1).asInteger,
			\shrink,Pfunc{~params.at(\freezepitch)}
		)).play;

		//distortion, reverb, DC blocker, and limiter
		Pdef(\distverb,Pmono(\fx_distverbhyg26,\inBus,~mbus,\out,0,
			\target,~effects2,\addAction,\addToTail,\verbtime,0.7,\verbmix,0.7,
			\dur,5,\verbdamp,0.2,\verbdiff,0.5,\distmix,0.8,
			\distamp,Pfunc{~params.at(\dist)},
			\verbfreeze,Place(#[0,0,0,0,[0,0,1,0],[0,1,0,1],[1,0,1,1],[0,1,1,0]],inf)
		)).play;
/*		~repeat   = Synth.new(
			\fx_sweetrepeat27,
			[\inBus,~rbus,\out,~mbus,\loopdur,3,\envbuf,bufenv],
			~effects1,\addToHead
		);*/
		//~mfx      = Synth.new(\fx_distverbhyg26,[\inBus,~mbus,\out,0],~effects2,\addToHead);
		//~mfx.free
/*		~mfx      = Synth.new(\fx_distverbhyg26,[\inBus,~mbus,\out,0,
			\verbtime,0.7,\verbmix,0.8,\verbdamp,0.2,\verbdiff,0.5,
			\distamp,1,\distmix,0.5
		],
			~effects2,\addToHead);*/
//		~mfx.free
		//p = Pmono(\fx_distverbhyg26,\inBus,~mbus,\out,0,\dur,Pseq([1],inf),\target,~effects2,\addAction,\addToTail).play;
		//p.stop
/*		~mfx.set(\distamp,1)
		~mfx.set(\distmix,0.5)
		~mfx.set(\verbtime,0.7)
		~mfx.set(\verbdiff,0.5)*/
	});

	//1. state = scale (o_0 to o_3)
	//fixed chord in indexing but rapidly changing scale
	//SC_250503_135250.wav
	/*(
	p=Pbind(
	\degree, Pxrand([0,2,4,5,\rest],inf), //or Pseq, or Protate
	\scale,Pdict(~scale,Pseq([0,1,2,3],inf)),
	\dur,0.5,
	\sustain,4,
	\instrument,\simplesaw_sinmod25,
	\out,~mbus,
	\addAction,\addToHead,
	\target,~sources
	).play;
	)*/
});

//x = {Out.ar(0,In.ar(~mbus,2))}.play
//x.free
//x = {Out.ar(~mbus,SinOsc.ar(440,mul:0.5)}.play
//x.free
//Pdef(\broad).stop
/*~repeat.set(\shrink,0.1);
~repeat.set(\mix,1   );
~repeat.set(\mix,0.2);
~repeat.set(\freeze,1);
~repeat.set(\freeze,0);
~mfx.set(\verbmix,0.8  );
~mfx.set(\verbtime,0.4  );
~mfx.set(\distmix,  0);
~mfx.set(\distamp,  0);*/
