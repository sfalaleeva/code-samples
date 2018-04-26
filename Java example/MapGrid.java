import java.awt.*;
import javax.swing.*;        
//import java.lang.reflect.*; 

/** 
 *  MapGrid class creates a 2D array of Color objects representing a map
 *  
 * @author Stacy Falaleeva
 * @version 20 September 2017
 * 
 */

public class MapGrid {

    /** empty grid */
    public static Color[][] grid;

    /** constructor for the grid, default color is white */ 
    public MapGrid(int columns, int rows ){
	grid = new Color[columns][rows];
	for (int i=0; i < columns; i++){
	    for (int j = 0; j < grid[0].length; j++){
		grid[i][j] = Color.WHITE;
	    }
	}
    }

    /** Accessor for width */
    public static int getGridWidth(){
	return grid.length;
    }

    /** Accessor for height */
    public static int getGridHeight(){
	return grid[0].length;
    }

    /** Accessor for color in a particular cell */ 
    public Color getCellColor(int x, int y){
	return grid[x][y];
    }

    /** Manipulator for cell color */ 
    public void setCellColor(int x, int y, Color c){
	grid[x][y] = c;
    }

    /** Fills a rectangular area of the grid with a color 
     * @param Rectangle object, Color object
     */
    public void makeRect(Rectangle rect, Color color){
	// get rectangle coordinates 
	int x = (int)rect.getX();
	int y = (int)rect.getY();
	// using coordinates, width and height set color of corresponding cells
	for (int c = x; c < x+(int)rect.getWidth(); c++){
	    for (int r = y; r < y+(int)rect.getHeight(); r++){
		grid[c][r] = color;
	    }
	}
    }
	//end of MapGrid class
}
