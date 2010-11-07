
/**
 * An Color using the the RGB color model.
 */
function Color(r, g, b)
{
    this.r = r;
    this.g = g;
    this.b = b;
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

function Tracer(viewPoint, xRange, yRange, objectsInScene, lights, canvasElementId)
{
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
        
        var xIncrement = canvas.width / this.xRange;
        var yIncrement = canvas.height / this.yRange;
        
        try 
		{
			// we're just drawing a rectangle for now to get this to work
			for (i = 0; i < canvas.height; i++) 
			{
				for (j = 0; j < canvas.width; j++) 
				{
					context.fillRect(j, i, 1, 1);
				}
			}
		}
		catch(e)
		{
			alert(e);
		}
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
