import React, { useEffect, useState, useRef, useCallback } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Text } from "react-konva";

const AtmosDrumsDisplay = ({audioCTX, getContext, engageDisengage, analyser, handleChannelGainChange, handleWetDryGainChange, handleDistortionMixControl, handleDistortionOversampleControl, handleConvolverMixControl, handleConvolverSelector}) => {

    const [engaged, setEngaged] = useState();

    const [stageWidth, setStageWidth] = useState(window.innerWidth);
    const [stageHeight, setStageHeight] = useState(window.innerHeight);

    const [engageHelper, setEngageHelper] = useState(false);
    const [volumeHelper, setVolumeHelper] = useState(false);
    const [wetDryHelper, setWetDryHelper] = useState(false);
    const [reverbMixHelper, setReverbMixHelper] = useState(false);
    const [reverbSelectorHelper, setReverbSelectorHelper] = useState(false);
    const [distortionMixHelper, setDistortionMixHelper] = useState(false);
    const [distortionOversampleHelper, setDistortionOversampleHelper] = useState(false);

    const stageRef = useRef();

    const volumePlanet = useRef();
    const [volumeAmount, setVolumeAmount] = useState(-100);
    const [volume, setVolume] = useState();

    const wetDryPlanet = useRef();
    const [wetDryAmount, setWetDryAmount] = useState(-101);
    const [wetDry, setWetDry] = useState();

    const reverbMixPlanet = useRef();
    const [reverbMixAmount, setReverbMixAmount] = useState(-101);
    const [reverbMix, setReverbMix] = useState();

    const reverbSelectorPlanet = useRef();
    const [reverbSelectorAmount, setReverbSelectorAmount] = useState(0);
    const [reverbSelector, setReverbSelector] = useState();


    const distortionMixPlanet = useRef();
    const [distortionMixAmount, setDistortionMixAmount] = useState(-101);
    const [distortionMix, setDistortionMix] = useState();

    const distortionOversamplePlanet = useRef();
    const [distortionOversampleAmount, setDistortionOversampleAmount] = useState(0);
    const [distortionOversample, setDistortionOversample] = useState();

    const updateWidthAndHeight = () => {

        setStageWidth(window.innerWidth);
        setStageHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight)

        return () => {
            window.removeEventListener('resize', updateWidthAndHeight);
        }
    });

    useEffect(() => {

        if(!engaged){
            return;
        }

        const DATA = new Uint8Array(analyser.current.frequencyBinCount);
        const LENGTH = DATA.length;

        let animation = new Konva.Animation(frame => {

            analyser.current.getByteFrequencyData(DATA);

            for(let i = 0; i < LENGTH; i++){
                
                let rat = DATA[i] / 100;

                const myStar = stageRef.current.find(`#star-${i}`)[0];

                myStar.attrs.radius = rat;
            }

        }, volumePlanet.current.getLayer());
      
        animation.start();

        return () => {
            animation.stop();
        };

    });

    const handleGainUpdate = useCallback(() => {
        handleChannelGainChange(volume)

    }, [volume, handleChannelGainChange]);

    useEffect(() => {
        handleGainUpdate()
    }, [handleGainUpdate])

    const handleWetDryUpdate = useCallback(() => {

        handleWetDryGainChange(wetDry)

    }, [wetDry, handleWetDryGainChange]);

    useEffect(() => {
        handleWetDryUpdate()
    }, [handleWetDryUpdate])

    const handleReverbMixUpdate = useCallback(() => {

        handleConvolverMixControl(reverbMix);

    }, [reverbMix, handleConvolverMixControl]);

    useEffect(() => {

        handleReverbMixUpdate()

    }, [handleReverbMixUpdate])

    const handleDistortionMixUpdate = useCallback(() => {

        handleDistortionMixControl(distortionMix)

    }, [distortionMix, handleDistortionMixControl]);

    useEffect(() => {
        handleDistortionMixUpdate();
    }, [handleDistortionMixUpdate])

    const handleDistortionOversampleUpdate = useCallback(() => {
        handleDistortionOversampleControl(distortionOversample)

    }, [distortionOversample, handleDistortionOversampleControl]);

    useEffect(() => {

        handleDistortionOversampleUpdate()

    }, [handleDistortionOversampleUpdate]);

    const handleReverbSelectorUpdate = useCallback(() => {

        handleConvolverSelector(reverbSelector)
    }, [reverbSelector, handleConvolverSelector])

    useEffect(() => {
        handleReverbSelectorUpdate()
    }, [handleReverbSelectorUpdate])

    const widthPercentage = (width) => {   
        return Math.floor(stageWidth / (100 / width))
    }

    const heightPercentage = (height) => {   
        return Math.floor(stageHeight / (100 / height))
    }

    const handleContext = () => {

        if(audioCTX){
            return;
        }

        getContext();
    }

    const handleEngage = () => {
        setEngaged(!engaged)
        engageDisengage()
    };

    const handleVolumeHelper = () => {
        setVolumeHelper(!volumeHelper);
    };

    const handleVolumeChange = () => {

        if(!engaged){
            return;
        }

        setVolume(((Math.floor(volumeAmount/10)) + 10)/10);
    }

    const getVolumeDragMove = (e) => {

        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setVolumeAmount(difference)

    };

    const handleWetDryHelper = () => {
        setWetDryHelper(!wetDryHelper);
    };

    const handleWetDryChange = () => {

        if(!engaged){
            return;
        }

        setWetDry(((Math.floor(wetDryAmount/10)) + 10)/10)
        
    };

    const getWetDryDragMove = (e) => {
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setWetDryAmount(difference);
    };

    const handleReverbMixHelper = () => {
        setReverbMixHelper(!reverbMixHelper)
    };

    const handleReverbMixChange = () => {

        if(!engaged){
            return;
        }

        setReverbMix(((Math.floor(reverbMixAmount/10)) + 10)/10);
    }

    const getReverbMixDragMove = (e) => {

        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setReverbMixAmount(difference)
    };

    const handleReverbSelectorHelper = () => {
        setReverbSelectorHelper(!reverbSelectorHelper)
    };

    const handleReverbSelectorChange = () => {

        if(!engaged){
            return;
        }

        if(reverbSelectorAmount <= -50){
            setReverbSelector('bath vader')
        } else if (reverbSelectorAmount >= -49 && reverbSelectorAmount <= -25){
            setReverbSelector('cool hand luke')
        } else if (reverbSelectorAmount >= -24 && reverbSelectorAmount <= 0){
            setReverbSelector('elegant weapon')
        } else if (reverbSelectorAmount >= 1 && reverbSelectorAmount <= 24){
            setReverbSelector('et-tu dee-2')
        } else if (reverbSelectorAmount >= 24 && reverbSelectorAmount <= 49){
            setReverbSelector('having a blast')
        } else if(reverbSelectorAmount >= 50){
            setReverbSelector('hello there')
        }

    };

    const getReverbSelectorDragMove = (e) => {

        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setReverbSelectorAmount(difference);
    };

    const handleDistortionMixHelper = () => {
        setDistortionMixHelper(!distortionMixHelper)
    };

    const handleDistortionMixChange = () => {

        if(!engaged){
            return;
        }

        setDistortionMix(((Math.floor(distortionMixAmount/10)) + 10)/10)
    }

    const getDistortionMixDragMove = (e) => {
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setDistortionMixAmount(difference);
    };

    const handleDistortionOversampleHelper = () => {
        setDistortionOversampleHelper(!distortionOversampleHelper);
    };

    const handleDistortionOversampleChange = () => {

        if(!engaged){
            return;
        }
        
        let amount = distortionOversampleAmount;

        if(amount <= -50){
            setDistortionOversample('none')
        } else if (amount >= -49 && amount <= 49){
           setDistortionOversample('2x')
        } else if(amount >= 50){
            setDistortionOversample('4x')
        }
    }

    const getDistortionOversampleDragMove = (e) => {
        const difference = (e.currentTarget.attrs.x - e.evt.clientX)

        setDistortionOversampleAmount(difference);
    };

    const handleEngageHelper = () => {
        
        if(!audioCTX) {
            return;
        } else {
            setEngageHelper(!engageHelper)
        }
    }

    return (
        <div>
            <Stage ref={stageRef} width={stageWidth} height={stageHeight}>
                <Layer>
                    <Rect width={stageWidth} height={stageHeight} fill='black'/>
                    {[...Array(64)].map((_, i) => (
                    <Circle key={i} id={`star-${i}`}  x={Math.random() * window.innerWidth} y={Math.random() * window.innerHeight} width={widthPercentage(2)} height={heightPercentage(2)} fill="white" opacity={engaged ? 1 : 0} shadowColor="black" shadowBlur={10}/>))}
                    <Circle x={widthPercentage(15)} y={heightPercentage(18)} radius={widthPercentage(3)} fill='white' shadowColor="white" shadowBlur={widthPercentage(30)} shadowOpacity={1} onClick={handleContext} opacity={audioCTX ? 0 : 1}/>
                    <Text text="Click to Access" x={widthPercentage(20)} y={heightPercentage(14)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={audioCTX ? 0 : 1}/>
                    <Text text="User Audio" x={widthPercentage(20)} y={heightPercentage(17)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={audioCTX ? 0 : 1}/>
                    <Circle x={widthPercentage(20)} y={heightPercentage(15)} radius={widthPercentage(3)} fill={engaged ? 'red': 'white'} shadowColor="white" shadowBlur={widthPercentage(30)} shadowOpacity={1} onClick={handleEngage} onMouseEnter={handleEngageHelper} onMouseLeave={handleEngageHelper} opacity={audioCTX ? 1 : 0}/>
                    <Text text={engaged ? 'off' : 'on'} x={widthPercentage(19.25)} y={heightPercentage(13)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill={engaged ? 'white' : 'black'} opacity={audioCTX ? 1 : 0} onClick={handleEngage}/>
                    <Text text={engaged ? 'click to disengage' : 'click to engage'} x={widthPercentage(15)} y={heightPercentage(5)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill={'white'} opacity={engageHelper ? 1 : 0}/>
                    <Circle ref={volumePlanet} x={widthPercentage(50)} y={heightPercentage(50)} radius={widthPercentage(10)} fill='blue' shadowColor="blue" shadowBlur={widthPercentage(20)} draggable onDragEnd={handleVolumeChange} onDragMove={getVolumeDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}} onMouseEnter={handleVolumeHelper} onMouseLeave={handleVolumeHelper} shadowOpacity={1}/>
                        <Circle x={widthPercentage(38)} y={heightPercentage(60)} radius={widthPercentage(0.2)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= -90 ? 1 : 0}/>
                        <Circle x={widthPercentage(38)} y={heightPercentage(55)} radius={widthPercentage(0.4)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= -70 ? 1 : 0}/>
                        <Circle x={widthPercentage(38)} y={heightPercentage(50)} radius={widthPercentage(0.6)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= -50 ? 1 : 0}/>
                        <Circle x={widthPercentage(38)} y={heightPercentage(45)} radius={widthPercentage(0.8)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= -30 ? 1 : 0}/>
                        <Circle x={widthPercentage(38)} y={heightPercentage(40)} radius={widthPercentage(1)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= -10 ? 1 : 0}/>
                        <Circle x={widthPercentage(62)} y={heightPercentage(40)} radius={widthPercentage(1.2)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= 10 ? 1 : 0}/>
                        <Circle x={widthPercentage(62)} y={heightPercentage(45)} radius={widthPercentage(1.4)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= 30 ? 1 : 0}/>
                        <Circle x={widthPercentage(62)} y={heightPercentage(50)} radius={widthPercentage(1.6)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= 50 ? 1 : 0}/>
                        <Circle x={widthPercentage(62)} y={heightPercentage(55)} radius={widthPercentage(1.8)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= 70 ? 1 : 0}/>
                        <Circle x={widthPercentage(62)} y={heightPercentage(60)} radius={widthPercentage(2)} fill='pink' shadowColor="blue" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={volumeAmount >= 90 ? 1 : 0}/>
                        <Circle x={widthPercentage(64)} y={heightPercentage(75)} radius={widthPercentage(0.3)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={wetDryAmount >= -100 ? 1 : 0}/>
                        <Circle x={widthPercentage(66)} y={heightPercentage(68)} radius={widthPercentage(0.6)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={wetDryAmount >= -49 ? 1 : 0}/>
                        <Circle x={widthPercentage(70)} y={heightPercentage(65.5)} radius={widthPercentage(0.9)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={wetDryAmount >= 0 ? 1 : 0}/>
                        <Circle x={widthPercentage(75)} y={heightPercentage(70)} radius={widthPercentage(1.5)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={wetDryAmount >= 50 ? 1 : 0}/>
                        <Circle x={widthPercentage(78)} y={heightPercentage(78)} radius={widthPercentage(2)} fill='pink' shadowColor="red" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={wetDryAmount >= 100 ? 1 : 0}/>
                    <Circle ref={wetDryPlanet} x={widthPercentage(70)} y={heightPercentage(75)} radius={widthPercentage(5)} fill='#be03fc' shadowColor="#be03fc" shadowBlur={widthPercentage(20)} draggable onDragEnd={handleWetDryChange} onDragMove={getWetDryDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}} shadowOpacity={0.8} onMouseEnter={handleWetDryHelper} onMouseLeave={handleWetDryHelper}/>
                    <Circle ref={reverbMixPlanet} x={widthPercentage(20)} y={heightPercentage(75)} radius={widthPercentage(5)} fill='green' shadowColor="green" shadowBlur={widthPercentage(30)} draggable onDragEnd={handleReverbMixChange} onDragMove={getReverbMixDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}} onMouseEnter={handleReverbMixHelper} onMouseLeave={handleReverbMixHelper} shadowOpacity={1}/>
                        <Circle x={widthPercentage(12)} y={heightPercentage(75)} radius={widthPercentage(0.3)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={reverbMixAmount >= -100 ? 1 : 0}/>
                        <Circle x={widthPercentage(14)} y={heightPercentage(65)} radius={widthPercentage(0.6)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={reverbMixAmount >= -49 ? 1 : 0}/>
                        <Circle x={widthPercentage(20)} y={heightPercentage(60)} radius={widthPercentage(0.9)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={reverbMixAmount >= 0 ? 1 : 0}/>
                        <Circle x={widthPercentage(26)} y={heightPercentage(65)} radius={widthPercentage(1.5)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={reverbMixAmount >= 50 ? 1 : 0}/>
                        <Circle x={widthPercentage(29)} y={heightPercentage(75)} radius={widthPercentage(2)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={reverbMixAmount >= 100 ? 1 : 0}/>
                    <Circle ref={reverbSelectorPlanet} x={widthPercentage(12)} y={heightPercentage(42)} radius={widthPercentage(5)} fill='#f5544c' shadowColor="#f5544c" shadowBlur={widthPercentage(20)} shadowOpacity={0.8} draggable onDragEnd={handleReverbSelectorChange} onDragMove={getReverbSelectorDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}}  onMouseEnter={handleReverbSelectorHelper} onMouseLeave={handleReverbSelectorHelper}/>
                        <Circle x={widthPercentage(19)} y={heightPercentage(30)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount <= -50 ? 1 : 0}/>
                        <Text text="BATH VADER" x={widthPercentage(22)} y={heightPercentage(28)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount <= -50) && reverbSelectorHelper ? 1 : 0}/>
                        <Circle x={widthPercentage(19.5)} y={heightPercentage(31)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount >= -49 && reverbSelectorAmount <= -25 ? 1 : 0}/>
                        <Text text="COOL HAND LUKE" x={widthPercentage(23)} y={heightPercentage(29)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount >= -49 && reverbSelectorAmount <= -25) && reverbSelectorHelper ? 1 : 0}/>
                        <Circle x={widthPercentage(20)} y={heightPercentage(32)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount >= -24 && reverbSelectorAmount <= 0 ? 1 : 0}/>
                        <Text text="ELEGANT WEAPON" x={widthPercentage(23)} y={heightPercentage(30)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount >= -24 && reverbSelectorAmount <= 0) && reverbSelectorHelper ? 1 : 0}/>
                        <Circle x={widthPercentage(20.5)} y={heightPercentage(33)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount >= 1 && reverbSelectorAmount <= 25 ? 1 : 0}/>
                        <Text text="ET-TU D-2?" x={widthPercentage(24)} y={heightPercentage(31)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount >= 1 && reverbSelectorAmount <= 25) && reverbSelectorHelper ? 1 : 0}/>
                        <Circle x={widthPercentage(21)} y={heightPercentage(34)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount >= 26 && reverbSelectorAmount <= 49 ? 1 : 0}/>
                        <Text text="HAVING A BLAST" x={widthPercentage(24)} y={heightPercentage(32)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount >= 26 && reverbSelectorAmount <= 49) && reverbSelectorHelper ? 1 : 0}/>
                        <Circle x={widthPercentage(21.5)} y={heightPercentage(35)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={reverbSelectorAmount >= 50 ? 1 : 0}/>
                        <Text text="HELLO THERE" x={widthPercentage(25)} y={heightPercentage(33)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={(reverbSelectorAmount >= 50) && reverbSelectorHelper ? 1 : 0}/>
                    <Circle ref={distortionMixPlanet} x={widthPercentage(80)} y={heightPercentage(45)} radius={widthPercentage(5)} fill='#ac93c9' shadowColor="#ac93c9" shadowBlur={widthPercentage(20)} shadowOpacity={0.8} draggable onDragEnd={handleDistortionMixChange} onDragMove={getDistortionMixDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}} onMouseEnter={handleDistortionMixHelper} onMouseLeave={handleDistortionMixHelper}/>
                        <Circle x={widthPercentage(73)} y={heightPercentage(45)} radius={widthPercentage(0.3)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={distortionMixAmount >= -100 ? 1 : 0}/>
                        <Circle x={widthPercentage(75)} y={heightPercentage(50)} radius={widthPercentage(0.6)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={distortionMixAmount >= -49 ? 1 : 0}/>
                        <Circle x={widthPercentage(80)} y={heightPercentage(52.5)} radius={widthPercentage(0.9)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={distortionMixAmount >= 0 ? 1 : 0}/>
                        <Circle x={widthPercentage(85)} y={heightPercentage(50)} radius={widthPercentage(1.5)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={distortionMixAmount >= 50 ? 1 : 0}/>
                        <Circle x={widthPercentage(88)} y={heightPercentage(44)} radius={widthPercentage(2)} fill='pink' shadowColor="green" shadowBlur={widthPercentage(10)} shadowOpacity={1} opacity={distortionMixAmount >= 100 ? 1 : 0}/>
                    <Circle ref={distortionOversamplePlanet} x={widthPercentage(85)} y={heightPercentage(20)} radius={widthPercentage(4)} fill='red' shadowColor="red" shadowBlur={widthPercentage(30)} shadowOpacity={1} draggable onDragEnd={handleDistortionOversampleChange} onDragMove={getDistortionOversampleDragMove} dragBoundFunc={function(pos){return{x: this.absolutePosition().x, y: this.absolutePosition().y}}} onMouseEnter={handleDistortionOversampleHelper} onMouseLeave={handleDistortionOversampleHelper}/>
                        <Circle x={widthPercentage(92)} y={heightPercentage(17.5)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={distortionOversampleAmount <= -50 ? 1 : 0}/>
                        <Circle x={widthPercentage(92)} y={heightPercentage(20)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={distortionOversampleAmount >= -49 && distortionOversampleAmount <= 49 ? 1 : 0}/>
                        <Circle x={widthPercentage(92)} y={heightPercentage(22.5)} radius={widthPercentage(2)} fill='pink' shadowColor="yellow" shadowBlur={widthPercentage(30)} shadowOpacity={1} opacity={distortionOversampleAmount >= 50 ? 1 : 0}/>
                    <Text text="ATMOSPHERE" x={widthPercentage(32)} y={heightPercentage(15)} fontSize={widthPercentage(8)} fontFamily={'VT323'} fill='white'/>
                    <Text text="DRY/WET" x={widthPercentage(71)} y={heightPercentage(85)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={wetDryHelper ? 1 : 0}/>
                    <Text text="VOLUME" x={widthPercentage(47)} y={heightPercentage(69)} fontSize={widthPercentage(3)} fontFamily={'VT323'} fill='white' opacity={volumeHelper ? 1 : 0}/>
                    <Text text="CONVOLVER MIX" x={widthPercentage(16)} y={heightPercentage(85)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={reverbMixHelper ? 1 : 0}/>
                    <Text text="SELECT CONVOLVER" x={widthPercentage(8)} y={heightPercentage(53)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={reverbSelectorHelper ? 1 : 0}/>
                    <Text text="DISTORTION MIX" x={widthPercentage(70)} y={heightPercentage(32)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={distortionMixHelper ? 1 : 0}/>
                    <Text text="DISTORTION OVERSAMPLE" x={widthPercentage(75)} y={heightPercentage(8)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={distortionOversampleHelper ? 1 : 0}/>
                    <Text text="none" x={widthPercentage(76)} y={heightPercentage(18)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={distortionOversampleHelper && (distortionOversampleAmount <= -50) ? 1 : 0}/>
                    <Text text="2x" x={widthPercentage(76)} y={heightPercentage(18)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={distortionOversampleHelper && (distortionOversampleAmount >= -49 && distortionOversampleAmount <= 49) ? 1 : 0}/>
                    <Text text="4x" x={widthPercentage(76)} y={heightPercentage(18)} fontSize={widthPercentage(2)} fontFamily={'VT323'} fill='white' opacity={distortionOversampleHelper && (distortionOversampleAmount >= 50) ? 1 : 0}/>

                </Layer>
            </Stage>   
        </div>
    )
}

export default AtmosDrumsDisplay;
