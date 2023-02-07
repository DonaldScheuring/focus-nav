function calculate3DPosition(distance, positionX, positionY, fov = 54) {
    // Camera parameters
    var focalLength = 0.5 * (positionX / Math.tan(Math.radians(fov / 2)));
    var x = (positionX - 0.5 * 640) * (distance / focalLength);
    var y = (positionY - 0.5 * 480) * (distance / focalLength);
    var z = distance;
    return [x, y, z];
  }
  
  function calculateScreenPosition(screenWidth, screenHeight, offsetZ) {
    // Screen position relative to the webcam
    var screenPosition = [0, 0, offsetZ + screenHeight / 2.0];
    // Screen normal vector
    var screenNormal = [0, 0, -1];
    // Screen corners
    var screenCorners = [    [screenPosition[0] - screenWidth / 2.0, screenPosition[1] + screenHeight / 2.0, screenPosition[2]],
      [screenPosition[0] + screenWidth / 2.0, screenPosition[1] + screenHeight / 2.0, screenPosition[2]],
      [screenPosition[0] + screenWidth / 2.0, screenPosition[1] - screenHeight / 2.0, screenPosition[2]],
      [screenPosition[0] - screenWidth / 2.0, screenPosition[1] - screenHeight / 2.0, screenPosition[2]]
    ];
    return [screenPosition, screenNormal, screenCorners];
  }
  
  function calculateIntersection(vector, distance, positionX, positionY, screenWidth, screenHeight, offsetZ, screenResolutionX, screenResolutionY) {
    // Calculate 3D position of the point
    var point = calculate3DPosition(distance, positionX, positionY);
    // Calculate screen position and normal
    var screenPosition = calculateScreenPosition(screenWidth, screenHeight, offsetZ)[0];
    var screenNormal = calculateScreenPosition(screenWidth, screenHeight, offsetZ)[1];
    // Calculate intersection of the line and the plane
    var lineDirection = [vector[0] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]), vector[1] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]), vector[2] / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2])];
    var linePoint = point;
    var planePoint = screenPosition;
    var planeNormal = screenNormal;
    var d = (planeNormal[0] * (planePoint[0] - linePoint[0]) + planeNormal[1] * (planePoint[1] - linePoint[1]) + planeNormal[2] * (planePoint[2] - linePoint[2])) / (planeNormal[0] * lineDirection[0] + planeNormal[1] * lineDirection[1] + planeNormal[2] * lineDirection[2]);
    var intersection = [linePoint[0] + d * lineDirection[0], linePoint[1] + d * lineDirection[1], linePoint[2] + d * lineDirection[2]];
    // Convert intersection to pixel coordinates
    var x = (intersection[0] + screenWidth / 2.0) / (screenWidth / screenResolutionX);
    var y = (screenHeight / 2.0 - intersection[1]) / (screenHeight / screenResolutionY);
    return [x, y];
    }

    // Example usage
var vector = [0, 0, -1]; // direction vector from the point to the camera
var distance = 1;
var positionX = 320;
var positionY = 240;
var screenWidth = 2; // width of the screen in meters
var screenHeight = 1; // height of the screen in meters
var offsetZ = 0; // offset of the screen from the webcam along the z axis
var screenResolutionX = 1920; // horizontal resolution of the screen in pixels
var screenResolutionY = 1080; // vertical resolution of the screen in pixels

var pixelCoordinates = calculateIntersection(vector, distance, positionX, positionY, screenWidth, screenHeight, offsetZ, screenResolutionX, screenResolutionY);
console.log("Pixel coordinates:", pixelCoordinates);