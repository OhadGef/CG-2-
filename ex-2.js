let data = [];
let obj;
let width;
let height;
let lastAction = -1;
let zIndex=0;
let maxStart;
let maxEnd;



let option = 0; // the choosen option
let pointsNumber = 0; // Counter the points

function Point(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

let maxPoint = new Point();
let minPoint = new Point();
let centerPoint = new Point();
let mousePoint = new Point();
let points = []; //  array of points

let drawLast=-1,lastX=0,lastY=0,lastFactor=1,lastAngle=0;


window.onload = () => {
    let canvas = document.getElementById("myCanvas");
    height = canvas.height;
    width = canvas.width;
    let contextObj = canvas.getContext("2d");

    obj = contextObj;
    document.onmousemove = mousePosition;

    // canvas.addEventListener('click', (evt) => {
    //
    //     //Get the mouse click.
    //     let rect = canvas.getBoundingClientRect();
    //     const mouseClick = {
    //         x: evt.clientX - rect.left,
    //         y: evt.clientY - rect.top
    //     };
    //     clicks[index] = mouseClick;
    //     // Drew the pixels from the mouse click.
    //     // drawPixel(clicks[index].x, clicks[index].y,5);
    //     index++;
    //
    //     console.log(mouseClick);
    //
    // })
};



function readSingleFile() {
    const fileElement = document.getElementById('file-input').files;

    if (!fileElement.length) {
        alert("Please select a file");
        return;
    }
    const file = fileElement[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        data = JSON.parse(e.target.result);



        setCenter();
        fitImage();
        drawshapesArray();
        lastAction = -1;
    };
    reader.readAsText(file);
}

// document.getElementById('file-input')
//     .addEventListener('change', readSingleFile, false);


function fitImage() {
    const factorX = height / (maxPoint.x - minPoint.x);
    const factorY = width / (maxPoint.y - minPoint.y);
    const factor = Math.min(factorX, factorY);
    zoom(factor);
    const point = new Point(width / 2, height / 2);
    moveTo(point);

}

function moveTo(newPoint) {
    data.points.forEach(point => {
        point.x += newPoint.x - centerPoint.x;
        point.y += newPoint.y - centerPoint.y;
    });

    setCenter();
}



function zoom(zoom) {
    const Sx = centerPoint.x * (1 - zoom);
    const Sy = centerPoint.y * (1 - zoom);
    data.points.forEach(point => {
        point.x = point.x * zoom + Sx;
        point.y = point.y * zoom + Sy;
    })

}

// Rotate function
function rotate(angle) {
    let tempX, tempY;
    let SaveCenterPoint = Object.assign({}, centerPoint);
    angle *= (Math.PI / 180);
    let sinAngle = Math.sin(angle);
    let cosAngle = Math.cos(angle);

    moveTo(new Point(0,0));
    data.points.forEach(point => {
        tempX = point.x;
        tempY = point.y;
        point.x = tempX * cosAngle - tempY * sinAngle;
        point.y = tempX * sinAngle + tempY * cosAngle;
    });
    moveTo(SaveCenterPoint);
    setCenter();
}

// Shear functions
function shearX(factor) {
    data.points.forEach(point => {point.x =((point.y - maxPoint.y) * factor) + (point.x)});
    setCenter();
}

function shearY(factor) {
    data.points.forEach(point => { point.y =((point.x - maxPoint.x) * factor) + (point.y)});
    setCenter();
}

// Mirror functions
function mirrorX(line) {
    data.points.forEach(point => { point.x = 2 * line - point.x});
    setCenter();
}

function mirrorY(line) {
    data.points.forEach(point => {point.y = 2 * line - point.y});
    setCenter();
}

// function mirrorZ() {
//     let xOld = 0;
//     let yOld = 0;
//     zIndex = 300;
//     alert(coordX[0] - coordZ[0] * Math.cos(Math.PI * (45 / 180)));
//     for (let i = 0; i < coordX.length; i++) {
//         xOld = coordX[i] - coordZ[i] * Math.cos(Math.PI * (45 / 180));
//         coordX[i] = xOld + (zIndex - coordZ[i]) * Math.cos(Math.PI * (45 / 180));
//     }
//     for (let i = 0; i < coordY.length; i++) {
//         yOld = coordY[i] - coordZ[i] * Math.sin(Math.PI * (45 / 180));
//         coordY[i] = yOld + (zIndex - coordZ[i]) * Math.sin(Math.PI * (45 / 180));
//         coordZ[i] = zIndex - coordZ[i];
//     }
//
//     alert(coordX[0] + "/" + coordY[0] + "/" + coordZ[0]);
//     setCenter();
// }

function setCenter() {
    maxPoint.x = Math.max.apply(Math, data.points.map(point => point.x));
    maxPoint.y = Math.max.apply(Math, data.points.map(point => point.y));

    minPoint.x = Math.min.apply(Math, data.points.map(point => point.x));
    minPoint.y = Math.min.apply(Math, data.points.map(point => point.y));

    centerPoint.x = Math.round(maxPoint.x - ((maxPoint.x - minPoint.x) / 2));
    centerPoint.y = Math.round(maxPoint.y - ((maxPoint.y - minPoint.y) / 2));

}

function drawshapesArray() {
    obj.clearRect(0, 0, width, height);
    if (data != 0) {
        console.log(data.length);
        data.line.forEach(
            (line) => {
                obj.moveTo(data.points[line.start].x, data.points[line.start].y);
                obj.lineTo(data.points[line.end].x, data.points[line.end].y);
                obj.stroke();
            });
        obj.beginPath();
        data.circles.forEach(
            (circle) => {
                obj.arc(data.points[circle.start].x, data.points[circle.start].y, circle.end, 0, 2 * Math.PI, false);
                obj.stroke();
                obj.beginPath();
            })
    }
    else {
    }

}

function setOption(num) {
    option = num;
    pointsNumber = 0;
}



// Gets mouse position
function mousePosition(e) {
  console.log(option);
    // Get mouse position
    mousePoint.x = e.pageX - document.getElementById("myCanvas").offsetLeft;
    mousePoint.y = e.pageY - document.getElementById("myCanvas").offsetTop;
    let point = new Point(mousePoint.x, mousePoint.y);
    obj.setLineDash([0, 0]);

    if (option > 3) {
        drawshapesArray();
        obj.beginPath();
        obj.setLineDash([5, 10]);
    }
    switch (option) {
         case 1: {

             const maxStart1 = Math.max.apply(Math, data.line.map(line => line.start));
             const maxStart2 = Math.max.apply(Math, data.circles.map(circle => circle.start));
             maxStart = Math.max(maxStart1,maxStart2);
             console.log(maxStart);

             const maxEnd1 = Math.max.apply(Math, data.line.map(line => line.end));
             const maxEnd2 = Math.max.apply(Math, data.circles.map(circle => circle.end));
             maxEnd = Math.max(maxEnd1,maxEnd2);
             console.log(maxEnd);

             option =0;
         break;
         }
        case 2: { // if Line or Circle
            // console.log("case2")
            // drowLineOrCircle(point);
            break;
        }
            // break;
        case 3: { // Bezier
            // drowBezier(point);
            break;
        }
            // break;
        case 4: {//Move
            obj.moveTo(centerPoint.x, centerPoint.y);
            obj.lineTo(mousePoint.x, mousePoint.y);
            break;
        }


        case 7: {//Mirror on axis X
            obj.beginPath();
            obj.moveTo(mousePoint.x, mousePoint.y - 300);
            obj.lineTo(mousePoint.x, mousePoint.y + 300);
            break;
        }

        case 8: {//Mirror on axis Y
            obj.beginPath();
            obj.moveTo(mousePoint.x - 300, mousePoint.y);
            obj.lineTo(mousePoint.x + 300, mousePoint.y);
            break;
        }
        case 9: {//Shear on axis X
            obj.moveTo(mousePoint.x, mousePoint.y);
            obj.lineTo(centerPoint.x, maxPoint.y);
            break
        }
        case 10: {//Shear on axis Y
            obj.moveTo(mousePoint.x, mousePoint.y);
            obj.lineTo(minPoint.x, centerPoint.y);
            break;
        }

    }

    if (option > 3) {
        obj.stroke();
        document.getElementById("myCanvas").onclick = () => save()
    }
    return true;
}

function drowLineOrCircle(point) {
    for (i = pointsNumber; i < 3; i++)
        points[i] = point;

    drawshapesArray();
    ctx.beginPath();
    // ctx.strokeStyle=color;

    if (option == 1) { //if a line
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
    }

    if (option == 2) { //if a circle
        ctx.arc(points[0].x, points[0].y, getDistance(points[0], points[1]), 0, 2 * Math.PI, false);
    }
    ctx.stroke();
    document.getElementById("myCanvas").onclick = function () {
        pointsNumber++;
    }
    if (pointsNumber == 2) {
        save();
    }
}


function save() {
    let tempShape = new Array();
    switch (option) {
        case 1: {
            console.log("line");

            // tempShape[0] = "line";
            // tempShape[1] = coordX.length;
            // coordX[coordX.length] = points[0].x;
            // coordY[coordY.length] = points[0].y;
            // tempShape[2] = coordX.length;
            // coordX[coordX.length] = points[1].x;
            // coordY[coordY.length] = points[1].y;
            // tempShape[3] = color;
            // shapesArray[shapesArray.length] = tempShape;
            setCenter();
        }
            break;
        case 2: {
            console.log("circle");

            // tempShape[0] = "circle";
            // tempShape[1] = coordX.length;
            // coordX[coordX.length] = points[0].x;
            // coordY[coordY.length] = points[0].y;
            // tempShape[2] = getDistance(points[0], points[1]);
            // tempShape[3] = color;
            // shapesArray[shapesArray.length] = tempShape;
            setCenter();
        }
            break;
        case 3: {
            console.log("bezier");

            // tempShape[0] = "bezier";
            // tempShape[1] = coordX.length;
            // coordX[coordX.length] = points[0].x;
            // coordY[coordY.length] = points[0].y;
            // tempShape[2] = coordX.length;
            // coordX[coordX.length] = points[1].x;
            // coordY[coordY.length] = points[1].y;
            // tempShape[3] = coordX.length;
            // coordX[coordX.length] = points[2].x;
            // coordY[coordY.length] = points[2].y;
            // tempShape[4] = coordX.length;
            // coordX[coordX.length] = points[3].x;
            // coordY[coordY.length] = points[3].y;
            // tempShape[5] = color;
            // shapesArray[shapesArray.length] = tempShape;
            setCenter();

        }
            break;

        case 4: {
            lastX = centerPoint.x;
            lastY = centerPoint.y;
            moveTo(mousePoint);
        }
            break;
        case 5: {
            let zoomFactor = document.getElementById('zoom').value;
            lastFactor = zoomFactor;
            zoom(zoomFactor);
        }
            break;
        case 6: {
            let angle = document.getElementById('angle').value;
            lastX = mousePoint.x;
            lastY = mousePoint.y;
            lastAngle = angle;
            rotate(angle);
        }
            break;
        case 7: {
            mirrorX(mousePoint.x);
            lastX = mousePoint.x;
        }
            break;
        case 8: {
            mirrorY(mousePoint.y);
            lastY = mousePoint.y;
        }
            break;
        // case 11: {
        //     mirrorZ();
        // }
        //     break;
        case 9: {
            let factor = (mousePoint.x - centerPoint.x) / (mousePoint.y - maxPoint.y);
            lastFactor = factor;
            shearX(factor);
        }
            break;
        case 10: {
            let factor = (mousePoint.y - centerPoint.y) / (mousePoint.x - minPoint.x);
            lastFactor = factor;
            shearY(factor);
        }
            break;


    }
    drawshapesArray();
    pointsNumber = 0;
    drawLast = option;
}



