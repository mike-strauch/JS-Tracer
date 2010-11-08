
/**
 * An Color using the the RGB color model.
 */
function Color(r, g, b)
{
    this.r = r;
    this.g = g;
    this.b = b;
	
	/**
	 * Returns a String that is used to set the color of the canvas context
	 */
	asCanvasRGB = function()
	{
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}
}

/**
 * A point in 3D space.
 */
function Point(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}


/**
 * A Ray!
 *
 * Rays consist of a starting point and a "direction" point.
 */
function Ray(startingPoint, directionPoint)
{
    this.startingPoint = startingPoint;
    this.directionPoint = directionPoint;
    
    /** 
     * Normalizes the ray (i.e. makes it so that it has length 1)
     */
    this.normalize = function()
    {
        //var distance
    }
}

/**
 * A 3D Shape that can be intersected by rays.
 */
function Shape()
{
    /**
     * Determines where a Ray intersects with the shape.
     * Returns an array of Points (the ray could intersect with the shape more than once)
     * or null if the Ray does not intersect the shape.
     */
    this.rayIntersects = function(ray)
    {
    
    }
}

function LightSource(location)
{
	this.location = location;
}

/**
 * A shape that occurs in a ray-traceable scene.
 * Has a color so that it can be drawn on a canvas.
 */
function RayTraceableShape()
{
    this.shape;
    this.color;
}

/**
 * 
 * @param {Object} viewPoint the point from which rays originate
 * @param {Object} xRange x range in cartesian "units", this is treated as a +/- value, so a value of 5 would mean x goes from -5 to 5
 * @param {Object} yRange y range in cartesian "units", this is treated as a +/- value, so a value of 5 would mean y goes from -5 to 5
 * @param {Object} objectsInScene
 * @param {Object} lights
 * @param {Object} canvasElementId id of the canvas element in the page on which to draw
 */
function Tracer(viewPoint, xRange, yRange, objectsInScene, lights, canvasElementId)

{
	this.backgroundColor = 'rgb(0, 0, 0)';
	
    // the viewing point, or the point from which the scene will be drawn
    this.viewPoint;
    
    // range of x values for the scene
    this.xRange = xRange;
    
    // range of y values for the scene
    this.yRange = yRange;
    
    // the objects in the scene to draw
    this.objectsInScene = objectsInScene;
    
    // any light sources in the scene
    this.lights = lights;
    
    // id of the canvas to draw on
    this.canvasElementId = canvasElementId;
    
    this.rayTrace = function()
    {
        var canvas = document.getElementById(canvasElementId);
      
        if (canvas == null) 
        {
            alert("No canvas with id " + canvasElementId + " exists");
            return;
        }        
		
		var context = canvas.getContext("2d");
        context.fillStyle = "#FF0000";
        
		// the amount each pixel changes in x and y value in cartesian space
        var xIncrement = canvas.width / this.xRange;
        var yIncrement = canvas.height / this.yRange;
		
		// the x and y values for where the ray intersects the "screen", 
		// initialized to point to the top left corner of the screen
		var cartXValue = -xRange;
		var cartYValue = yRange;
		// the ray currently being processed
		var currentRay;
		
		// the color to give the current pixel
		var pixelColor;
        
        try 
		{
			// we're just drawing a rectangle for now to get this to draw something
			for (y = 0; y < canvas.height; y++, cartYValue += yIncrement) 
			{
				for (x = 0; x < canvas.width; x++, cartXValue += xIncrement) 
				{					
					currentRay = generateRay(cartXValue, cartYValue);	
					pixelColor = intersectRayWithScene(currentRay);	
					
					if(pixelColor != null)
						context.fillStyle = pixelColor.asCanvasRGB();
					else
						contextFillStyle = backgroundColor;
						
					context.fillRect(y, x, 1, 1);
				}
			}
		}
		catch(e)
		{
			alert(e);
		}
    }
	
	intersectRayWithScene = function(ray)	
	{
		
	}
	
	/**
	 * Generates a new ray starting at the view point supplied on initialization and
	 * ending at the point specified by x and y parameters (uses 0 for z value for now).
	 * 
	 * TODO: will probably need a more generic method to generate reflection/light rays and what not
	 * 
	 * @param {Object} x
	 * @param {Object} y
	 */
	generateScreenRay = function(x, y)
	{
		var screenPoint = new Point(x, y, 0); // z value is 0 because we've strategically placed the screen right on the 0 of z axis
		                                      // can update this later
		var result = new Ray(this.viewPoint, screenPoint);
		result.normalize();
		return result;
	}
}

/**
 * Calculates the distance between 2 Points.
 * @param {Object} point1
 * @param {Object} point2
 */
function distance(point1, point2)
{
    var squareDiffX = differenceSquare(point1.x, point2.x);
    var squareDiffY = differenceSquare(point1.y, point2.y);
    var squareDiffZ = differenceSquare(point1.z, point2.z);
    
    return Math.sqrt(squareDiffx + squareDiffY + squareDiffZ);
}

/**
 * Calculates the square of the difference between 2 values.
 * @param {Object} a
 * @param {Object} b
 */
function differenceSquare(a, b)
{
    return Math.pow(point1.x - point2.x, 2);
}
