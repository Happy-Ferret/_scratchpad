Cu.import('resource://gre/modules/ctypes.jsm');
let objc = ctypes.open(ctypes.libraryName('objc'));

/** START - edit these **/
let jsStrPath = '/Users/noi/Desktop/default profile.app';
/** END - edit these **/

let id = ctypes.voidptr_t;
let objc_selector = new ctypes.StructType('objc_selector');
let SEL = objc_selector.ptr;

let objc_getClass = objc.declare('objc_getClass', ctypes.default_abi, id, ctypes.char.ptr);
let sel_registerName = objc.declare('sel_registerName', ctypes.default_abi, SEL, ctypes.char.ptr);
let objc_msgSend = objc.declare('objc_msgSend', ctypes.default_abi, id, id, SEL, '...');

// commonly used stuff: // whats a better word then "stuff", "functions"?
let alloc = sel_registerName('alloc');
let init = sel_registerName('init');

// notificationName_**** = [[NSString alloc] initWithUTF8String: 'com.apple.****']; //copied block: `// pool = [[NSAutoreleasePool alloc] init]`
let NSString = objc_getClass('NSString');
let initWithUTF8String = sel_registerName('initWithUTF8String:');
//let notificationName_SSStopped = objc_msgSend(objc_msgSend(NSString, alloc), initWithUTF8String, ctypes.char.array()('com.apple.screensaver.didstop'));
//let notificationName_SLocked = objc_msgSend(objc_msgSend(NSString, alloc), initWithUTF8String, ctypes.char.array()('com.apple.screenIsLocked'));
//let notificationName_SUnlocked = objc_msgSend(objc_msgSend(NSString, alloc), initWithUTF8String, ctypes.char.array()('com.apple.screenIsUnlocked'));

//im just guessing we have to get `notificationCenter` because with `setApplicationIconImage` he took it to `sharedApplication` first, i need to learn how to recognize if it should go to something like this though
// NSDistCent = [NSDistributedNotificationCenter defaultCenter]; // copied block: `// NSApp = [NSApplication sharedApplication];`
let NSDistributedNotificationCenter = objc_getClass('NSDistributedNotificationCenter');
let defaultCenter = sel_registerName('defaultCenter');
let NSDistCent = objc_msgSend(NSDistributedNotificationCenter, defaultCenter);

//create notificationObserver's
////////////////start - seriously confused
let NSNotification = objc_getClass('NSNotification'); // im not sure if i need this
let objc_msgSend_NSNotification = objc.declare('objc_msgSend', ctypes.default_abi, NSNotification, id, SEL, '...'); //this is return value // im not sure if i need this

//start - onScreenSaverStarted
// trying to make this: http://mxr.mozilla.org/chromium/source/src/chrome/browser/idle_mac.mm#57
let notificationObserver_onScreenSaverStarted = objc_msgSend(objc_msgSend(NSNotification, alloc), init); // the guy here does alloc and init: https://github.com/Noitidart/js-macosx/blob/notificationCenter/bootstrap.js#L91
//maybe instead try this:
// from here: https://github.com/mkiol/GNotifier/blob/06dad9814d2ac842c359152950b1122874aff2b2/lib/osx.js#L90
let jsCallback_notificationObserver_onScreenSaverStarted = (x, y, z){
	console.log('TRIGGERED: onScreenSaverStarted');
	return true;
}

let notificationObserver_onScreenSaverStarted = ctypes.FunctionType( ctypes.default_abi, ctypes.bool, [id, SEL, id] );
let callback_notificationObserver_onScreenSaverStarted = fType.ptr( jsCallback_notificationObserver_onScreenSaverStarted );
////////////////end - seriously confused

let NSString_notificationSelector_onScreenSaverStarted = objc_msgSend(objc_msgSend(NSString, alloc), initWithUTF8String, ctypes.char.array()('onScreenSaverStarted:'));
let notificationSelector_onScreenSaverStarted = sel_registerName(NSString_notificationSelector_onScreenSaverStarted); // because of description here: https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Miscellaneous/Foundation_Functions/index.html#//apple_ref/c/func/NSSelectorFromString  and because this is how js-macosx demo sets selector here: https://github.com/Noitidart/js-macosx/blob/notificationCenter/bootstrap.js#L91

let notificationName_onScreenSaverStarted = objc_msgSend(objc_msgSend(NSString, alloc), initWithUTF8String, ctypes.char.array()('com.apple.screensaver.didstart'));
//end - onScreenSaverStarted

// [NSDistCent addObserver:selector:name:object: ***, ***, notificationName_****, nil] // copied block: `// [NSApp setApplicationIconImage: icon]`
let addObserver = sel_registerName('addObserver:selector:name:object:')
/*var rez_addObserver = */objc_msgSend(NSDistCent, addObserver, notificationObserver_onScreenSaverStarted, notificationSelector_onScreenSaverStarted, notificationName_onScreenSaverStarted, null); // addObserver returns void so no need for `var rez_addObserver = `

// [NSDistCent removeObserver:name:object: notificationName_****, nil] // copied block: `// [NSApp setApplicationIconImage: icon]`
let removeObserver = sel_registerName('removeObserver:name:object:')
/*var rez_removeObserver = */objc_msgSend(NSDistCent, removeObserver, notificationName_onScreenSaverStarted, null);





// [notificationName_**** release]
let release = sel_registerName('release');
objc_msgSend(notificationName_onScreenSaverStarted, release);

objc.close();
