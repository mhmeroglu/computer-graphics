function GetTransform(positionX, positionY, rotation, scale) {
    var radian = (rotation * Math.PI) / 180;
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);
  
    var matrix = [
        scale * cos, -scale * sin, 0,
        scale * sin, scale * cos, 0,
        positionX, positionY, 1
    ];
    return matrix;
  }
  
  
  function ApplyTransform(trans1, trans2) {
    var result = [];
  
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var sum = 0;
        for (var k = 0; k < 3; k++) {
          sum += trans1[i * 3 + k] * trans2[k * 3 + j];
        }
        result.push(sum);
      }
    }
  
    return result;
  }
 
