import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle } from "react-konva";

const Home = ({helloUser}) => {

    const [stageWidth, setStageWidth] = useState(window.innerWidth);
    const [stageHeight, setStageHeight] = useState(window.innerHeight);

    const updateWidthAndHeight = () => {

        setStageWidth(window.innerWidth);
        setStageHeight(window.innerHeight);
    }

    const homePlanet = useRef();

    const widthPercentage = (width) => {   
        return Math.floor(stageWidth / (100 / width))
    }

    const heightPercentage = (height) => {   
        return Math.floor(stageHeight / (100 / height))
    }

    useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight)

        return () => {
            window.removeEventListener('resize', updateWidthAndHeight);
        }
    });

    const handleRedirect = () => {
        helloUser()
    }


    return (
        <div>
            <div className="welcome-div">
                <h1 className={"greeting"}>welcome to ATMOSPHERE click the planet to enter</h1>
            </div>
                <Stage width={stageWidth} height={stageHeight}>
                    <Layer>
                        <Rect width={stageWidth} height={stageHeight} fill='black'/>
                        <Circle ref={homePlanet} x={widthPercentage(50)} y={heightPercentage(50)} radius={widthPercentage(10)} fill='blue' shadowColor="blue" shadowBlur={widthPercentage(20)} shadowOpacity={1} onClick={handleRedirect} onTap={handleRedirect}/>
                    </Layer>
                </Stage>
            
        </div>
    )
}
export default Home;
