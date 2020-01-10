import React, { useState, useRef, useEffect } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import AtmosDrumsDisplay from '../Components/AtmosphereDisplay';
///////////////////////////////////////////////////////////
import { distortionCurve } from '../utils/distortionCurve';
import { CreateConvolver } from '../utils/createConvolver';
import BathVader from '../assets/ImpulseResponses/Bath-Vader.wav';
import CoolHandLuke from '../assets/ImpulseResponses/cool-hand-luke.wav';
import ElegantWeapon from '../assets/ImpulseResponses/elegant-weapon.wav';
import EtTuDeTu from '../assets/ImpulseResponses/et-tu-d-2.wav';
import HavingABlast from '../assets/ImpulseResponses/having-a-blast.wav'
import HelloThere from '../assets/ImpulseResponses/hello-there.wav';


const AtmosDrums = () => {

    const [audioCTX, setAudioCTX] = useState(false)
    const [engaged, setEngaged] = useState(false);

    const [input, setInput] = useState();
    const [output, setOutput] = useState();

    const analyser = useRef();

    const [gain, setGain] = useState();
    const channelGain = useRef();

    const [dry, setDry] = useState();
    const [wet, setWet] = useState();

    const dryGain = useRef();
    const wetGain = useRef();

    const [distortionDryMix, setDistortionDryMix] = useState();
    const [distortionWetMix, setDistortionWetMix] = useState();

    const distortionDry = useRef();
    const distortionWet = useRef();

    const [distortionOversample, setDistortionOversample] = useState();

    const distortion = useRef();
    const distortionOutput = useRef();

    const [convolverDryMix, setConvolverDryMix] = useState();
    const [convolverWetMix, setConvolverWetMix] = useState();

    const convolverDry = useRef();
    const convolverWet = useRef();

    const bath_vader = useRef();
    const bath_vader_gain = useRef();

    const cool_hand_luke = useRef();
    const cool_hand_luke_gain = useRef();

    const elegant_weapon = useRef();
    const elegant_weapon_gain = useRef();

    const et_tu_dee_too = useRef();
    const et_tu_dee_too_gain = useRef();

    const having_a_blast = useRef();
    const having_a_blast_gain = useRef();

    const hello_there = useRef();
    const hello_there_gain = useRef();

    const [convolver, setConvolver] = useState('bath vader')
    const convolverOutput = useRef();

    const outputGain = useRef();

    useEffect(() => {

        if(channelGain.current !== undefined){

            channelGain.current.gain.value = gain;

        }

    }, [gain]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            wetGain.current.gain.value = (wet/2);
            dryGain.current.gain.value = (dry/2);

        }

    }, [wet, dry]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            distortionWet.current.gain.value =  distortionWetMix/2;
            distortionDry.current.gain.value = distortionDryMix/2;

        }

    }, [distortionWetMix, distortionDryMix]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            distortion.current.oversample = distortionOversample;

        }

    }, [distortionOversample]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            if(convolver === 'bath vader'){
                bath_vader_gain.current.gain.value = 1;
                cool_hand_luke_gain.current.gain.value = 0;
                elegant_weapon_gain.current.gain.value = 0;
                et_tu_dee_too_gain.current.gain.value = 0;
                having_a_blast_gain.current.gain.value = 0;
                hello_there_gain.current.gain.value = 0;
            } else if(convolver === 'cool hand luke'){
                bath_vader_gain.current.gain.value = 0;
                cool_hand_luke_gain.current.gain.value = 1;
                elegant_weapon_gain.current.gain.value = 0;
                et_tu_dee_too_gain.current.gain.value = 0;
                having_a_blast_gain.current.gain.value = 0;
                hello_there_gain.current.gain.value = 0;
            } else if(convolver === 'elegant weapon'){
                bath_vader_gain.current.gain.value = 0;
                cool_hand_luke_gain.current.gain.value = 0;
                elegant_weapon_gain.current.gain.value = 1;
                et_tu_dee_too_gain.current.gain.value = 0;
                having_a_blast_gain.current.gain.value = 0;
                hello_there_gain.current.gain.value = 0;
            } else if(convolver === 'et-tu dee-2'){
                bath_vader_gain.current.gain.value = 0;
                cool_hand_luke_gain.current.gain.value = 0;
                elegant_weapon_gain.current.gain.value = 0;
                et_tu_dee_too_gain.current.gain.value = 1;
                having_a_blast_gain.current.gain.value = 0;
                hello_there_gain.current.gain.value = 0;
            } else if(convolver === 'having a blast'){
                bath_vader_gain.current.gain.value = 0;
                cool_hand_luke_gain.current.gain.value = 0;
                elegant_weapon_gain.current.gain.value = 0;
                et_tu_dee_too_gain.current.gain.value = 0;
                having_a_blast_gain.current.gain.value = 1;
                hello_there_gain.current.gain.value = 0;
            } else if(convolver === 'hello there'){
                bath_vader_gain.current.gain.value = 0;
                cool_hand_luke_gain.current.gain.value = 0;
                elegant_weapon_gain.current.gain.value = 0;
                et_tu_dee_too_gain.current.gain.value = 0;
                having_a_blast_gain.current.gain.value = 0;
                hello_there_gain.current.gain.value = 1;
            }
 
        }
    }, [convolver]);

    useEffect(() => {

        if(channelGain.current !== undefined){

            convolverDry.current.gain.value = convolverDryMix/2;
            convolverWet.current.gain.value = convolverWetMix/2;
        }

    }, [convolverDryMix, convolverWetMix])


    const setUserInput = (streamNode, gainNode) => {

        setInput(streamNode);

        channelGain.current = gainNode;
    };

    const setWetDryOutput = (dryGainNode, wetGainNode, outputGainNode) => {

        dryGain.current = dryGainNode;
        dryGain.current.gain.value = 1;

        wetGain.current = wetGainNode;
        wetGain.current.gain.value = 0;

        outputGain.current = outputGainNode;

    };

    const setComponentDistortion = async (distortionDryGainNode, distortionWetGainNode, distortionOutputGainNode, distortionNode) => {

        distortionDry.current = distortionDryGainNode;
        distortionWet.current = distortionWetGainNode;
        distortionOutput.current = distortionOutputGainNode;

        const curve = await distortionCurve(50);
        distortionNode.curve = curve;

        distortion.current = distortionNode;
    };

    const setComponentConvolvers = async (context) => {

        convolverDry.current = context.createGain();
        convolverDry.current.gain.value = 1;

        convolverWet.current = context.createGain();
        convolverWet.current.gain.value = 0;

        convolverOutput.current = context.createGain();

        bath_vader.current = await CreateConvolver(BathVader, context);
        bath_vader_gain.current = context.createGain();
        bath_vader_gain.current.gain.value = 1;

        cool_hand_luke.current = await CreateConvolver(CoolHandLuke, context);
        cool_hand_luke_gain.current = context.createGain();
        cool_hand_luke_gain.current.gain.value = 0;

        elegant_weapon.current = await CreateConvolver(ElegantWeapon, context);
        elegant_weapon_gain.current = context.createGain();
        elegant_weapon_gain.current.gain.value = 0;

        et_tu_dee_too.current = await CreateConvolver(EtTuDeTu, context);
        et_tu_dee_too_gain.current = context.createGain();
        et_tu_dee_too_gain.current.gain.value = 0;

        having_a_blast.current = await CreateConvolver(HavingABlast, context);
        having_a_blast_gain.current = context.createGain();
        having_a_blast_gain.current.gain.value = 0;

        hello_there.current = await CreateConvolver(HelloThere, context);
        hello_there_gain.current = context.createGain();
        hello_there_gain.current.gain.value = 0;
    }

    const setAudioAnalyser = (analyserNode) => {

        analyserNode.fftSize = 128;
        analyser.current = analyserNode;
    };

    const createAudioNodes = (userMediaStreamNode, context) => {

        setUserInput(userMediaStreamNode, context.createGain());

        setWetDryOutput(context.createGain(), context.createGain(), context.createGain());

        setComponentDistortion(context.createGain(), context.createGain(), context.createGain(), context.createWaveShaper());

        setComponentConvolvers(context);

        setAudioAnalyser(context.createAnalyser());
    }

    const getContext = async () => {

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context =  new AudioContext();

        if(!context){
            window.alert('Current browser not supported')
            return;
        }

        setOutput(context.destination);

        const userMediaStreamNode = await getUserMediaStream(context);

        if(userMediaStreamNode.error || !userMediaStreamNode){
            window.alert('could not access user media')
            return;

        } else {
            createAudioNodes(userMediaStreamNode, context);
            setAudioCTX(!audioCTX)
        }

    };

    const engageDisengage = () => {

        if(!engaged){

            setEngaged(!engaged)

            input.connect(analyser.current)

            input.connect(channelGain.current)

            channelGain.current.connect(dryGain.current)
            channelGain.current.connect(wetGain.current)

            dryGain.current.connect(outputGain.current)
            outputGain.current.connect(output)

            wetGain.current.connect(distortionDry.current)
            wetGain.current.connect(distortionWet.current)

            distortionDry.current.connect(distortionOutput.current)

            distortionWet.current.connect(distortion.current)
            distortion.current.connect(distortionOutput.current);

            distortionOutput.current.connect(convolverDry.current)
            distortionOutput.current.connect(convolverWet.current)

            convolverDry.current.connect(convolverOutput.current)

            convolverWet.current.connect(bath_vader_gain.current)
            bath_vader_gain.current.connect(bath_vader.current)
            bath_vader.current.connect(convolverOutput.current)

            convolverWet.current.connect(cool_hand_luke_gain.current)
            cool_hand_luke_gain.current.connect(cool_hand_luke.current)
            cool_hand_luke.current.connect(convolverOutput.current)

            convolverWet.current.connect(elegant_weapon_gain.current)
            elegant_weapon_gain.current.connect(elegant_weapon.current)
            elegant_weapon.current.connect(convolverOutput.current)

            convolverWet.current.connect(et_tu_dee_too_gain.current)
            et_tu_dee_too_gain.current.connect(et_tu_dee_too.current)
            et_tu_dee_too.current.connect(convolverOutput.current)

            convolverWet.current.connect(having_a_blast_gain.current)
            having_a_blast_gain.current.connect(having_a_blast.current)
            having_a_blast.current.connect(convolverOutput.current)

            convolverWet.current.connect(hello_there_gain.current)
            hello_there_gain.current.connect(hello_there.current)
            hello_there.current.connect(convolverOutput.current)

            convolverOutput.current.connect(outputGain.current)

            outputGain.current.connect(output);

        } else {

            setEngaged(!engaged)

            input.disconnect(analyser.current)

            input.disconnect(channelGain.current)

            channelGain.current.disconnect(dryGain.current)
            channelGain.current.disconnect(wetGain.current)

            dryGain.current.disconnect(outputGain.current)

            wetGain.current.disconnect(distortionDry.current)
            wetGain.current.disconnect(distortionWet.current)

            distortionDry.current.disconnect(distortionOutput.current)
            
            distortionWet.current.disconnect(distortion.current)
            distortion.current.disconnect(distortionOutput.current);

            distortionOutput.current.disconnect(convolverDry.current)
            distortionOutput.current.disconnect(convolverWet.current)

            convolverDry.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(bath_vader_gain.current)
            bath_vader_gain.current.disconnect(bath_vader.current)
            bath_vader.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(cool_hand_luke_gain.current)
            cool_hand_luke_gain.current.disconnect(cool_hand_luke.current)
            cool_hand_luke.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(elegant_weapon_gain.current)
            elegant_weapon_gain.current.disconnect(elegant_weapon.current)
            elegant_weapon.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(et_tu_dee_too_gain.current)
            et_tu_dee_too_gain.current.disconnect(et_tu_dee_too.current)
            et_tu_dee_too.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(having_a_blast_gain.current)
            having_a_blast_gain.current.disconnect(having_a_blast.current)
            having_a_blast.current.disconnect(convolverOutput.current)

            convolverWet.current.disconnect(hello_there_gain.current)
            hello_there_gain.current.disconnect(hello_there.current)
            hello_there.current.disconnect(convolverOutput.current)

            convolverOutput.current.disconnect(outputGain.current)

            outputGain.current.disconnect(output);
        }
    };

    const handleChannelGainChange = (g) => {

        if(g < 0){
            setGain(0)
        } else if(g > 2){
            setGain(2)
        } else {
            setGain(g)
        }
    };

    const handleWetDryGainChange = (w) => {

        if(w < 0){
            setWet(0);
            setDry(2);
        } else if(w > 2){
            setWet(2);
            setDry(0);
        } else {
            setWet(w);
            setDry(2-w);
        }
    };

    const handleConvolverMixControl = (v) => {

        if(v < 0){
            setConvolverWetMix(0);
            setConvolverDryMix(2);
        } else if(v > 2){
            setConvolverWetMix(2);
            setConvolverDryMix(0);
        } else {
            setConvolverWetMix(v);
            setConvolverDryMix(2 - v);
        }
    };

    const handleConvolverSelector = (v) => {
        setConvolver(v)
    };

    const handleDistortionMixControl = (d) => {

        if(d < 0){
            setDistortionWetMix(0);
            setDistortionDryMix(2);
        } else if(d > 2){
            setDistortionWetMix(2);
            setDistortionDryMix(0);
        } else {
            setDistortionWetMix(d)
            setDistortionDryMix(2-d)
        }
    };

    const handleDistortionOversampleControl = (o) => {
        setDistortionOversample(o);
    };

    return (
        <div>
            <AtmosDrumsDisplay getContext={getContext} engageDisengage={engageDisengage} analyser={analyser} handleChannelGainChange={handleChannelGainChange} handleWetDryGainChange={handleWetDryGainChange} handleDistortionMixControl={handleDistortionMixControl} handleDistortionOversampleControl={handleDistortionOversampleControl} handleConvolverMixControl={handleConvolverMixControl} handleConvolverSelector={handleConvolverSelector} audioCTX={audioCTX}/>  
        </div>
    )
}

export default AtmosDrums;
