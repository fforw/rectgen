const {getSplit} = require("./palette");

let a = 0, b = 0, c = 0, n = 1000000;
for (let i = 0; i < n; i++)
{
    const s = getSplit(3);
    a += s[0];
    b += s[1];
    c += s[2]
}
;console.log(a / n, b / n, c / n)
