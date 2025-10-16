import React from 'react';

const TextSection = ({ index, heading, paraA, paraB }) => {
    return (
        <section
            className="section"
            data-index={index}
            aria-label={`Text section ${index}`}
        >
            <div className="center-box">
                {heading && <h2>{heading}</h2>}
                {index === 1 ? (
                    // For section 1, display both paraA and paraB as headings
                    <>
                        <h2 className="anim-para para-a" dangerouslySetInnerHTML={{ __html: paraA }}></h2>
                        <h2 className="anim-para para-b" dangerouslySetInnerHTML={{ __html: paraB }}></h2>
                    </>
                ) : (
                    // For other sections, display normally
                    <>
                        <p className="anim-para para-a">{paraA}</p>
                        <p className="anim-para para-b">{paraB}</p>
                    </>
                )}
            </div>
            <div className="divider" aria-hidden="true"></div>
        </section>
    );
};

export default TextSection;
