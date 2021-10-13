import Color from "./Color";


const palettes = [
    {
        count: 2,
        split: 2,
    },
    {
        count: 2,
        split: 3
    },
    {
        count: 3,
        split: 3
    }
]

const third = 1/3;

export function getSplit(split)
{
    if (split === 2)
    {
        return Math.random() < 0.5 ? [0, 0.5] : [0.5, 0]
    }
    else if (split === 3)
    {

        const variants = [
            [0, third, 2 * third],
            [0, 2 * third,third],
            [third, 2 * third,0],
            [third,0, 2 * third],
            [2 * third,0,third],
            [2 * third,third,0],
        ]

        return variants[Math.floor(Math.random() * variants.length)]
    }

}

export function variation(magnitude)
{
    return -magnitude + Math.random() * magnitude * 2;
}


export class Palette {
    count = 0;
    split = 0;
    colors = [];


    constructor()
    {
        const {count, split} = palettes[Math.floor(Math.random() * palettes.length)];

        this.count = count;
        this.split = split;

        const hue = Math.random();

        const positions = getSplit(split);

        for (let i = 0; i < count; i++)
        {
            this.colors[i] = [ hue + positions[i], 0.75 + Math.random() * 0.15, 0.5]
        }

        console.log(this)
    }


    randomColor()
    {
        const [h,s,l] = this.colors[Math.floor(Math.random() * this.colors.length)];
        return  Color.fromHSL(h + variation(0.15),s + variation(0.1),l + variation(0.2))
    }
}
