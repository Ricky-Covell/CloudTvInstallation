//filtfreq resonance scaling instead?
SynthDef(\simplesaw_sinmod25, {
	arg out, freq=440, sustain=1.0, modfreq=0.1, amp=1,
	modamp=0.66, filtfreq=3, attack=0.1, release=2.0;
	var osc=Saw.ar( [freq, freq].fold(60,6000), 0.5pi );
	var freqlpf=(SinOsc.kr(modfreq*LFNoise1.kr(0.1,0.5,0.5),
		0,modamp*filtfreq,filtfreq))*freq;
	osc = osc * EnvGen.ar(
		Env.linen(attack,sustain,release), doneAction: Done.freeSelf, levelScale: amp
	);
	osc = RLPF.ar(osc,Clip.kr(freqlpf,1000,12000),Clip.kr(0.1+(modfreq/2.5),0.2,1.0));
	Out.ar(out, osc);
}).store; //LFNoise2 + /15
SynthDef(\simplesaw_noisemod25, {
	arg out, freq=440, sustain=1.0, modfreq=0.1, amp=1,
	modamp=0.66, filtfreq=3, attack=0.1, release=2.0;
	var freqlpf=(LFNoise2.kr(modfreq,modamp*filtfreq,filtfreq))*freq;
	var osc= Saw.ar( [freq, freq].fold(60,6000), 0.5pi );
	osc = osc * EnvGen.ar(
		Env.linen(attack,sustain,release), doneAction: Done.freeSelf, levelScale: amp
	);
	osc = RLPF.ar(osc,Clip.kr(freqlpf,1000,12000),Clip.kr(0.1+(modfreq/10),0.2,1.0));
	Out.ar(out, osc);
}).store; //LFNoise2 + /15

//limiter+DC block for temperamental sources and nice speakers
//new master fx module -- gate distortion signal and use MiVerb instead of FreeVerb
SynthDef(\fx_distverbhyg26,{
	arg out=0,inBus,vol=1,         //output,input buses
	verbmix=0.6,distmix=0.5,     //dry/wet verb, distortion mix (0-1)
	distamp=2,distsmooth=0.5,  //distortion parameters (0-1)
	verbtime=0.15,verbdamp=0.5,   //reverb tail (0-1.25), damping (0-1)
	verbfreeze=0,verbdiff=0.625,  //verb tail freeze (nonzero on), reverb diffusion (0-2)
	gatethresh=0.01;              //gating RMS amp threshold on distortion
	var input=In.ar(inBus,2),dist;
	//distortion with dry/wet
	//gate distortion output based on input (since it self-oscillates at high distortion)

	//distort, tanh, softclip
	distamp = DelayL.kr(Lag.kr(distamp,5),10,10);
	dist = distort(input*distamp)/(distamp**0.75 + 1);
	//dist=CrossoverDistortion.ar(input,distamp,distsmooth);
	//dist=Compander.ar(dist,input,gatethresh,100,1,clampTime: 0.01, relaxTime: 0.1);
	input=XFade2.ar(input,dist,2*distmix-1);
	//reverb with dry/wet built-in
	input=MiVerb.ar(HPF.ar(input,500),verbtime,verbmix,verbdamp,0.05,verbfreeze,verbdiff);

	//hygiene
	input=LeakDC.ar(input,0.999); //DC block
	input=Limiter.ar(input,1,0.0005); //super responsive limiter
	Out.ar(out,vol*input);
}).store;

//less jaggedy beat repeat
//add envelope, mix, fade in/out, repitch portamento, (mostly) remove clicks
SynthDef(\fx_sweetrepeat27,{
	arg out=0,inBus=0,gate=1,freeze=0,loopdur=0.25,shrink=1,envbuf=0,mix=1;
	//write ramp
	var wr=Phasor.ar(0,1,0,SampleRate.ir*loopdur);
	//write ramp -- write when gate is off
	//var wr=Wrap.ar(Sweep.ar(clk,BufSampleRate.ir(buf)),0,BufFrames.ir(buf));
	//read ramp clock divider
	var rd=Phasor.ar(0,1/(Lag.kr(shrink,10)*LFNoise1.kr(0.2,0.1,1)),0,SampleRate.ir*loopdur);
	//var rd=Wrap.ar(wr/shrink,0,BufFrames.kr(buf));
	//input
	var in=In.ar(inBus,2);
	//fade in and out
	var env=BufRd.ar(1,envbuf,rd/(SampleRate.ir*loopdur)*BufFrames.kr(envbuf),1);
	//delay line
	var buf=LocalBuf.new((SampleRate.ir*loopdur).asInteger,2);
	//output
	var snd;
	//map [0,1] -> [-1,1]
	//freeze=2*freeze-1;
	//slowly bring it up/down
	freeze = Lag.ar(K2A.ar(freeze),25);
	//only stop writing at start/end of buffer
	freeze = Latch.ar(freeze,wr);
	//write when gate is off
	wr  = Gate.ar(wr,1-(2*freeze));//Gate.ar(wr,-1*freeze);
	//read when gate is on
	//rd  = Gate.ar(rd,2*freeze-1);
	//write to buf in a loop
	BufWr.ar(in,buf,wr,1);
	//mute during write
	snd = freeze*BufRd.ar(2,buf,rd,1);
	//apply envelope
	snd = env*snd;
	//decrease mix as shrink decreases (0.1->0.2, 1->0.8)
	mix = Clip.kr(-0.2/shrink+0.9,0.2,0.8);
	//replace with clean during write
	snd = XFade2.ar(in,snd,2*(freeze*mix)-1);
	Out.ar(out,snd);
}).store;
"stored synthdefs".postln;
