import java.awt.*;
import java.awt.event.*;
import javax.swing.*;        

/**
 *  MapGUI manager that allows to scroll and zoom 
 *  
 *
 *  @author Stacy Falaleeva
 *  @version 27 September 2017
 */
public class MapGUI extends JApplet {

    /** Fields for the MapViewer and MapGrid objects */
    private MapViewer view;
    private MapGrid map;

    /** Constructor sets up a new map grid and viewer for it */
    public MapGUI() {
	map = new MapGrid(25,15);
	view = new MapViewer(map);
    }

    /**
     *  This method is called by the application version.
     */
    public void createAndShowGUI() {
        // Make sure we have nice window decorations.
        JFrame.setDefaultLookAndFeelDecorated(true);

        // Create and set up the window.
        JFrame frame = new JFrame("Sample GUI Application");
        try { frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	} catch (Exception e) {}

	// Add components
	createComponents(frame.getContentPane());

        // Display the window.
        frame.pack();
        frame.setVisible(true);
	
    }

    /**
     *  Both types of app call this to set up the GUI contents.
     *
     *  @param pane  The pane of the JFrame of JApplet
     */
    public void createComponents(Container pane) {
        // set up layout
	pane.setLayout(new FlowLayout());
	
	// island 1 with a house and a road
	Color grass = new Color(76, 153, 0);
	map.makeRect(new Rectangle(0,0,25,15),new Color(123, 174, 213));
	map.makeRect(new Rectangle(3,2,8,6), grass);
	map.makeRect(new Rectangle(4,3,2,3), Color.BLACK);
	map.makeRect(new Rectangle(6,4,3,1), Color.LIGHT_GRAY);
	map.makeRect(new Rectangle(8,5,1,3), Color.LIGHT_GRAY);
	// red boat 
	map.makeRect(new Rectangle(10,11,2,1), Color.RED);
	// island 2 with a beach
	map.makeRect(new Rectangle(19,10,6,5), new Color(246, 216, 145));
	map.makeRect(new Rectangle(21,12,4,3), new Color(0, 102, 51));
	// islands 3 with a bridge connecting it to island 2
	map.makeRect(new Rectangle(19,4,5,2), grass);
	map.makeRect(new Rectangle(20,3,4,1), grass);
	map.makeRect(new Rectangle(22,2,2,1), grass);
	map.makeRect(new Rectangle(21,5,1,6), new Color(107, 51, 0));

	//set up layout for buttons
	Panel plane = new Panel();
	plane.setLayout(new BorderLayout());
	//for zoom in/zoom out buttons in the middle
	Panel box = new Panel();
	box.setLayout(new GridLayout(2,1));

	//make buttons
	JButton North = new JButton("North");
	JButton South = new JButton("South");
	JButton East = new JButton("East");
	JButton West = new JButton("West");
	JButton Zoom_out = new JButton("Zoom Out");
	JButton Zoom_in = new JButton("Zoom In");
	//add buttons 
	box.add(Zoom_out);
	Zoom_out.addActionListener(new ZoomListener(-1));
	box.add(Zoom_in);
	Zoom_in.addActionListener(new ZoomListener(1));
	plane.add(North, BorderLayout.NORTH);
	North.addActionListener(new ScrollListener(0,-1));
	plane.add(South, BorderLayout.SOUTH);
	South.addActionListener(new ScrollListener(0,1));
	plane.add(East, BorderLayout.EAST);
	East.addActionListener(new ScrollListener(1,0));
	plane.add(West, BorderLayout.WEST);
	West.addActionListener(new ScrollListener(-1,0));
	plane.add(box, BorderLayout.CENTER);

	//add mouselistener to center on click 
	view.addMouseListener(new CenterListener());
	pane.add(view);
	pane.add(plane);

 }

    /** 
     *  This is the entry point for the applet version
     */
    public void init() {
	//Execute a job on the event-dispatching thread:
	//creating this applet's GUI.
	try {
	    javax.swing.SwingUtilities.invokeAndWait(new Runnable() {
		    public void run() {
                        // line below would create separate window
			//gui.createAndShowGUI();

                        // this line creates applet in browser window
                        createComponents(getContentPane());
		    }
		});
	} catch (Exception e) {
	    System.err.println("createGUI didn't successfully complete");
	}
    }

    /** 
     *  This is the entry point for the application version
     */
    public static void main(String[] args) {
        final MapGUI GUI = new MapGUI();
        // Schedule a job for the event-dispatching thread:
        // creating and showing this application's GUI.
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
		public void run() {
		    GUI.createAndShowGUI();
		}
	    });
    }


    /** 
     * Zooming: changes the scale while ceentral point remains the same
     *
     * @param  zoom_direction is +/- 1, when positive zooms in, negative - zooms out 
     */
    public void zoom(int zoom_direction){
	//calculate new scale based on zoom_direction (+/-)
	int newScale = view.getScale() + zoom_direction;

	//calculate new offset to center the zoomed view
	int newX = -newScale*(view.getWidth()/2 - (int)view.getOffset().getX())/view.getScale() + view.getWidth()/2;
	int newY = -newScale*(view.getHeight()/2 - (int)view.getOffset().getY())/view.getScale() + view.getHeight()/2;

	//don't zoom out if scale=1
	if (newScale <= 0) {
	    System.out.println("Nowhere to zoom out");
	}else{
	    view.setScale(view.getScale() + zoom_direction);
	    view.setOffset(new Point(newX, newY));
	}
    }


    /**
     * Scrolling: shifts the map by 1/3 of the visible area
     *
     * @param If x = -1 then scrolls to the left, x=1 scrolls to the right
     * x=0 doesn't scroll horizontally
     *        If y = -1 scrolls up, y=1 scrolls down, y=0 doesn't scroll 
     * vertically
     */ 
    public void scroll(int x, int y){
	//calculate new offset
	int new_X = (int)view.getOffset().getX() - (int)(view.getWidth()/3)*x;
	int new_Y = (int)view.getOffset().getY() - (int)(view.getHeight()/3)*y;
	view.setOffset(new Point(new_X, new_Y));
    }

    
    /** Listener for zoom in/zoom out buttons */ 
    public class ZoomListener implements ActionListener {

	/** Defines whether to zoom in or out */
	private int zoom_direction;

	/** Constructor */
	public ZoomListener(int z){
	    zoom_direction = z;
	}
	/** Event handler - call zoom method */
	public void actionPerformed(ActionEvent e){
	    zoom(zoom_direction);
	}
    }


    /** Listener for scrolling buttons */
    public class ScrollListener implements ActionListener {
	/** Horizontal and vertical directions of the scroll */ 
	int x_dir;
	int y_dir;

	/** Constructor - set horizontal and vertical direction to -1,0 or 1*/
	public ScrollListener(int x, int y){
	    x_dir = x;
	    y_dir = y;
	}
	/** Event handler - call scroll method */
	public void actionPerformed(ActionEvent e) {
	    scroll(x_dir, y_dir);
	}
    }


    /** Listener for mouse clicks on the map */
    private class CenterListener extends MouseAdapter {
	/** Based on the coordinated of the click recenters the view
	 *  
	 * newX = Xoffset + w/2 - Xclicked
	 * newY = Yoffset + h/2 - Yclicked
	 * new offset = (newX, newY)
	 * 
	 */
	public void mouseClicked(MouseEvent e){
	 	    
	    view.setOffset(new Point((int)(view.getOffset().getX()+
					   (view.getWidth()/2 - e.getX())),
				     (int)(view.getOffset().getY()+
					   (view.getHeight()/2 - e.getY()))));
	}

    }
}
