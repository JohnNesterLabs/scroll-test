import React from 'react';
import FrameScrollComponent from './components/FrameScrollComponent';
import './App.css';

function App() {
    return (
        <div className="App">
            <FrameScrollComponent
                totalFrames={428}
                framePath="/frames-desktop-webp/frame_"
                frameExtension=".webp"
                enableMarkers={true}
                enableDebug={true}
                onFrameChange={(frameNumber) => {
                    console.log(`Frame changed to: ${frameNumber}`);
                }}
                onStart={() => {
                    console.log('Animation started');
                }}
                onComplete={() => {
                    console.log('Animation completed');
                }}
            />
        </div>
    );
}

export default App;
