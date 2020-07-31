// check whether otherVector is in the field of view of baseVector or not
// note: startAngle > endAngle
function checkVectorInCone(baseVector, baseDirection, otherVector, startAngle, endAngle){
    let isIn = false;

    // calculates the angle between baseVector and otherVector (with basis 0,0)
    let a = atan2(otherVector.y - baseVector.y, otherVector.x - baseVector.x);
    a = (a < 0) ? (2*Math.PI + a) : a;

    // calculates the absolute rotation of baseVector relative
    let angle = (acos(baseDirection.x * 1.0 / baseDirection.mag() * 1.0));
    angle = (baseDirection.y < 0) ? -angle : angle;
    angle = (angle < 0) ? (2*Math.PI + angle) : angle;

    let dif = Math.abs(angle-a);

    if(angle < Math.PI && a > Math.PI){
        isIn = (dif < startAngle) ||
               (2 * Math.PI + endAngle < dif) &&
               (dif < 2 * Math.PI);
    }
    else 
    if(angle > Math.PI && a < Math.PI)
    {
        isIn = (dif < startAngle || dif > 2 * Math.PI + endAngle) ||
               (dif < startAngle && dif > 0);
    }
    else
    {
        isIn = endAngle < dif && dif < startAngle;
    }

    return isIn;
}