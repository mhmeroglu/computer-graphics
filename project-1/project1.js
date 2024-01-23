function composite(BackGround, ForeGround, ForeGroundOpacity, ForeGroundPosition) {
    var BackGroundData = BackGround.data;
    var ForeGroundData = ForeGround.data;
    var width = BackGround.width;
    var height = BackGround.height;

    // Counting Starting points
    var sX = Math.max(ForeGroundPosition.x, 0);
    var sY = Math.max(ForeGroundPosition.y, 0);

    // Counting Ending points
    var eX = Math.min(ForeGroundPosition.x + ForeGround.width, width);
    var eY = Math.min(ForeGroundPosition.y + ForeGround.height, height);

    // These for loops are used to check the overflow parts of the foreground and to navigate each pixel.

    for (var y = sY; y < eY; y++) {
        for (var x = sX; x < eX; x++) {
            
            // Calculate indices in Matrix
            var backGroundIndex = (y * width + x) * 4; // 4, for RGBA 4 byte
            var foreGroundgX = x - ForeGroundPosition.x;
            var foreGroundgY = y - ForeGroundPosition.y;
            var foreGroundgXIndex = (foreGroundgY * ForeGround.width + foreGroundgX) * 4;

            // To adjust the opacity value
            var alpha = ForeGroundOpacity * (ForeGroundData[foreGroundgXIndex + 3] / 255); // Must be between 0 and 1 -> 0 transparent

            // Alpha blending = It allows us to see the photo in the background and the photo in the foreground at the same time.
            for (var i = 0; i < 3; i++) {
                BackGroundData[backGroundIndex + i] = BackGroundData[backGroundIndex + i] * (1 - alpha) + ForeGroundData[foreGroundgXIndex + i] * alpha;
            }
        }
    }
}
