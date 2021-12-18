const fs = require('fs');
const dots = JSON.parse(fs.readFileSync('./dots.json'));
let distanceArray = [];
const cal = function () {
    for (let i = 0; i < dots.length; i++) {
        let myDog = {
            s1: "",
            // s2: "",
            minimalDistance: 0,
            lat: "",
            long: ""
        };
        let minDis = Infinity;
        for (let m = 0; m < dots.length; m++) {
            const s1 = dots[i];
            const s2 = dots[m];
            if (i == m) {
                continue;
            }
            const la1 = s1.lat;
            const la2 = s2.lat;
            const lo1 = s1.long;
            const lo2 = s2.long;
            const La1 = (la1 * Math.PI) / 180.0;
            const La2 = (la2 * Math.PI) / 180.0;
            const La3 = La1 - La2;
            const Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0;
            let s = 2 * Math.asin(Math.sqrt(
                Math.pow(Math.sin(La3 / 2), 2) +
                Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)
            )
            );
            s = s * 6378.137; //地球半径
            s = Math.round(s * 10000) / 10000;
            if (s < minDis) {
                minDis = s;
            }
        }
        myDog.s1 = dots[i].Suburb;
        myDog.lat = dots[i].lat;
        myDog.long = dots[i].long;
        myDog.minimalDistance = minDis;
        distanceArray.push(myDog);
    }
    const myJSON = JSON.stringify(distanceArray);
    // console.log(myJSON)
    // write JSON string to a file
    fs.writeFile('dotsMinDis.json', myJSON, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
};
cal();
