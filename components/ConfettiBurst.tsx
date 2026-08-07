'use client';

import confetti from 'canvas-confetti';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export function fireConfetti() {
    const defaults = {
        colors: COLORS,
        disableForReducedMotion: true,
        zIndex: 100,
    };

    // Center burst
    confetti({
        ...defaults,
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
    });

    // Side cannons
    setTimeout(() => {
        confetti({ ...defaults, particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ ...defaults, particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } });
    }, 150);
}

export default function ConfettiBurst({ fire }: { fire: boolean }) {
    if (fire) {
        setTimeout(() => {
            fireConfetti();
        }, 0);
    }
    return null;
}
