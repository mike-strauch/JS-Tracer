
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
	this.asCanvasRGB = function()
	{
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}
	
	this.toString = function()	
	{	
		return "[" + this.r + ", " + this.g + ", " + this.b+ "]";
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
	
	this.times = function(value)
	{
		var result = new Point();
		result.x = this.x * value;
		result.y = this.y * value;
		result.z = this.z * value;
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
}

Ray.prototype.toString = function()
{
	return "startingPoint: " + this.startingPoint.x + ", " + this.startingPoint.y + ", " + this.startingPoint.z + "; direction point: " + this.directionPoint.x + ", " + this.directionPoint.y + ", " + this.directionPoint.z; 
}

/**
 * A 3D Shape that can be intersected by rays.
 */
function Shape(color)
{
	this.color = color;
	
    /**
     * Gets the intersection points of a Ray on this particular Shape.
     * Returns an array of Points (the ray could intersect with the shape more than once)
     * or null if the Ray does not intersect the shape.
     */
	this.getIntersections = function(ray)
	{
		return null;
	}

}

Sphere.prototype = new Shape;
Sphere.prototype.constructor = Sphere;
function Sphere(centerPoint, radius, color)
{
	Shape.call(this, color);
	this.centerPoint = centerPoint;
	this.radius = radius;

	this.getIntersections = function(ray)
	{
		var result = new Array();
		
		// So, yeah, couldn't get it to work using vectors with dot products and stuff so, 
		// you get the mess below this commented section
		
		/*var a = dotProduct(ray.directionPoint, ray.directionPoint);
		//alert('ray in getIntersections' + ray);
		var rayOriginMinusCenter = ray.startingPoint.minus(this.centerPoint);
		var b = dotProduct(rayOriginMinusCenter.times(2), ray.directionPoint);
		var c = dotProduct(rayOriginMinusCenter, rayOriginMinusCenter) - Math.pow(this.radius, 2);*/
		
		var i = ray.directionPoint.x - ray.startingPoint.x;
		var j = ray.directionPoint.y - ray.startingPoint.y;
		var k = ray.directionPoint.z - ray.startingPoint.z
		
		var a = Math.pow(i, 2) + Math.pow(j, 2) + Math.pow(k, 2);
		var b = 2 * i * (ray.startingPoint.x - this.centerPoint.x);
		b += 2 * j * (ray.startingPoint.y - this.centerPoint.y);
		b += 2 * k * (ray.startingPoint.z - this.centerPoint.z);
		var c = Math.pow(this.centerPoint.x, 2) + Math.pow(this.centerPoint.y, 2) + Math.pow(this.centerPoint.z, 2);
		c += Math.pow(ray.startingPoint.x, 2) + Math.pow(ray.startingPoint.y, 2) + Math.pow(ray.startingPoint.z, 2);
		c += 2 * (-1 * this.centerPoint.x * ray.startingPoint.x - this.centerPoint.y * ray.startingPoint.y - this.centerPoint.z * ray.startingPoint.z)
	    c -= Math.pow(this.radius, 2); 
			
		log("ray to intersect = " + ray);
		log("a = " + a + ", b = " + b + ", c = " + c);
	
		var determinant = Math.sqrt(Math.pow(b, 2) - (4 * a * c));
		
		// if NaN then there are no roots
		if (isNaN(determinant)) 
		{
			log("No Roots");
			return null;
		}
		
		var value1 = (-b + determinant) / (2 * a);
		var value2 = (-b - determinant) / (2 * a);
		
	    log("Potential roots found: t values = " + value1 + ", " + value2);
		
		// we're only concerned with values that are positive, negative values
		// indicate that the ray intersects with the object in the opposite direction
		if(value1 > 0)
			result.push(new Point(ray.startingPoint.x + (ray.directionPoint.x - ray.startingPoint.x) * value1, ray.startingPoint.y + (ray.directionPoint.y - ray.startingPoint.y) * value1, ray.startingPoint.z + (ray.directionPoint.z - ray.startingPoint.z) * value1));
	    if(value2 > 0)
			result.push(new Point(ray.startingPoint.x + (ray.directionPoint.x - ray.startingPoint.x) * value2, ray.startingPoint.y + (ray.directionPoint.y - ray.startingPoint.y) * value2, ray.startingPoint.z + (ray.directionPoint.z - ray.startingPoint.z) * value2));
	
		return result;
	}
}

/**
 * Determines the intersection points between a ray and a sphere.
 * @param {Object} ray
 */

function LightSource(location)
{
	this.location = location;
}

/**
 * Ray traces a scene described by the supplied parameters.
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
	var bgColor = 'rgb(0, 0, 0)';
	
    // the viewing point, or the point from which the scene will be drawn
    this.viewPoint = viewPoint;
    
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
		//alert(this.objectsInScene.length);
		var context = canvas.getContext("2d");
        context.fillStyle = "#FF0000";
        
		// the amount each pixel changes in x and y value in cartesian space
        var xIncrement = (this.xRange * 2) / canvas.width;
        var yIncrement = (this.yRange * 2) / canvas.height;
		
		// the ray currently being processed
		var currentRay;
		
		// the color to give the current pixel
		var pixelColor;
        
        try 
		{
			// iterate down the canvas
			var cartYValue = yRange;
			for (var y = 0; y < canvas.height; y++, cartYValue -= yIncrement) 
			{	
				var cartXValue = -xRange;
				// iterate across the canvas and fill in pixels with object
				// colors or the background color depending on whether or not
				// the generated ray intersects with any objects				
				for (var x = 0; x < canvas.width; x++, cartXValue += xIncrement) 
				{					
					//alert("cartxvalue = " + cartXValue);
					var currentRay = this.generateScreenRay(cartXValue, cartYValue);	
					//alert(currentRay);
					var pixelColor = this.intersectRayWithScene(currentRay);	
					
					if(pixelColor != null)
						context.fillStyle = pixelColor.asCanvasRGB();
					else
						context.fillStyle = bgColor;
						
					context.fillRect(x, y, 1, 1);
				}
			}
		}
		catch(e)
		{
			alert(e);
		}
		
		dumpLog();
    }
	
	/**
	 * For now, just finds the closest object in the scene that intersects with a ray
	 * and returns its color.
	 * 
	 * @param {Object} ray the ray to intersect with the scene
	 */
	this.intersectRayWithScene = function(ray)	
	{
		// keep track of the object closest to the view point
		var closestObject = null;
		// also keep track of the shortest intersection distance
		var closestDistance = null;
		
		if(objectsInScene == null)
			return;
		
		for(var i = 0; i < objectsInScene.length; i++)
		{	
			// points of intersection (could be more than 1 depending on the shape)
			var intersectionPoints = objectsInScene[i].getIntersections(ray);
			if(intersectionPoints == null)
				continue;
			
			for(var j = 0; j < intersectionPoints.length; j++)
			{
				var intersectionPoint = intersectionPoints[j];
				//(intersectionPoint + " " + ray.startingPoint);
				var distance = getDistance(intersectionPoint, ray.startingPoint);
				
				if (closestDistance == null || (closestDistance != null && distance < closestDistance)) 
				{
					closestDistance = distance;
					closestObject = objectsInScene[i];
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
	this.generateScreenRay = function(x, y)
	{
		var screenPoint = new Point(x, y, 0); // z value is 0 because we've strategically placed the screen on the 0 of z axis
		          //alert('view point = ' + this.viewPoint);                            // can update this later
		var result = new Ray(this.viewPoint, screenPoint);
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
    
    return Math.sqrt(squareDiffX + squareDiffY + squareDiffZ);
}

/**
 * Calculates the square of the difference between 2 values.
 * @param {Object} a
 * @param {Object} b
 */
function differenceSquare(a, b)
{
    return Math.pow(a.x - b.x, 2);
}

function dotProduct(v1, v2)
{
	var total = v1.x * v2.x;
	total += v1.y * v2.y;
	total += v1.z * v2.z;
	return total;
}

var buffer = "";
function log(msg)
{
	//buffer += msg + "<br/>";
}

function dumpLog()
{
	var logDiv = document.getElementById("log");
	logDiv.innerHTML = buffer;
	buffer = "";
}
