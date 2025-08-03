const DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

export function generateSchedule (horses) {
    return DISTANCES.map((distance, i) => {
        const shuffled = [...horses].sort(() => 0.5 - Math.random())
        return {
            name: `Round ${i + 1}`,
            distance,
            horses: shuffled.slice(0, 10)
        }
    })
}
