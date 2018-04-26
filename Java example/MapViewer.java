import java.awt.*;
import javax.swing.*;        
//import java.lang.reflect.*;    

/** 
 * MapViewer class allows to view MapGrid objects with different offset points
 * and different magnification (scale)  
 * 
 * @author Stacy Falaleeva
 * @version 20 September 2017
 */

public class MapViewer extends JComponent {

    private Point offset = new Point(0,0); //default offset is 0,0
    private int scale;
    private MapGrid map;

    /** Constructor for the MapViewer, takes MapGrid as parameter */
    public MapViewer(MapGrid m){
	map = m; 
	scale = 1;       //standard size, no magnification 
	this.setMinimumSize(new Dimension(100, 100));
	this.setPreferredSize(new Dimension(500, 300));
    }

    /** Constructor with custom offset and scale */ 
    public MapViewer(MapGrid m, Point p, int s){
	map = m; 
	offset = p;
	scale = s;
	this.setMinimumSize(new Dimension(100, 100));
	this.setPreferredSize(new Dimension(500, 300));	
    }

    /** Accessor for offset point */
    public Point getOffset(){
	return offset;
    }

    /** Accessor for scale */
    public int getScale(){
	return scale; 
    }

    /** Manipulator for scale */
    public void setScale(int newScale){
	scale = newScale; 
	revalidate();
    }

    /** Manipulator for offset point */ 
    public void setOffset(Point p){
	offset = p;
	revalidate();
    }

    /** Draws squares of the map in the window */ 
     public void paintComponent(Graphics g){
	 int cellHeight = 20 * scale;   // based on 500x30 window and 25x15 grid
	 int cellWidth = 20 * scale; 
	 /*
	 // uncomment to resize the cells to fit different window dimensions 
	 int cellHeight = (int)(this.getPreferredSize().getHeight()/map.getGridHeight())*scale; 
	 int cellWidth = (int)(this.getPreferredSize().getWidth()/map.getGridWidth())*scale;
	 */
   
	 for (int c = 0; c < map.getGridWidth(); c++){
	     for (int r = 0; r < map.getGridHeight(); r++){
		 // refer to map to get the right color for the cell
		 g.setColor(map.getCellColor(c,r));
		 // account for offset here 
		 g.fillRect((int)offset.getX() + 0 + cellWidth * c, 
			    (int)offset.getY() + 0 + cellHeight * r,
			    cellWidth, cellHeight); 
	     }
	 }
     }

    // end of MapViewer class
	
}
