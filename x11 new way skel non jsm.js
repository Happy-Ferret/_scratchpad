Cu.import('resource://gre/modules/ctypes.jsm');
var libx11 = ctypes.open('libX11.so.6');

var core = {os:{}};
core.os.xpcomabi = Services.appinfo.XPCOMABI; // for non worker
core.os.name = OS.Constants.Sys.Name.toLowerCase();

// temp overide as no cutils:
var cutils = {
	jscGetDeepest: function(a) { return a }
}

if (ctypes.voidptr_t.size == 4 /* 32-bit */) {
	var is64bit = false;
} else if (ctypes.voidptr_t.size == 8 /* 64-bit */) {
	var is64bit = true;
} else {
	throw new Error('huh??? not 32 or 64 bit?!?!');
}

var xlibTypes = function() {
	// ABIs
	this.CALLBACK_ABI = ctypes.default_abi;
	this.ABI = ctypes.default_abi;
	
	// C TYPES
	this.char = ctypes.char;
	this.int = ctypes.int;
	this.long = ctypes.long;
	this.size_t = ctypes.size_t;
	this.unsigned_char = ctypes.unsigned_char;
	this.unsigned_int = ctypes.unsigned_int;
	this.unsigned_long = ctypes.unsigned_long;
	this.void = ctypes.void_t;
	
	// SIMPLE TYPES // http://refspecs.linuxfoundation.org/LSB_1.3.0/gLSB/gLSB/libx11-ddefs.html
	this.Atom = ctypes.unsigned_long;
	this.Bool = ctypes.int;
	this.KeyCode = ctypes.unsigned_char;
	this.Status = ctypes.int;
	this.Time = ctypes.unsigned_long;
	this.VisualID = ctypes.unsigned_long;
	this.XID = ctypes.unsigned_long;
	this.XPointer = ctypes.char.ptr;
	this.CARD32 = /^(Alpha|hppa|ia64|ppc64|s390|x86_64)-/.test(core.os.xpcomabi) ? this.unsigned_int : this.unsigned_long; // https://github.com/foudfou/FireTray/blob/a0c0061cd680a3a92b820969b093cc4780dfb10c/src/modules/ctypes/linux/x11.jsm#L45 // // http://mxr.mozilla.org/mozilla-central/source/configure.in

	// ADVANCED TYPES
	this.Colormap = this.XID;
	this.Cursor = this.XID;
	this.Drawable = this.XID;
	this.Font = this.XID;
	this.GContext = this.XID;
	this.KeySym = this.XID;
	this.Pixmap = this.XID;
	this.Window = this.XID;

	// OPAQE STRUCTS
	this.Screen = ctypes.StructType('Screen');
	this.Display = ctypes.StructType('Display');
	this.Visual = ctypes.StructType('Visual');
	this.Depth = ctypes.StructType('Depth');
	
	// SIMPLE STRUCTS
	this.XImage = ctypes.StructType('_XImage', [	// https://github.com/pombreda/rpythonic/blob/23857bbeda30a4574b7ae3a3c47e88b87080ef3f/examples/xlib/__init__.py#L1593
		{ width: this.int },
		{ height: this.int },						// size of image
		{ xoffset: this.int },						// number of pixels offset in X direction
		{ format: this.int },						// XYBitmap, XYPixmap, ZPixmap
		{ data: this.char.ptr },					// pointer to image data
		{ byte_order: this.int },					// data byte order, LSBFirst, MSBFirst
		{ bitmap_unit: this.int },					// quant. of scanline 8, 16, 32
		{ bitmap_bit_order: this.int },				// LSBFirst, MSBFirst
		{ bitmap_pad: this.int },					// 8, 16, 32 either XY or ZPixmap
		{ depth: this.int },						// depth of image
		{ bytes_per_line: this.int },				// accelerator to next scanline
		{ bits_per_pixel: this.int },				// bits per pixel (ZPixmap)
		{ red_mask: this.unsigned_long },			// bits in z arrangement
		{ green_mask: this.unsigned_long },
		{ blue_mask: this.unsigned_long },
		{ obdata: this.XPointer },					// hook for the object routines to hang on
		{
			f: ctypes.StructType('funcs', [			// image manipulation routines
				{ create_image: ctypes.voidptr_t },
				{ destroy_image: ctypes.voidptr_t },
				{ get_pixel: ctypes.voidptr_t },
				{ put_pixel: ctypes.voidptr_t },
				{ sub_image: ctypes.voidptr_t },
				{ add_pixel: ctypes.voidptr_t }
			])
		}
	]);
	
	this.XWindowAttributes = ctypes.StructType('XWindowAttributes', [
		{ x: this.int },
		{ y: this.int },							// location of window
		{ width: this.int },
		{ height: this.int },						// width and height of window
		{ border_width: this.int },					// border width of window
		{ depth: this.int },						// depth of window
		{ visual: this.Visual.ptr },				// the associated visual structure
		{ root: this.Window },						// root of screen containing window
		{ class: this.int },						// InputOutput, InputOnl
		{ bit_gravity: this.int },					// one of bit gravity values
		{ win_gravity: this.int },					// one of the window gravity values
		{ backing_store: this.int },				// NotUseful, WhenMapped, Always
		{ backing_planes: this.unsigned_long },		// planes to be preserved if possible
		{ backing_pixel: this.unsigned_long },		// value to be used when restoring planes
		{ save_under: this.Bool },					// boolean, should bits under be saved?
		{ colormap: this.Colormap },				// color map to be associated with window
		{ map_installed: this.Bool },				// boolean, is color map currently installe
		{ map_state: this.int },					// IsUnmapped, IsUnviewable, IsViewable
		{ all_event_masks: this.long },				// set of events all people have interest i
		{ your_event_mask: this.long },				// my event mask
		{ do_not_propagate_mask: this.long },		// set of events that should not propagate
		{ override_redirect: this.Bool },			// boolean value for override-redirect
		{ screen: this.Screen.ptr }					// back pointer to correct screen
	]);
	
	this.XTextProperty = ctypes.StructType('XTextProperty', [
		{ value: this.unsigned_char.ptr },	// *value
		{ encoding: this.Atom },			// encoding
		{ format: this.int },				// format
		{ nitems: this.unsigned_long }		// nitems
	]);
	
};

var x11Init = function() {
	var self = this;
	
	this.IS64BIT = is64bit;
	
	this.TYPE = new xlibTypes();
	
	// CONSTANTS
	// XAtom.h - https://github.com/simonkwong/Shamoov/blob/64aa8d3d0f69710db48691f69440ce23eeb41ad0/SeniorTeamProject/Bullet/btgui/OpenGLWindow/optionalX11/X11/Xatom.h
	// xlib.py - https://github.com/hazelnusse/sympy-old/blob/65f802573e5963731a3e7e643676131b6a2500b8/sympy/thirdparty/pyglet/pyglet/window/xlib/xlib.py#L88
	this.CONST = {
		AnyPropertyType: 0,
		BadAtom: 5,
		BadValue: 2,
		BadWindow: 3,
		False: 0,
		IsUnmapped: 0,
		IsUnviewable: 1,
		IsViewable: 2,
		None: 0,
		Success: 0,
		True: 1,
		XA_ATOM: 4,
		XA_CARDINAL: 6,
		XA_WINDOW: 33
	};
	
	var _lib = {}; // cache for lib
	var lib = function(path) {
		//ensures path is in lib, if its in lib then its open, if its not then it adds it to lib and opens it. returns lib
		//path is path to open library
		//returns lib so can use straight away

		if (!(path in _lib)) {
			//need to open the library
			//default it opens the path, but some things are special like libc in mac is different then linux or like x11 needs to be located based on linux version
			switch (path) {
				case 'gdk2':
				
						_lib[path] = ctypes.open('libgdk-x11-2.0.so.0');
				
					break;
				case 'gdk3':
				
						_lib[path] = ctypes.open('libgdk-3.so.0');
				
					break;
				case 'gtk2':
				
						_lib[path] = ctypes.open('libgtk-x11-2.0.so.0');
				
					break;
				case 'libc':

						switch (core.os.name) {
							case 'darwin':
								_lib[path] = ctypes.open('libc.dylib');
								break;
							case 'freebsd':
								_lib[path] = ctypes.open('libc.so.7');
								break;
							case 'openbsd':
								_lib[path] = ctypes.open('libc.so.61.0');
								break;
							case 'android':
							case 'sunos':
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
								_lib[path] = ctypes.open('libc.so');
								break;
							case 'linux':
								_lib[path] = ctypes.open('libc.so.6');
								break;
							case 'gnu/kfreebsd': // physically unverified
								lib = ctypes.open('libc.so.0.1');
								break;
							default:
								throw new Error({
									name: 'api-error',
									message: 'Path to libc on operating system of , "' + OS.Constants.Sys.Name + '" is not supported'
								});
						}

					break;
				case 'x11':

						switch (core.os.name) {
							case 'darwin': // physically unverified
								_lib[path] = ctypes.open('libX11.dylib');
								break;
							case 'freebsd': // physically unverified
								_lib[path] = ctypes.open('libX11.so.7');
								break;
							case 'openbsd': // physically unverified
								_lib[path] = ctypes.open('libX11.so.61.0');
								break;
							case 'sunos': // physically unverified
							case 'netbsd': // physically unverified
							case 'dragonfly': // physcially unverified
								_lib[path] = ctypes.open('libX11.so');
								break;
							case 'linux':
								_lib[path] = ctypes.open('libX11.so.6');
								break;
							case 'gnu/kfreebsd': // physically unverified
								lib = ctypes.open('libX11.so.0.1');
								break;
							default:
								throw new Error({
									name: 'api-error',
									message: 'Path to libX11 on operating system of , "' + OS.Constants.Sys.Name + '" is not supported'
								});
						}

					break;
				default:
					try {
						_lib[path] = ctypes.open(path);
					} catch (ex) {
						throw new Error({
							name: 'addon-error',
							message: 'Could not open ctypes library path of "' + path + '"',
							ex_msg: ex.message
						});
					}
			}
		}
		return _lib[path];
	};
	
	// start - function declares
	var _api = {};
	this.API = function(declaration) { // it means ensureDeclared and return declare. if its not declared it declares it. else it returns the previously declared.
		if (!(declaration in _api)) {
			_api[declaration] = preDec[declaration](); //if declaration is not in preDec then dev messed up
		}
		return _api[declaration];
	};
	
	// start - predefine your declares here
	var preDec = { //stands for pre-declare (so its just lazy stuff) //this must be pre-populated by dev // do it alphabateized by key so its ez to look through
		gtk_widget_get_window: function() {
			/* https://developer.gnome.org/gtk3/stable/GtkWidget.html#gtk-widget-get-window
			 * GdkWindow *gtk_widget_get_window (
			 *   GtkWidget *widget
			 * );
			 */
			return lib('gtk2').declare('gtk_widget_get_window', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// *return
				self.TYPE.GtkWidget.ptr		// *widget
			);
		},
		gdk_x11_drawable_get_xid: function() {
			/* https://developer.gnome.org/gdk2/stable/gdk2-X-Window-System-Interaction.html#gdk-x11-drawable-get-xid
			 * XID gdk_x11_drawable_get_xid (
			 *   GdkDrawable *drawable
			 * );
			 */
			return lib('gdk2').declare('gdk_x11_drawable_get_xid', self.TYPE.ABI,
				self.TYPE.XID,				// return
				self.TYPE.GdkDrawable.ptr	// *drawable
			);
		},
		gdk_window_get_user_data: function() {
			/* https://developer.gnome.org/gdk3/stable/gdk3-Windows.html#gdk-window-get-user-data
			 * void gdk_window_get_user_data (
			 *   GdkWindow *window,
			 *   gpointer *data
			 * );
			 */
			return lib('gdk2').declare('gdk_window_get_user_data', self.TYPE.ABI,
				self.TYPE.void,				// return
				self.TYPE.GdkWindow.ptr,	// *window
				self.TYPE.gpointer.ptr		// *data
			);
		},
		gdk_x11_window_lookup_for_display: function() {
			/* https://developer.gnome.org/gdk2/stable/gdk2-X-Window-System-Interaction.html#gdk-x11-window-lookup-for-display
			 * GdkWindow *gdk_x11_window_lookup_for_display (
			 *   GdkDisplay *display,
			 *   Window window
			 * );
			 */
			return lib('gdk2').declare('gdk_x11_window_lookup_for_display', self.TYPE.ABI,
				self.TYPE.GdkWindow.ptr,	// *return
				self.TYPE.GdkDisplay.ptr,	// *display
				self.TYPE.Window			// window
			);
		},
		memcpy: function() {
			/* http://linux.die.net/man/3/memcpy
			 * void *memcpy (
			 *   void *dest,
			 *   const void *src,
			 *   size_t n
			 * );
			 */
			return lib('libc').declare('memcpy', self.TYPE.ABI,
				self.TYPE.void,		// return
				self.TYPE.void.ptr,	// *dest
				self.TYPE.void.ptr,	// *src
				self.TYPE.size_t	// count
			);
		},
		XDefaultRootWindow: function() {
			/* http://www.xfree86.org/4.4.0/DefaultRootWindow.3.html
			 * Window DefaultRootWindow(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XDefaultRootWindow', self.TYPE.ABI,
				self.TYPE.Window,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XDefaultScreen: function() {
			/* int XDefaultScreen(
			 *   Display *display;
			 * )
			 */
			return lib('x11').declare('XDefaultScreen', self.TYPE.ABI,
				self.TYPE.int,			// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XDefaultScreenOfDisplay: function() {
			/* http://www.xfree86.org/4.4.0/DefaultScreenOfDisplay.3.html
			 * Screen *XDefaultScreenOfDisplay(
			 *   Display *display;
			 * )
			 */
			return lib('x11').declare('XDefaultScreenOfDisplay', self.TYPE.ABI,
				self.TYPE.Screen.ptr,		// return
				self.TYPE.Display.ptr		// *display
			);
		},
		XHeightOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/HeightOfScreen.3.html
			 * int HeightOfScreen(
			 *   Screen	*screen 
			 * );
			 */
			return lib('x11').declare('XHeightOfScreen', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Screen.ptr	// *screen
			);
		},
		XWidthOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/WidthOfScreen.3.html
			 * int WidthOfScreen(
			 *   Screen	*screen 
			 * );
			 */
			return lib('x11').declare('XWidthOfScreen', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Screen.ptr	// *screen
			);
		},
		XCloseDisplay: function() {
			/* http://www.xfree86.org/4.4.0/XCloseDisplay.3.html
			 * int XCloseDisplay(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XCloseDisplay', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XFlush: function() {
			/* http://www.xfree86.org/4.4.0/XFlush.3.html
			 * int XFlush(
			 *   Display	*display
			 * );
			 */
			return lib('x11').declare('XFlush', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.Display.ptr	// *display
			);
		},
		XFree: function() {
			/* http://www.xfree86.org/4.4.0/XFree.3.html
			 * int XFree(
			 *   void	*data
			 * );
			 */
			return lib('x11').declare('XFree', self.TYPE.ABI,
				self.TYPE.int,		// return
				self.TYPE.void.ptr	// *data
			);
		},
		XGetGeometry: function() {
			/* http://www.xfree86.org/4.4.0/XGetGeometry.3.html
			 * Status XGetGeometry(
			 *   Display 		*display,
			 *   Drawable		d,
			 *   Window			*root_return,
			 *   int			*x_return,
			 *   int			*y_return,
			 *   unsigned int	*width_return,
			 *   unsigned int	*height_return,
			 *   unsigned int	*border_width_return,
			 *   unsigned int	*depth_return
			 * );
			 */
			return lib('x11').declare('XGetGeometry', self.TYPE.ABI,
				self.TYPE.Status,			// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Drawable,			// d
				self.TYPE.Window.ptr,		// *root_return
				self.TYPE.int.ptr,			// *x_return
				self.TYPE.int.ptr,			// *y_return
				self.TYPE.unsigned_int.ptr,	// *width_return
				self.TYPE.unsigned_int.ptr,	// *height_return
				self.TYPE.unsigned_int.ptr,	// *border_width_return
				self.TYPE.unsigned_int.ptr	// *depth_return
			); 
		},
		XGetWindowAttributes: function() {
			/* http://www.xfree86.org/4.4.0/XGetWindowAttributes.3.html
			 * Status XGetWindowAttributes(
			 *   Display			*display,
			 *   Window 			w,
			 *   XWindowAttributes	*window_attributes_return
			 * );
			 */
			return lib('x11').declare('XGetWindowAttributes', self.TYPE.ABI,
				self.TYPE.Status,				// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,				// *display_name
				self.TYPE.XWindowAttributes.ptr	// *window_attributes_return
			); 
		},
		XGetWindowProperty: function() {
			/* http://www.xfree86.org/4.4.0/XGetWindowProperty.3.html
			 * int XGetWindowProperty(
			 *   Display		*display,
			 *   Window			w,
			 *   Atom			property,
			 *   long			long_offset,
			 *   long			long_length,
			 *   Bool			delete,
			 *   Atom			req_type,
			 *   Atom			*actual_type_return,
			 *   int			*actual_format_return,
			 *   unsigned long	*nitems_return,
			 *   unsigned long	*bytes_after_return,
			 *   unsigned char	**prop_return
			 * );
			 */
			return lib('x11').declare('XGetWindowProperty', self.TYPE.ABI,
				self.TYPE.int,					// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,					// w
				self.TYPE.Atom,					// property
				self.TYPE.long,					// long_offset
				self.TYPE.long,					// long_length
				self.TYPE.Bool,					// delete
				self.TYPE.Atom,					// req_type
				self.TYPE.Atom.ptr,				// *actual_type_return
				self.TYPE.int.ptr,				// *actual_format_return
				self.TYPE.unsigned_long.ptr,		// *nitems_return
				self.TYPE.unsigned_long.ptr,		// *bytes_after_return
				self.TYPE.unsigned_char.ptr.ptr	// **prop_return
			);
		},
		XGetWMName: function() {
			/* http://www.xfree86.org/4.4.0/XGetWMName.3.html
			 * Status XGetWMName(
			 *   Display		*display,
			 *   Window			w,
			 *   XTextProperty	*text_prop_return 
			 * );
			 */
			 return lib('x11').declare('XGetWMName', self.TYPE.ABI,
				self.TYPE.Status,				// return
				self.TYPE.Display.ptr,			// *display
				self.TYPE.Window,				// w
				self.TYPE.XTextProperty.ptr		// *text_prop_return
			);
		},
		XInternAtom: function() {
			/* http://www.xfree86.org/4.4.0/XInternAtom.3.html
			 * Atom XInternAtom(
			 *   Display	*display,
			 *   char		*atom_name,
			 *   Bool		only_if_exists
			 * );
			 */
			 return lib('x11').declare('XInternAtom', self.TYPE.ABI,
				self.TYPE.Atom,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.char.ptr,		// *atom_name
				self.TYPE.Bool			// only_if_exists
			);
		},
		XOpenDisplay: function() {
			/* http://www.xfree86.org/4.4.0/XOpenDisplay.3.html
			 * Display *XOpenDisplay(
			 *   char	*display_name
			 * );
			 */
			return lib('x11').declare('XOpenDisplay', self.TYPE.ABI,
				self.TYPE.Display.ptr,	// return
				self.TYPE.char.ptr		// *display_name
			); 
		},
		XQueryTree: function() {
			/* http://www.xfree86.org/4.4.0/XQueryTree.3.html
			 * Status XQueryTree(
			 *   Display		*display,
			 *   Window			w,
			 *   Window			*root_return,
			 *   Window			*parent_return,
			 *   Window			**children_return,
			 *   unsigned int	*nchildren_return
			 * );
			 */
			return lib('x11').declare('XQueryTree', self.TYPE.ABI,
				self.TYPE.Status,				// return
				self.TYPE.Display.ptr,		// *display
				self.TYPE.Window,				// w
				self.TYPE.Window.ptr,			// *root_return
				self.TYPE.Window.ptr,			// *parent_return
				self.TYPE.Window.ptr.ptr,		// **children_return
				self.TYPE.unsigned_int.ptr	// *nchildren_return
			); 
		},
		XTranslateCoordinates: function() {
			/* http://www.xfree86.org/4.4.0/XTranslateCoordinates.3.html
			 * Bool XTranslateCoordinates(
			 *   Display	*display,
			 *   Window		src_w,
			 *   Window		dest_w,
			 *   int		src_x,
			 *   int		src_y,
			 *   int		*dest_x_return,
			 *   int		*dest_y_return,
			 *   Window		*child_return
			 * );
			 */
			return lib('x11').declare('XTranslateCoordinates', self.TYPE.ABI,
				self.TYPE.Bool,			// return
				self.TYPE.Display.ptr,	// *display
				self.TYPE.Window,			// src_w
				self.TYPE.Window,			// dest_w
				self.TYPE.int,			// src_x
				self.TYPE.int,			// src_y
				self.TYPE.int.ptr,		// *dest_x_return
				self.TYPE.int.ptr,		// *dest_y_return
				self.TYPE.Window.ptr		// *child_return
			); 
		},
		XAllPlanes: function() {
			/* http://tronche.com/gui/x/xlib/display/display-macros.html
			 * unsigned long XAllPlanes()
			 */
			return lib('x11').declare('XAllPlanes', self.TYPE.ABI,
				self.TYPE.unsigned_long	// return
			);
		},
		XGetImage: function() {
			/* http://www.xfree86.org/4.4.0/XGetImage.3.html
			 * XImage *XGetImage (
			 *   Display *display,
			 *   Drawable d,
			 *   int x,
			 *   int y,
			 *   unsigned int width,
			 *   unsigned int height,
			 *   unsigned long plane_mask,
			 *   int format
			 * ); 
			 */
			return lib('x11').declare('XGetImage', self.TYPE.ABI,
				self.TYPE.XImage.ptr,		// return
				self.TYPE.Display.ptr,		// *display,
				self.TYPE.Drawable,			// d,
				self.TYPE.int,				// x,
				self.TYPE.int,				// y,
				self.TYPE.unsigned_int,		// width,
				self.TYPE.unsigned_int,		// height,
				self.TYPE.unsigned_long,	// plane_mask,
				self.TYPE.int				// format
			);
		}
	};
	// end - predefine your declares here
	// end - function declares

	this.MACRO = { // http://tronche.com/gui/x/xlib/display/display-macros.html
		DefaultRootWindow: function() {
			/* The DefaultRootWindow macro returns the root window for the default screen. 
			 * Argument `display` specifies the connection to the X server.
			 * Returns the root window for the default screen.
			 * http://www.xfree86.org/4.4.0/DefaultRootWindow.3.html
			 * Window DefaultRootWindow(
			 *   Display	*display
			 * );
			 */
			return self.API('XDefaultRootWindow');
		},
		DefaultScreenOfDisplay: function() {
			/* http://www.xfree86.org/4.4.0/DefaultScreenOfDisplay.3.html
			 * Screen *DefaultScreenOfDisplay(
			 *   Display	*display
			 * );
			 */
			return self.API('XDefaultScreenOfDisplay');
		},
		HeightOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/HeightOfScreen.3.html
			 * int HeightOfScreen(
			 *   Screen	*screen 
			 * );
			 */
			return self.API('XHeightOfScreen');
		},
		WidthOfScreen: function() {
			/* http://www.xfree86.org/4.4.0/WidthOfScreen.3.html
			 * int WidthOfScreen(
			 *   Screen	*screen 
			 * );
			 */
			return self.API('XWidthOfScreen');
		},
		DefaultScreen: function() {
			/* The DefaultScreen macro returns the default screen number referenced in the XOpenDisplay routine.
			 * Argument `display` specifies the connection to the X server. 
			 * Return the default screen number referenced by the XOpenDisplay() function. This macro or function should be used to retrieve the screen number in applications that will use only a single screen. 
			 * http://www.xfree86.org/4.4.0/DefaultScreen.3.html
			 * int DefaultScreen(
			 *   Display *display
			 * );
			 */
			return self.API('XDefaultScreen');
		},
		DefaultScreenOfDisplay: function() {
			/* The DefaultScreenOfDisplay macro returns the default screen of the specified display. 
			 * Argument `display` specifies the connection to the X server. 
			 * Return a pointer to the default screen. 
			 * http://www.xfree86.org/4.4.0/DefaultScreenOfDisplay.3.html
			 * Screen *DefaultScreenOfDisplay(
			 *   Display *display
			 * ); 
			 */
			return self.API('XDefaultScreenOfDisplay')();
		}
	};
	
	this._cache = {};
	
	this.HELPER = {
		gdkWinPtrToXID: function(aGDKWindowPtr) {
			var GdkDrawPtr = ctypes.cast(aGDKWindowPtr, self.TYPE.GdkDrawable.ptr);
			var xidOfWin = self.API('gdk_x11_drawable_get_xid')(GdkDrawPtr);
			return xidOfWin;
		},
		gdkWinPtrToGtkWinPtr: function(aGDKWindowPtr) {
			var gptr = self.TYPE.gpointer();
			self.API('gdk_window_get_user_data')(aGDKWindowPtr, gptr.address());
			var GtkWinPtr = ctypes.cast(gptr, self.TYPE.GtkWindow.ptr);
			return GtkWinPtr;
		},
		gtkWinPtrToXID: function(aGTKWinPtr) {
			var aGDKWinPtr = self.TYPE.HELPER.gtkWinPtrToGdkWinPtr(aGTKWinPtr);
			var aXID = self.TYPE.HELPER.gdkWinPtrToXID(null, aGDKWinPtr);
			return aXID;
		},
		gtkWinPtrToGdkWinPtr: function(aGTKWinPtr) {
			var gtkWidgetPtr = ctypes.cast(aGTKWinPtr, self.TYPE.GtkWidget.ptr);
			var backTo_gdkWinPtr = self.API('gtk_widget_get_window')(gtkWidgetPtr);
			return backTo_gdkWinPtr;
		},
		xidToGdkWinPtr: function(aXID) {
			// todo: figure out how to use gdk_x11_window_lookup_for_display and switch to that, as apparently gdk_xid_table_lookup was deprecated since 2.24
			var aGpointer = self.API('gdk_xid_table_lookup')(aXID);
			var aGDKWinPtr = ctypes.cast(aGpointer, self.TYPE.GdkWindow.ptr);
			return aGDKWinPtr;
		},
		xidToGtkWinPtr: function(aXID) {
			var aGDKWinPtr = self.HELPER.xidToGdkWinPtr(aXID);
			var aGTKWinPtr = self.HELPER.gdkWinPtrToGtkWinPtr(aGDKWinPtr);
			return aGTKWinPtr;
		},
		mozNativeHandlToGdkWinPtr: function(aMozNativeHandlePtrStr) {
			var GdkWinPtr = self.TYPE.GdkWindow.ptr(ctypes.UInt64(aMozNativeHandlePtrStr));
			return GdkWinPtr;
		},
		mozNativeHandlToGtkWinPtr: function(aMozNativeHandlePtrStr) {
			GdkWinPtr = self.HELPER.mozNativeHandlToGdkWinPtr(aMozNativeHandlePtrStr);
			var GtkWinPtr = self.HELPER.gdkWinPtrToGtkWinPtr(GdkWinPtr);
			/*
			var gptr = self.TYPE.gpointer();
			self.API('gdk_window_get_user_data')(GdkWinPtr, gptr.address());
			var GtkWinPtr = ctypes.cast(gptr, self.TYPE.GtkWindow.ptr);
			*/
			return GtkWinPtr;
		},
		mozNativeHandlToXID: function(aMozNativeHandlePtrStr) {
			GdkWinPtr = self.TYPE.mozNativeHandlToGdkWinPtr(aMozNativeHandlePtrStr);
			var xid = self.HELPER.gdkWinPtrToXID(GdkWinPtr);
			return GtkWinPtr;
		},
		cachedDefaultRootWindow: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultRootWindow)  {
				self._cache.DefaultRootWindow = self.MACRO.DefaultRootWindow()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultRootWindow;
		},
		cachedDefaultScreen: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultScreen)  {
				self._cache.DefaultScreen = self.MACRO.DefaultScreen()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultScreen;
		},
		cachedDefaultScreenOfDisplay: function(refreshCache/*, disp*/) {
			if (refreshCache || !self._cache.DefaultScreenOfDisplay)  {
				self._cache.DefaultScreenOfDisplay = self.MACRO.DefaultScreenOfDisplay()(/*disp*/self.HELPER.cachedXOpenDisplay());
			}
			return self._cache.DefaultScreenOfDisplay;
		},
		cachedXOpenDisplay: function(refreshCache) {
			if (refreshCache || !self._cache.XOpenDisplay)  {
				self._cache.XOpenDisplay = self.API('XOpenDisplay')(null);
			}
			return self._cache.XOpenDisplay;
		},
		ifOpenedXCloseDisplay: function() {
			if (self._cache.XOpenDisplay) {
				self.API('XCloseDisplay')(self._cache.XOpenDisplay);
			}
		}
	};
};
var ostypes = new x11Init();

// ok use it


function shootAllMons() {
	// https://github.com/BoboTiG/python-mss/blob/a4d40507c492962d59fcb97a509ede1f4b8db634/mss.py#L116
	// https://github.com/BoboTiG/python-mss/blob/a4d40507c492962d59fcb97a509ede1f4b8db634/mss.py#L116
	
	
	// enum_display_monitors
	// this call to XGetWindowAttributes grab one screenshot of all monitors
	var gwa = ostypes.TYPE.XWindowAttributes();
	var rez_XGetWinAttr = ostypes.API('XGetWindowAttributes')(ostypes.HELPER.cachedXOpenDisplay(), ostypes.HELPER.cachedDefaultRootWindow(), gwa.address());
	console.info('gwa:', gwa.toString());
	
	var fullWidth = cutils.jscGetDeepest(gwa.width);
	var fullHeight = cutils.jscGetDeepest(gwa.height);
	var originX = cutils.jscGetDeepest(gwa.x);
	var originY = cutils.jscGetDeepest(gwa.y);
	
	console.info('fullWidth:', fullWidth, 'fullHeight:', fullHeight, 'originX:', originX, 'originY:', originY, '_END_');
	
	// get_pixels
	var allplanes = ostypes.API('XAllPlanes')();
	console.info('allplanes:', allplanes.toString());
	
	var ZPixmap = 2;
	
	// Fix for XGetImage:
	// expected LP_Display instance instead of LP_XWindowAttributes
	// console.info('ostypes.HELPER.cachedDefaultRootWindow():', ostypes.HELPER.cachedDefaultRootWindow().toString());
	// var rootAsDisp = ctypes.cast(ostypes.HELPER.cachedDefaultRootWindow(), ostypes.TYPE.Drawable.ptr);
	
	var ximage = ostypes.API('XGetImage')(ostypes.HELPER.cachedXOpenDisplay(), ostypes.HELPER.cachedDefaultRootWindow(), originX, originY, fullWidth, fullHeight, allplanes, ZPixmap);
	console.info('ximage:', ximage.toString());
	
}

try {
	shootAllMons();
} finally {
	ostypes.HELPER.ifOpenedXCloseDisplay();
}