import domready from "domready"
import RTree from "rtree"
// noinspection ES6UnusedImports
import STYLE from "./style.css"
import { Palette } from "./palette";


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

let ctx, canvas;

function randomRect(l, palette)
{
    const size = 25 + Math.random() * (50 - l * 0.2);

    const flip = Math.random() < 0.5;
    const r0 = flip ? 1 : Math.sqrt(2);
    const r1 = flip ? Math.sqrt(2) : 1;

    return {
        x: 0,
        y: 0,
        w: size * r0,
        h: size * r1,
        // w: 30 + Math.random() * (60 - l * 0.35),
        // h: 30 + Math.random() * (60 - l * 0.35),

        color: palette.randomColor()
    }
}


const count = 200;

class AABB {

    minX = Infinity;
    minY = Infinity;
    maxX = -Infinity;
    maxY = -Infinity;

    add(x, y)
    {
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
    }

    get width()
    {
        return (this.maxX - this.minX) | 0;
    }

    get height()
    {
        return (this.maxY - this.minY) | 0;
    }
}


function paint()
{

    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    config.width = screenWidth;
    config.height = screenHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    const palette = new Palette()

    const rtree = new RTree();

    const rects = [randomRect(0, palette)];

    rtree.insert(rects[0], rects[0])
    while (rects.length < count)
    {
        const r = randomRect(rects.length, palette);

        const orientation = Math.floor(Math.random() * 4)
        const base = rects[Math.floor(Math.random() * rects.length)]

        switch (orientation)
        {
            case 0:
                r.x = base.x + Math.random() * (base.w - r.w)
                r.y = base.y - r.h;
                break;
            case 1:
                r.x = base.x + base.w;
                r.y = base.y + Math.random() * (base.h - r.h)
                break;
            case 2:
                r.x = base.x + Math.random() * (base.w - r.w)
                r.y = base.y + base.h;
                break;
            default:
                r.x = base.x - r.w;
                r.y = base.y + Math.random() * (base.h - r.h)
                break;
        }

        const existing = rtree.search(r);
        if (!existing.length)
        {
            rtree.insert(r, r)
            rects.push(r);
        }
    }

    const aabb = new AABB();
    for (let i = 0; i < rects.length; i++)
    {
        const rect = rects[i];
        aabb.add(rect.x, rect.y)
        aabb.add(rect.x + rect.w, rect.y + rect.h)
    }

    const gap = Math.max(aabb.width * 0.08, aabb.height * 0.08)

    const width = screenWidth - gap*2;
    const height = screenHeight - gap*2;

    const offX = width/2 - (aabb.minX + aabb.maxX)/2;
    const offY = height/2 - (aabb.minY + aabb.maxY)/2;

    for (let i = 0; i < rects.length; i++)
    {
        const rect = rects[i];
        ctx.fillStyle = rect.color.toRGBHex();
        ctx.fillRect(rect.x + offX + 2, rect.y + offY + 2, rect.w - 4, rect.h - 4);
    }
}


domready(
    () => {
        paint();
    }
);

document.addEventListener("click", () => paint(), true)
