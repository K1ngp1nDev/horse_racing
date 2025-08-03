const COLORS = [
    '#ff595e','#ffca3a','#8ac926','#1982c4','#6a4c93',
    '#e36414','#d90368','#6a994e','#3a86ff','#8338ec',
    '#ff006e','#ffbe0b','#fb5607','#06d6a0','#118ab2',
    '#ef476f','#073b4c','#ffd166','#1d3557','#a8dadc'
]

export function generateHorses (count) {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Horse #${i + 1}`,
        color: COLORS[i],
        condition: Math.floor(Math.random() * 100) + 1
    }))
}
