import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionCounter from './SectionCounter';
import TextSection from './TextSection';
import FrameScrollComponent from './FrameScrollComponent';
import './MultiSectionScroll.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const MultiSectionScroll = () => {
    const sectionsRef = useRef(null);
    const sectionCounterRef = useRef(null);
    const currentSectionRef = useRef(0);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    const sectionsData = [
        {
            id: 1,
            heading: "",
            paraA: "Vast and intricate, <br>product never stop evolving ",
            paraB: "Enterprise customers have an .<br>endless spectrum of realities"
        },
        {
            id: 2,
            heading: "Section 2 heading",
            paraA: "First paragraph for section 2 — appears then fades.",
            paraB: "Second paragraph for section 2 — appears afterwards and stays."
        },
        {
            id: 3,
            heading: "Section 3 heading",
            paraA: "First paragraph for section 3 — central and concise.",
            paraB: "Second paragraph for section 3 — appears in the same spot."
        },
        {
            id: 4,
            heading: "Section 4 heading",
            paraA: "First paragraph for section 4 — final section's intro.",
            paraB: "Second paragraph for section 4 — final text that stays."
        }
    ];

    // Scroll throttling function to limit section skipping
    const handleScroll = useCallback((event) => {
        if (isScrollingRef.current) return;

        const sections = Array.from(document.querySelectorAll('.section'));
        const totalSections = sections.length;

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Calculate which section should be visible based on scroll position
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const targetSection = Math.floor(scrollY / windowHeight);

        // Only apply throttling if we're within the text sections area
        // After section 4, allow normal scrolling
        if (targetSection >= totalSections) {
            // We're past the text sections, allow normal scrolling
            currentSectionRef.current = totalSections - 1; // Keep track of last section
            return;
        }

        // Limit the target section to prevent skipping more than one section
        const currentSection = currentSectionRef.current;
        const maxJump = 1; // Maximum sections to skip

        let newSection = targetSection;
        if (Math.abs(targetSection - currentSection) > maxJump) {
            newSection = currentSection + (targetSection > currentSection ? maxJump : -maxJump);
        }

        // Clamp to valid range
        newSection = Math.max(0, Math.min(totalSections - 1, newSection));

        // If we need to adjust the scroll position
        if (newSection !== targetSection) {
            isScrollingRef.current = true;
            window.scrollTo({
                top: newSection * windowHeight,
                behavior: 'smooth'
            });

            // Reset scrolling flag after animation
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 500);
        }

        currentSectionRef.current = newSection;
    }, []);

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll('.section'));
        const sectionCounter = sectionCounterRef.current;
        const total = sections.length;

        // Ensure all paragraphs are initially hidden
        sections.forEach((sec) => {
            const paraA = sec.querySelector('.para-a');
            const paraB = sec.querySelector('.para-b');
            gsap.set([paraA, paraB], { autoAlpha: 0, y: 6 });
        });

        // Create timelines and triggers for each section
        sections.forEach((sec, idx) => {
            const paraA = sec.querySelector('.para-a');
            const paraB = sec.querySelector('.para-b');

            // Build a timeline: in -> hold 2s -> out -> show b
            const tl = gsap.timeline({ paused: true });
            tl.to(paraA, { duration: 0.6, autoAlpha: 1, y: 0, ease: "power2.out" })   // fade in a
                .to({}, { duration: 2.0 })                                           // hold 2s
                .to(paraA, { duration: 0.5, autoAlpha: 0, y: -6, ease: "power2.in" })    // fade out a
                .to(paraB, { duration: 0.6, autoAlpha: 1, y: 0, ease: "power2.out" });   // fade in b and keep

            // Restart timeline when section becomes active (entering viewport center)
            ScrollTrigger.create({
                trigger: sec,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    gsap.set([paraA, paraB], { autoAlpha: 0, y: 6 });
                    tl.restart();
                    if (sectionCounter) {
                        sectionCounter.textContent = (idx + 1) + " / " + total;
                    }
                },
                onEnterBack: () => {
                    gsap.set([paraA, paraB], { autoAlpha: 0, y: 6 });
                    tl.restart();
                    if (sectionCounter) {
                        sectionCounter.textContent = (idx + 1) + " / " + total;
                    }
                },
                onLeave: () => {
                    // hide when leaving forward
                    gsap.set([paraA, paraB], { autoAlpha: 0, y: 6 });
                },
                onLeaveBack: () => {
                    // hide when leaving backward
                    gsap.set([paraA, paraB], { autoAlpha: 0, y: 6 });
                }
            });

            // Small ScrollTrigger purely to update counter reliably (optional)
            ScrollTrigger.create({
                trigger: sec,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    if (sectionCounter) {
                        sectionCounter.textContent = (idx + 1) + " / " + total;
                    }
                },
                onEnterBack: () => {
                    if (sectionCounter) {
                        sectionCounter.textContent = (idx + 1) + " / " + total;
                    }
                }
            });
        });

        ScrollTrigger.refresh();

        // Add scroll event listener for throttling
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [handleScroll]);

    return (
        <div className="multi-section-scroll">

            {/* Fixed counter */}
            <SectionCounter ref={sectionCounterRef} />

            {/* Four text sections */}
            <main className="sections" ref={sectionsRef}>
                {sectionsData.map((section) => (
                    <TextSection
                        key={section.id}
                        index={section.id}
                        heading={section.heading}
                        paraA={section.paraA}
                        paraB={section.paraB}
                    />
                ))}
            </main>

            {/* Spacer */}
            <div className="spacer"></div>

            {/* Pinned story area */}
            <section className="story-pin" aria-label="Story area with pinned image">
                <FrameScrollComponent
                    totalFrames={428}
                    framePath="/frames-desktop-webp/frame_"
                    frameExtension=".webp"
                    enableMarkers={false}
                    enableDebug={false}
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
            </section>

            {/* After section */}
            <section className="after wrap">
                <h2>Normal page content</h2>
                <p>This is content after the whole pinned sequence. Scroll up to replay earlier animations.</p>
            </section>

            {/* Footer */}
            <footer>Demo — GSAP + ScrollTrigger</footer>
        </div>
    );
};

export default MultiSectionScroll;
