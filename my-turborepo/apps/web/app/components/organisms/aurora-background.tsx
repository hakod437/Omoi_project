"use client";

/**
 * ORGANISM: AuroraBackground
 * 
 * Role: A global ambient component that provides a "High-End" feel to the UI.
 * Strategy: Mesh Gradient utilizing large moving blobs with heavy gaussian blur.
 * Accessibility: Marked with `aria-hidden="true"` as it's purely decorative.
 */
export default function AuroraBackground() {
    return (
        <div className="fluid-container" aria-hidden="true">
            {/* 
                These blobs are styled in index.css. 
                They move independently to simulate a fluid environment.
            */}
            <div className="blob color-1"></div>
            <div className="blob color-2"></div>
            <div className="blob color-3"></div>
        </div>
    );
}