let data = [];
let obj;
let width;
let height;
let lastAction = -1;
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
    Scaling(factor);
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



function Scaling(size) {
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

         break;
         }
        case 2: {
            break;
        }

        case 3: {
            break;
        }

        case 4: {//Translation
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


        case 4: {
            lastX = centerPoint.x;
            lastY = centerPoint.y;
            moveTo(mousePoint);
            break;

        }
        case 5: {
            let scalingFactor = document.getElementById('scaling').value;
            lastFactor = scalingFactor;
            Scaling(scalingFactor);
            break;

        }
        case 6: {
            let angle = document.getElementById('angle').value;
            lastX = mousePoint.x;
            lastY = mousePoint.y;
            lastAngle = angle;
            rotation(angle);
            break;

        }
        case 7: {
            mirrorX(mousePoint.x);
            break;
        }

        case 8: {
            mirrorY(mousePoint.y);
            break;

        }
        case 9: {
            let factor = (mousePoint.x - centerPoint.x) / (mousePoint.y - maxPoint.y);
            lastFactor = factor;
            shearX(factor);
            break;

        }
        case 10: {
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



