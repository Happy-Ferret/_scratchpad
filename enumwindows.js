//https://github.com/nightwing/foximirror/blob/f40afb12beb512fb1d453afa028bc94c53f9326b/ctypes.picker.js#L8
Cu.import('resource://gre/modules/ctypes.jsm');
var lib = {
  user32: ctypes.open('user32.dll')
}

var DWORD = ctypes.uint32_t;
var HANDLE = ctypes.size_t;
var HWND = HANDLE;
var BOOL = ctypes.bool;
var LPARAM = ctypes.size_t;
var LPTSTR = ctypes.jschar.ptr;

var CallBackABI;
var WinABI;
if (ctypes.size_t.size == 8) {
  CallBackABI = ctypes.default_abi;
  WinABI = ctypes.default_abi;
} else {
  CallBackABI = ctypes.stdcall_abi;
  WinABI = ctypes.winapi_abi;
}

var EnumWindowsProc = ctypes.FunctionType(CallBackABI, BOOL, [HWND, LPARAM]);
var EnumWindows = lib.user32.declare('EnumWindows', WinABI, BOOL, EnumWindowsProc.ptr, LPARAM);
var EnumChildWindows = lib.user32.declare('EnumChildWindows', WinABI, BOOL, HWND, EnumWindowsProc.ptr, LPARAM);
var GetClassName = lib.user32.declare('GetClassNameW', WinABI, ctypes.int, HWND, LPTSTR, ctypes.int);


/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms633522%28v=vs.85%29.aspx
* DWORD WINAPI GetWindowThreadProcessId(
* __in_ HWND hWnd,
* __out_opt_ LPDWORD lpdwProcessId
* );
*/
var GetWindowThreadProcessId = lib.user32.declare('GetWindowThreadProcessId', ctypes.winapi_abi, ctypes.unsigned_long, //DWORD
  ctypes.uint32_t, //HWND
  ctypes.uint32_t.ptr //LPDWORD
);

/* http://msdn.microsoft.com/en-us/library/ms633539%28v=vs.85%29.aspx
* BOOL WINAPI SetForegroundWindow(
* __in HWND hWnd
* );
*/
var SetForegroundWindow = user32.declare('SetForegroundWindow', ctypes.winapi_abi, ctypes.bool,
  ctypes.voidptr_t
);

// code to run it

function getRunningPids() {
  //returns an array of pids of running firefox instances
  var ffPids = {};
  var PID = new DWORD;
  var buf = new new ctypes.ArrayType(ctypes.jschar, 255);
  
  var SearchPD = function(hwnd, lParam) {    
    GetClassName(hwnd, buf, 255);
    var className = buf.readString();
    if (className == 'MozillaWindowClass') {
        var rez = GetWindowThreadProcessId(hwnd, PID.address());
        ffPids[PID.value] = 0;
    };
    return true; //let enum continue till nothing to enum
  }
  
  SearchPD_ptr = EnumWindowsProc.ptr(SearchPD);
  var wnd = LPARAM(0);
  console.time('EnumWindows');
  EnumWindows(SearchPD_ptr, ctypes.cast(wnd.address(), LPARAM));
  console.timeEnd('EnumWindows');
  
  return Object.keys(ffPids);
  
}

console.time('getRunningPids');
var pids = getRunningPids();
console.timeEnd('getRunningPids');
console.log('pids:', pids);

for (var l in lib) {
  lib[l].close();
}