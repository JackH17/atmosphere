import React, { useState, useRef } from 'react';
import { getUserMediaStream } from '../utils/getUserInput';
import AtmosDrumsDisplay from '../Components/AtmosDrumsDisplay';


const AtmosDrums = () => {

    const [input, setInput] = useState();
    const [output, setOutput] = useState();

    const channelGain = useRef();
    const analyser = useRef();

    const setUserInput = (streamNode, gainNode) => {

        setInput(streamNode);

        channelGain.current = gainNode;
    };

    const setAudioAnalyser = (analyserNode) => {

        analyserNode.fftSize = 128;
        analyser.current = analyserNode;
    };

    const createAudioNodes = (userMediaStreamNode, context) => {

        setUserInput(userMediaStreamNode, context.createGain());

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
        input.connect(channelGain.current).connect(analyser.current).connect(output);
    }

    return (
        <div>
            <AtmosDrumsDisplay getContext={getContext} engageDisengage={engageDisengage} analyser={analyser}/>  
        </div>
    )
}

export default AtmosDrums;
