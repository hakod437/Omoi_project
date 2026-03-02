import { calculateGlobalScore, getTierFromScore } from "../lib/scoring";
import { Tier } from "../types/anime";

function testScoring() {
    console.log("--- Testing AnimeVault Scoring Logic ---");

    const cases = [
        {
            name: "All S Tier",
            anim: "S" as Tier,
            scen: "S" as Tier,
            music: "S" as Tier,
            expectedScore: 10.0,
            expectedTier: "S"
        },
        {
            name: "Mixed Tiers (A, B, C)",
            anim: "A" as Tier, // 8 * 0.5 = 4.0
            scen: "B" as Tier, // 6 * 0.3 = 1.8
            music: "C" as Tier, // 4 * 0.2 = 0.8
            expectedScore: 6.6, // 4.0 + 1.8 + 0.8 = 6.6
            expectedTier: "B" // 6.6 < 7.0
        },
        {
            name: "D Tier Dominance",
            anim: "D" as Tier, // 2 * 0.5 = 1.0
            scen: "D" as Tier, // 2 * 0.3 = 0.6
            music: "S" as Tier, // 10 * 0.2 = 2.0
            expectedScore: 3.6, // 3.6
            expectedTier: "C" // >= 3.0
        }
    ];

    let passed = 0;
    cases.forEach(c => {
        const score = calculateGlobalScore(c.anim, c.scen, c.music);
        const tier = getTierFromScore(score);

        const scoreMatch = Math.abs(score - c.expectedScore) < 0.01;
        const tierMatch = tier === c.expectedTier;

        if (scoreMatch && tierMatch) {
            console.log(`✅ [PASS] ${c.name}: Score ${score.toFixed(1)}, Tier ${tier}`);
            passed++;
        } else {
            console.log(`❌ [FAIL] ${c.name}: Expected ${c.expectedScore}/${c.expectedTier}, got ${score.toFixed(1)}/${tier}`);
        }
    });

    console.log(`\nResults: ${passed}/${cases.length} tests passed.`);
}

testScoring();
