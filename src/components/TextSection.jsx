import React from 'react';

const TextSection = ({ index, heading, paraA, paraB }) => {
    return (
        <section
            className="section"
            data-index={index}
            aria-label={`Text section ${index}`}
        >
            <div className="center-box">
                <h2>{heading}</h2>
                <p className="anim-para para-a">{paraA}</p>
                <p className="anim-para para-b">{paraB}</p>
            </div>
            <div className="divider" aria-hidden="true"></div>
        </section>
    );
};

export default TextSection;
