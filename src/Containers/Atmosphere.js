import React, { useState, useRef, useEffect } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import AtmosDrumsDisplay from '../Components/AtmosphereDisplay';
///////////////////////////////////////////////////////////
import { distortionCurve } from '../utils/distortionCurve';
import { CreateConvolver } from '../utils/createConvolver';
import BathVader from '../assets/ImpulseResponses/Bath-Vader.wav'


const AtmosDrums = () => {

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

    const convolverDry = useRef();
    const convolverWet = useRef();

    const bath_vader = useRef();

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

    }, [distortionOversample])


    const setUserInput = (streamNode, gainNode) => {

        setInput(streamNode);

        channelGain.current = gainNode;
    };

    const setWetDryOutput = (dryGainNode, wetGainNode, outputGainNode) => {

        dryGain.current = dryGainNode;
        wetGain.current = wetGainNode;
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

    const setComponentConvolver = async (convolverGainNodeDry, convolverGainNodeWet, convolverOutputGainNode, bathVader) => {

        convolverDry.current = convolverGainNodeDry;
        convolverWet.current = convolverGainNodeWet;
        convolverOutput.current = convolverOutputGainNode;

        const vaderVerb = await bathVader;
        bath_vader.current = vaderVerb;


    }

    const setAudioAnalyser = (analyserNode) => {

        analyserNode.fftSize = 128;
        analyser.current = analyserNode;
    };

    const createAudioNodes = (userMediaStreamNode, context) => {

        setUserInput(userMediaStreamNode, context.createGain());

        setWetDryOutput(context.createGain(), context.createGain(), context.createGain());

        setComponentDistortion(context.createGain(), context.createGain(), context.createGain(), context.createWaveShaper());

        setComponentConvolver(context.createGain(), context.createGain(), context.createGain(), CreateConvolver(BathVader, context));

        setAudioAnalyser(context.createAnalyser());
    }

    const getContext = async () => {

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context =  new AudioContext();

        setOutput(context.destination);

        const userMediaStreamNode = await getUserMediaStream(context);

        if(userMediaStreamNode.error){

            return;

        } else {
            createAudioNodes(userMediaStreamNode, context);
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

            convolverWet.current.connect(bath_vader.current)
            bath_vader.current.connect(convolverOutput.current)

            convolverOutput.current.connect(outputGain.current)

            outputGain.current.connect(output);

        } else {

            setEngaged(!engaged)

            input.disconnect(analyser.current)

            input.disconnect(channelGain.current)

            channelGain.current.disconnect(dryGain.current)
            channelGain.current.disconnect(wetGain.current)

            dryGain.current.disconnect(outputGain.current)
            outputGain.current.disconnect(output)

            wetGain.current.disconnect(distortionDry.current)
            wetGain.current.disconnect(distortionWet.current)

            distortionDry.current.disconnect(distortionOutput.current)
            
            distortionWet.current.disconnect(distortion.current)
            distortion.current.disconnect(distortionOutput.current);

            distortionOutput.current.disconnect(convolverDry.current)
            distortionOutput.current.disconnect(convolverWet.current)

            convolverDry.current.disconnect(convolverOutput.current)
            convolverWet.current.disconnect(convolverOutput.current)

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
            <AtmosDrumsDisplay getContext={getContext} engageDisengage={engageDisengage} analyser={analyser} handleChannelGainChange={handleChannelGainChange} handleWetDryGainChange={handleWetDryGainChange} handleDistortionMixControl={handleDistortionMixControl} handleDistortionOversampleControl={handleDistortionOversampleControl}/>  
        </div>
    )
}

export default AtmosDrums;
