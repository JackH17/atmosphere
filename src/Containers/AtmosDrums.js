import React, { useState, useRef, useEffect } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import AtmosDrumsDisplay from '../Components/AtmosDrumsDisplay';


const AtmosDrums = () => {

    const [engaged, setEngaged] = useState(false);

    const [input, setInput] = useState();
    const [output, setOutput] = useState();

    const analyser = useRef();

    const [gain, setGain] = useState();
    const channelGain = useRef();

    const dryGain = useRef();
    const wetGain = useRef();

    const distortionDry = useRef();
    const distortionWet = useRef();
    const distortionOutput = useRef();

    const convolverDry = useRef();
    const convolverWet = useRef();
    const convolverOutput = useRef();

    const outputGain = useRef();

    useEffect(() => {

        if(channelGain.current !== undefined){
            
            channelGain.current.gain.value = gain;

        }


    }, [gain])

    const setUserInput = (streamNode, gainNode) => {

        setInput(streamNode);

        channelGain.current = gainNode;
    };

    const setWetDryOutput = (dryGainNode, wetGainNode, outputGainNode) => {

        dryGain.current = dryGainNode;
        wetGain.current = wetGainNode;
        outputGain.current = outputGainNode;

    };

    const setComponentDistortion = (distortionDryGainNode, distortionWetGainNode, distortionOutputGainNode) => {

        distortionDry.current = distortionDryGainNode;
        distortionWet.current = distortionWetGainNode;
        distortionOutput.current = distortionOutputGainNode;
    };

    const setComponentConvolver = (convolverGainNodeDry, convolverGainNodeWet, convolverOutputGainNode) => {

        convolverDry.current = convolverGainNodeDry;
        convolverWet.current = convolverGainNodeWet;
        convolverOutput.current = convolverOutputGainNode;
    }

    const setAudioAnalyser = (analyserNode) => {

        analyserNode.fftSize = 128;
        analyser.current = analyserNode;
    };

    const createAudioNodes = (userMediaStreamNode, context) => {

        setUserInput(userMediaStreamNode, context.createGain());

        setWetDryOutput(context.createGain(), context.createGain(), context.createGain());

        setComponentDistortion(context.createGain(), context.createGain(), context.createGain());

        setComponentConvolver(context.createGain(), context.createGain(), context.createGain())

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
            distortionWet.current.connect(distortionOutput.current)

            distortionOutput.current.connect(convolverDry.current)
            distortionOutput.current.connect(convolverWet.current)

            convolverDry.current.connect(convolverOutput.current)
            convolverWet.current.connect(convolverOutput.current)

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
            distortionWet.current.disconnect(distortionOutput.current)

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
    }

    return (
        <div>
            <AtmosDrumsDisplay getContext={getContext} engageDisengage={engageDisengage} analyser={analyser} handleChannelGainChange={handleChannelGainChange}/>  
        </div>
    )
}

export default AtmosDrums;
