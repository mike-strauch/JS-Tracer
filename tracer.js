
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
	
	this.minus = function(p)
	{
		var result = new Point();
		result.x = this.x - p.x;
		result.y = this.y - p.y;
		result.z = this.z - p.z;
		return result;
	}
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
     * Gets the intersection points of a Ray on this particular Shape.
     * Returns an array of Points (the ray could intersect with the shape more than once)
     * or null if the Ray does not intersect the shape.
     */
    this.getIntersections = function(ray)
    
	{
		var result = new Array();
		result.push(new Point(1, 1, 1));
		return result;
    }
}

/**
 * A shape that occurs in a ray-traceable scene.
 * Has a color so that it can be drawn on a canvas.
 */
function RayTraceableShape(color)
{
    this.color = color;
}

Sphere.prototype = new RayTraceableShape();
Sphere.prototype.constructor = Sphere;
function Sphere(centerPoint, radius, color)
{
	RayTraceableShape.constructor.call(this, color);
	this.centerPoint = centerPoint;
	this.radius = radius;
}

/**
 * Determines the intersection points between a ray and a sphere.
 * @param {Object} ray
 */
Sphere.prototype.getIntersections = function(ray)
{
	// TODO: check this math, what's linear algebra again? what's algebra again?
	var result = new Array();
	var a = dotProduct(ray.directionPoint, ray.directionPoint);
	
	var rayOriginMinusCenter = ray.startingPoint.minus(this.centerPoint);
	var b = 2 * dotProduct(rayOriginMinusCenter, ray.directionPoint);
	var c = dot(rayOriginMinusCenter, rayOriginMinusCenter) - Math.pow(this.radius, 2);
	
	try 
	{	
		var sqrtValue = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
		var value1 = (-b + sqrtValue) / 2 * a;
		var value2 = (-b - sqrtValue) / 2 * a;
		
		point1 = new Point(ray.directionPoint.x * value1, ray.directionPoint.y * value1, ray.directionPoint.z * value1);
		point2 = new Point(ray.directionPoint.x * value2, ray.directionPoint.y * value2, ray.directionPoint.z * value2);
		
		result.push(point1);
		result.push(point2);
	}
	// we can run into issues if there are no roots for the equation, i'm not exactly sure what will happen if there are no roots
	// probably run into imaginary numbers when trying to take sqrt of a negative	
	catch(e)
	{
		alert("No roots found!");
	}
	return result;
}

function LightSource(location)
{
	this.location = location;
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
			// iterate down the canvas
			for (y = 0; y < canvas.height; y++, cartYValue += yIncrement) 
			{
				// iterate across the canvas and fill in pixels with object
				// colors or the background color depending on whether or not
				// the generated ray intersects with any objects				
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
	
	/**
	 * For now, just finds the closest object in the scene that intersects with a ray
	 * and returns its color.
	 * 
	 * @param {Object} ray the ray to intersect with the scene
	 */
	intersectRayWithScene = function(ray)	
	{
		// keep track of the object closest to the view point
		var closestObject = null;
		// also keep track of the shortest intersection distance
		var closestDistance = null;
		
		for(i = 0; i < objectsInScene.length; i++)
		{	
			// points of intersection (could be more than 1 depending on the shape
			intersectionPoints = objectsInScene[i].getIntersections(ray);
			if(intersectionPoints != null)
			{
				for(j = 0; j < intersectionPoints.length; j++)
				{
					var intersectionPoint = intersectionPoints[j];
					var distance = getDistance(intersectionPoint, ray.startingPoint);
					
					if (closestDistance == null || (closestDistance != null && distance < closestDistance)) 
					{
						closestDistance = distance;
						closestObject = objectsInScene[i];
					}
				}
			}
		}
		
		return closestObject == null ? null : closestObject.color;
	}
	
	/**
	 * Generates a new ray starting at the view point supplied during initialization and
	 * ending at the point specified by x and y parameters (uses 0 for z value for now).
	 * 
	 * TODO: will probably need a more generic method to generate reflection/light rays and what not
	 * 
	 * @param {Object} x
	 * @param {Object} y
	 */
	generateScreenRay = function(x, y)
	{
		var screenPoint = new Point(x, y, 0); // z value is 0 because we've strategically placed the screen on the 0 of z axis
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
function getDistance(point1, point2)
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

function dotProduct(v1, v2)
{
	var total;
	total += v1.x * v2.x;
	total += v1.y * v2.y;
	total += v1.z * v2.z;
	return total;
}
