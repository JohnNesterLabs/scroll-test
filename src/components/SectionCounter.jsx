import React, { forwardRef } from 'react';

const SectionCounter = forwardRef((props, ref) => {
    return (
        <div
            className="section-counter"
            id="section-counter"
            ref={ref}
            {...props}
        >
            1 / 4
        </div>
    );
});

SectionCounter.displayName = 'SectionCounter';

export default SectionCounter;
