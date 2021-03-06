Cu.import('resource://gre/modules/ctypes.jsm');

var gio = ctypes.open('libgio-2.0.so.0');

// BASIC TYPES
var TYPES = {
	gchar: ctypes.char,
	gint: ctypes.int,
	GAppInfo: ctypes.StructType('GAppInfo'),
	GAppLaunchContext: ctypes.StructType('GAppLaunchContext'),
	GDesktopAppInfo: ctypes.StructType('GDesktopAppInfo'),
	GList: new ctypes.StructType('GList', [
		{'data': ctypes.voidptr_t},
		{'next': ctypes.voidptr_t},
		{'prev': ctypes.voidptr_t}
	]),
	GQuark: ctypes.uint32_t
};

// ADVANCED TYPES
TYPES.gboolean = TYPES.gint;
TYPES.GError = new ctypes.StructType('GError', [
	{'domain': TYPES.GQuark},
	{'code': ctypes.int},
	{'message': ctypes.char.ptr}
]);

// FUNCTIONS
/* https://developer.gnome.org/gio/unstable/gio-Desktop-file-based-GAppInfo.html#g-desktop-app-info-new-from-filename
 * GDesktopAppInfo * g_desktop_app_info_new_from_filename(
 *   const char *filename
 * );
 */
var new_from_filename = gio.declare('g_desktop_app_info_new_from_filename', ctypes.default_abi,
	TYPES.GDesktopAppInfo.ptr,	// return
	TYPES.gchar.ptr				// *filename
);

/* https://developer.gnome.org/gio/unstable/GAppInfo.html#g-app-info-launch-uris
 * gboolean g_app_info_launch_uris (
 *   GAppInfo *appinfo,
 *   GList *uris,
 *   GAppLaunchContext *launch_context,
 *   GError **error
 * );
 */
var launch_uris = gio.declare('g_app_info_launch_uris', ctypes.default_abi,
	TYPES.gboolean,					// return
	TYPES.GAppInfo.ptr,				// *appinfo
	TYPES.GList.ptr,				// *uris
	TYPES.GAppLaunchContext.ptr,	// *launch_context
	TYPES.GError.ptr.ptr			// **error
);

// start - helper functions

// end - helper functions

var shutdown = function() {
    
    gio.close();
    console.log('succesfully shutdown');
}

function main() {
	var jsStr_pathToDesktopFile = OS.Path.join(OS.Constants.Path.desktopDir, 'Firefox - Profile Manager.desktop');
	var launcher = new_from_filename(OS.Path.join(OS.Constants.Path.desktopDir, jsStr_pathToDesktopFile));
	console.info('launcher:', launcher, launcher.toString(), uneval(launcher));
	
	if (launcher.isNull()) {
		throw new Error('No file exists at path: "' + jsStr_pathToDesktopFile + '"');
	}
	
	launcher = ctypes.cast(launcher, TYPES.GAppInfo.ptr);
	var uris = new TYPES.GList(); // can use `null`
	var launch_context = null; // have to use null due o this explanation here: // cannot use `var launch_context = new TYPES.GAppLaunchContext();` //throws `Error: cannot construct an opaque StructType` so i have to get launch_context from something like `gdk_display_get_app_launch_context` because i dont know he structure to it, and i obviously cannto create opaque structures
	var error = new TYPES.GError.ptr(); // can use `null`

	var rez_launch_uris = launch_uris(launcher, uris.address(), launch_context/*launch_context.address()*/, error.address());
	console.info('rez_launch_uris:', rez_launch_uris, rez_launch_uris.toString(), uneval(rez_launch_uris));
	console.info('error:', error, error.toString(), uneval(error));
}

try {
    main();
} catch (ex) {
    console.error('Error Occured:', ex);
} finally {
    shutdown();
}