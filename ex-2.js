/*
Date: 13/05/2018
Authors:
	Nadav Gilron 200329563
	Ohad Gefen	 301227622
Courser: computerGraphics.
College: Shenkar
 */

let data = [];
let obj;
let width;
let height;
let lastAction = -1;



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

let drawLast=-1,lastX=0,lastY=0,lastFactor=1,lastAngle=0;


window.onload = () => {
    let canvas = document.getElementById("myCanvas");
    height = canvas.height;
    width = canvas.width;
    let contextObj = canvas.getContext("2d");

    obj = contextObj;
    document.onmousemove = mousePosition;
};



function readSingleFile() {
    const fileElement = document.getElementById('file-input').files;

    if (!fileElement.length) {
        alert("Please choose a file");
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

function fitImage() {
    const factorX = height / (maxPoint.x - minPoint.x);
    const factorY = width / (maxPoint.y - minPoint.y);
    const factor = Math.min(factorX, factorY);
    scaling(factor);
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

function scaling(size) {
    const Sx = centerPoint.x * (1 - size);
    const Sy = centerPoint.y * (1 - size);
    data.points.forEach(point => {
        point.x = point.x * size + Sx;
        point.y = point.y * size + Sy;
    })
}

// Rotate function
function rotation(angle) {
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
    lastX = line;
    setCenter();
}

function mirrorY(line) {
    data.points.forEach(point => {point.y = 2 * line - point.y});
    setCenter();
}

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
        data.bezier.forEach(bezier=>{
            obj.moveTo(data.points[bezier.a].x,data.points[bezier.a].y);
            obj.bezierCurveTo(data.points[bezier.b].x, data.points[bezier.b].y, data.points[bezier.c].x, data.points[bezier.c].y, data.points[bezier.d].x,data.points[bezier.d].y)
            obj.stroke();
            obj.beginPath();
        })
    }

}

function setOption(num) {
    option = num;
    pointsNumber = 0;
}

// Gets mouse position
function mousePosition(e) {
    // Get mouse position
    mousePoint.x = e.pageX - document.getElementById("myCanvas").offsetLeft;
    mousePoint.y = e.pageY - document.getElementById("myCanvas").offsetTop;
    obj.setLineDash([0, 0]);
    drawshapesArray();
    obj.beginPath();

    switch (option) {
        case 1: {//Translation
            obj.moveTo(centerPoint.x, centerPoint.y);
            obj.lineTo(mousePoint.x, mousePoint.y);
            break;
        }
        case 4: {//Mirror on axis X
            obj.beginPath();
            obj.moveTo(mousePoint.x, mousePoint.y - 300);
            obj.lineTo(mousePoint.x, mousePoint.y + 300);
            break;
        }
        case 5: {//Mirror on axis Y
            obj.beginPath();
            obj.moveTo(mousePoint.x - 300, mousePoint.y);
            obj.lineTo(mousePoint.x + 300, mousePoint.y);
            break;
        }
        case 6: {//Shear on axis X
            obj.moveTo(mousePoint.x, mousePoint.y);
            obj.lineTo(centerPoint.x, maxPoint.y);
            break
        }
        case 7: {//Shear on axis Y
            obj.moveTo(mousePoint.x, mousePoint.y);
            obj.lineTo(minPoint.x, centerPoint.y);
            break;
        }
    }

        obj.stroke();
        document.getElementById("myCanvas").onclick = () => save();
    return true;
}

function undo(){
    switch(drawLast) {
        case 1:
        {
            let lastPoint=new Point(lastX,lastY);
            moveTo(lastPoint);
            break;
        }
        case 2:
            {scaling(1/lastFactor); break;}
        case 3:
            {rotation(-lastAngle); break;}
        case 4:
            {mirrorX(lastX); break;}
        case 5:
            {mirrorY(lastY); break;}
        case 6:
            {shearX(-lastFactor); break;}
        case 7:
            {shearY(-lastFactor); break;}
    }
    drawshapesArray();
    drawLast=-1;
}

function save() {

    switch (option) {
        case 1: {
            lastX = centerPoint.x;
            lastY = centerPoint.y;
            moveTo(mousePoint);
            break;
        }
        case 2: {
            let scalingFactor = document.getElementById('scaling').value;
            lastFactor = scalingFactor;
            scaling(scalingFactor);
            break;
        }
        case 3: {
            let angle = document.getElementById('angle').value;
            lastX = mousePoint.x;
            lastY = mousePoint.y;
            lastAngle = angle;
            rotation(angle);
            break;
        }
        case 4: {
            mirrorX(mousePoint.x);
            lastX = mousePoint.x;
            break;
        }

        case 5: {
            mirrorY(mousePoint.y);
            lastY = mousePoint.y;
            break;

        }
        case 6: {
            let factor = (mousePoint.x - centerPoint.x) / (mousePoint.y - maxPoint.y);
            lastFactor = factor;
            shearX(factor);
            break;

        }
        case 7: {
            let factor = (mousePoint.y - centerPoint.y) / (mousePoint.x - minPoint.x);
            lastFactor = factor;
            shearY(factor);
            break;
        }
    }
    drawshapesArray();
    pointsNumber = 0;
    drawLast = option;
}



