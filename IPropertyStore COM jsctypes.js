Cu.import('resource://gre/modules/ctypes.jsm')

var wintypesInit = function() {	
	// BASIC TYPES (ones that arent equal to something predefined by me)
	this.BOOL = ctypes.int;
	this.BOOLEAN = ctypes.char; // http://blogs.msdn.com/b/oldnewthing/archive/2004/12/22/329884.aspx // not used in this jsctypes code but just putting it here as i may need in future search as i have the documentation around this (the blog) in my mind right now and commented it here
	this.DWORD = ctypes.unsigned_long;
	this.HRESULT = ctypes.long;
	this.HWND = ctypes.voidptr_t;
	this.INT = ctypes.int;
	this.LPUNKNOWN = ctypes.voidptr_t; // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm
	this.LPVOID = ctypes.voidptr_t; // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm
	this.PCIDLIST_ABSOLUTE = ctypes.voidptr_t; // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L115
	this.PCWSTR = new ctypes.PointerType(ctypes.jschar); // https://github.com/FunkMonkey/Loomo/blob/06a5881a4f520ede092059a4115bf117568b914f/Loomo/chrome/content/modules/Utils/COM/COM.jsm#L35
	this.PIDLIST_ABSOLUTE = ctypes.voidptr_t; // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L106
	this.ULONG = ctypes.unsigned_long;
	this.VARIANT_BOOL = ctypes.short; //http://msdn.microsoft.com/en-us/library/cc235510.aspx // http://blogs.msdn.com/b/oldnewthing/archive/2004/12/22/329884.aspx
	this.VARTYPE = ctypes.unsigned_short;
	this.VOID = ctypes.void_t;
	this.VOIDPTR = ctypes.voidptr_t
	this.WCHAR = ctypes.jschar;
	this.WIN32_FIND_DATA = ctypes.voidptr_t;
	this.WINOLEAPI = ctypes.voidptr_t; // i guessed on this one
	this.WORD = ctypes.unsigned_short;
	
	// ADVANCED TYPES (ones that are based on the basic types)
	this.LPTSTR = new ctypes.PointerType(this.WCHAR);
	this.LPCTSTR = this.LPTSTR;
	this.LPWSTR = new ctypes.PointerType(this.WCHAR);
	this.LPCWSTR = this.LPWSTR;
	this.LPOLESTR = this.LPWSTR;
	this.LPCOLESTR = this.LPOLESTR;
	 
	// BASIC STRUCTURES
	this.GUID = ctypes.StructType('GUID', [ // http://msdn.microsoft.com/en-us/library/ff718266%28v=prot.10%29.aspx
		{ 'Data1': ctypes.unsigned_long },
		{ 'Data2': ctypes.unsigned_short },
		{ 'Data3': ctypes.unsigned_short },
		{ 'Data4': ctypes.char.array(8) }
	]);
	
	// ADVANCED STRUCTURES
	this.IID = this.GUID; // http://msdn.microsoft.com/en-us/library/cc237652%28v=prot.13%29.aspx
	this.REFIID = new ctypes.PointerType(this.IID); // http://msdn.microsoft.com/en-us/library/cc237816%28v=prot.13%29.aspx
	
	this.CLSID = this.GUID; // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L52
	this.REFCLSID = new ctypes.PointerType(this.CLSID); // https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L53
	
	/* http://msdn.microsoft.com/en-us/library/windows/desktop/bb773381%28v=vs.85%29.aspx
	* typedef struct {
	*   GUID  fmtid;
	*   DWORD pid;
	* } PROPERTYKEY;
	*/
	this.PROPERTYKEY = ctypes.StructType('PROPERTYKEY', [
		{ 'fmtid': this.GUID },
		{ 'pid': this.DWORD }
	]);
	this.REFPROPERTYKEY = new ctypes.PointerType(this.PROPERTYKEY);	
	
	/* http://msdn.microsoft.com/en-us/library/windows/desktop/bb773381%28v=vs.85%29.aspx
	* typedef struct PROPVARIANT {
	*   VARTYPE vt;
	*   WORD    wReserved1;
	*   WORD    wReserved2;
	*   WORD    wReserved3;
	*   union {
	*     CHAR              cVal;
	*     UCHAR             bVal;
	*     SHORT             iVal;
	*     USHORT            uiVal;
	*     LONG              lVal;
	*     ULONG             ulVal;
	*     INT               intVal;
	*     UINT              uintVal;
	*     LARGE_INTEGER     hVal;
	*     ULARGE_INTEGER    uhVal;
	*     FLOAT             fltVal;
	*     DOUBLE            dblVal;
	*     VARIANT_BOOL      boolVal;
	*     SCODE             scode;
	*     CY                cyVal;
	*     DATE              date;
	*     FILETIME          filetime;
	*     CLSID             *puuid;
	*     CLIPDATA          *pclipdata;
	*     BSTR              bstrVal;
	*     BSTRBLOB          bstrblobVal;
	*     BLOB              blob;
	*     LPSTR             pszVal;
	*     LPWSTR            pwszVal;
	*     IUnknown          *punkVal;
	*     IDispatch         *pdispVal;
	*     IStream           *pStream;
	*     IStorage          *pStorage;
	*     LPVERSIONEDSTREAM pVersionedStream;
	*     LPSAFEARRAY       parray;
	*     CAC               cac;
	*     CAUB              caub;
	*     CAI               cai;
	*     CAUI              caui;
	*     CAL               cal;
	*     CAUL              caul;
	*     CAH               cah;
	*     CAUH              cauh;
	*     CAFLT             caflt;
	*     CADBL             cadbl;
	*     CABOOL            cabool;
	*     CASCODE           cascode;
	*     CACY              cacy;
	*     CADATE            cadate;
	*     CAFILETIME        cafiletime;
	*     CACLSID           cauuid;
	*     CACLIPDATA        caclipdata;
	*     CABSTR            cabstr;
	*     CABSTRBLOB        cabstrblob;
	*     CALPSTR           calpstr;
	*     CALPWSTR          calpwstr;
	*     CAPROPVARIANT     capropvar;
	*     CHAR              *pcVal;
	*     UCHAR             *pbVal;
	*     SHORT             *piVal;
	*     USHORT            *puiVal;
	*     LONG              *plVal;
	*     ULONG             *pulVal;
	*     INT               *pintVal;
	*     UINT              *puintVal;
	*     FLOAT             *pfltVal;
	*     DOUBLE            *pdblVal;
	*     VARIANT_BOOL      *pboolVal;
	*     DECIMAL           *pdecVal;
	*     SCODE             *pscode;
	*     CY                *pcyVal;
	*     DATE              *pdate;
	*     BSTR              *pbstrVal;
	*     IUnknown          **ppunkVal;
	*     IDispatch         **ppdispVal;
	*     LPSAFEARRAY       *pparray;
	*     PROPVARIANT       *pvarVal;
	*   };
	* } PROPVARIANT;
	*/
	this.PROPVARIANT = ctypes.StructType('PROPVARIANT', [
		{'vt': this.VARTYPE},		// constants for this are available at MSDN: http://msdn.microsoft.com/en-us/library/windows/desktop/aa380072%28v=vs.85%29.aspx
		{'wReserved1': this.WORD},
		{'wReserved2': this.WORD},
		{'wReserved3': this.WORD},
		// union not supported by js-ctypes
		// https://bugzilla.mozilla.org/show_bug.cgi?id=535378 "You can always
		// typecast pointers, at least as long as you know which type is the biggest"
		//note: important: pick one of the below and comment out the others: (because js-ctypes doesnt support union)
		{ 'pwszVal': this.LPWSTR } // for InitPropVariantFromString // when using this see notes on MSDN doc page chat of PROPVARIANT ( http://msdn.microsoft.com/en-us/library/windows/desktop/aa380072%28v=vs.85%29.aspx )this guy says: "VT_LPWSTR must be allocated with CoTaskMemAlloc :: (Presumably this also applies to VT_LPSTR) VT_LPWSTR is described as being a string pointer with no information on how it is allocated. You might then assume that the PROPVARIANT doesn't own the string and just has a pointer to it, but you'd be wrong. In fact, the string stored in a VT_LPWSTR PROPVARIANT must be allocated using CoTaskMemAlloc and be freed using CoTaskMemFree. Evidence for this: Look at what the inline InitPropVariantFromString function does: It sets a VT_LPWSTR using SHStrDupW, which in turn allocates the string using CoTaskMemAlloc. Knowing that, it's obvious that PropVariantClear is expected to free the string using CoTaskMemFree. I can't find this explicitly documented anywhere, which is a shame, but step through this code in a debugger and you can confirm that the string is freed by PropVariantClear: ```#include <Propvarutil.h>	int wmain(int argc, TCHAR *lpszArgv[])	{	PROPVARIANT pv;	InitPropVariantFromString(L"Moo", &pv);	::PropVariantClear(&pv);	}```  If  you put some other kind of string pointer into a VT_LPWSTR PROPVARIANT your program is probably going to crash."
		//{ 'boolVal:', this.VARIANT_BOOL } // for use with InitPropVariantFromBoolean
	]);
	this.REFPROPVARIANT = new ctypes.PointerType(this.PROPVARIANT);
	
	// CONSTANTS
	this.COINIT_APARTMENTTHREADED = 0x2; //https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm
	this.CLSCTX_INPROC_SERVER = 0x1;
	this.S_OK = new this.HRESULT(0); // http://msdn.microsoft.com/en-us/library/windows/desktop/aa378137%28v=vs.85%29.aspx
	this.S_FALSE = new this.HRESULT(1); // http://msdn.microsoft.com/en-us/library/windows/desktop/aa378137%28v=vs.85%29.aspx
	this.VARIANT_FALSE = this.VARIANT_BOOL(0); //http://blogs.msdn.com/b/oldnewthing/archive/2004/12/22/329884.aspx
	this.VARIANT_TRUE = this.VARIANT_BOOL(-1); //http://blogs.msdn.com/b/oldnewthing/archive/2004/12/22/329884.aspx // im not doing new this.VARIANT_BOOL becuase as we see in this shortcut js-ctypes they simply do HRESULT(value) ( https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L389 )
	this.VT_BOOL = 0x000B; // 11
	this.VT_LPWSTR = 0x001F; // 31
}
var ostypes = new wintypesInit();

// start - skeleton, shouldn't have to edit
var lib = {};
function _lib(path) {
	//ensures path is in lib, if its in lib then its open, if its not then it adds it to lib and opens it. returns lib
	//path is path to open library
	//returns lib so can use straight away

	if (!(path in lib)) {
		//need to open the library
		//default it opens the path, but some things are special like libc in mac is different then linux or like x11 needs to be located based on linux version
		switch (path) {
			case 'x11':
				try {
					lib[path] = ctypes.open('libX11.so.6');
				} catch (e) {
					try {
						var libName = ctypes.libraryName('X11');
					} catch (e) {
						console.error('Integration Level 1: Could not get libX11 name; not activating', 'e:' + e);
						throw new Error('Integration Level 1: Could not get libX11 name; not activating, e:' + e);
					}

					try {
						lib[path] = ctypes.open(libName);
					} catch (e) {
						console.error('Integration Level 2: Could not get libX11 name; not activating', 'e:' + e);
						throw new Error('Integration Level 2: Could not get libX11 name; not activating, e:' + e);
					}
				}
				break;
			default:
				try {
					lib[path] = ctypes.open(path);
				} catch (e) {
					console.error('Integration Level 1: Could not get open path:', path, 'e:' + e);
					throw new Error('Integration Level 1: Could not get open path:"' + path + '" e: "' + e + '"');
				}
		}
	}
	return lib[path];
}

var dec = {};
function _dec(declaration) { // it means ensureDeclared and return declare. if its not declared it declares it. else it returns the previously declared.
	if (!(declaration in dec)) {
		dec[declaration] = preDec[declaration](); //if declaration is not in preDec then dev messed up
	}
	return dec[declaration];
}
// end - skeleton, shouldn't have to edit

// start - predefine your declares here
var preDec = { //stands for pre-declare (so its just lazy stuff) //this must be pre-populated by dev // do it alphabateized by key so its ez to look through
	CLSIDFromString: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms680589%28v=vs.85%29.aspx
		 * HRESULT CLSIDFromString(
		 *   __in_ LPCOLESTR lpsz,
		 *   __out_ LPCLSID pclsid
		 * );
		 */
		return _lib('Ole32.dll').declare('CLSIDFromString', ctypes.winapi_abi,
			ostypes.HRESULT,	// return
			ostypes.LPCOLESTR,	// lpsz
			ostypes.GUID.ptr	// pclsid
		); 
	},
	CoCreateInstance: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms686615%28v=vs.85%29.aspx
		 * HRESULT CoCreateInstance(
		 *   __in_   REFCLSID rclsid,
		 *   __in_   LPUNKNOWN pUnkOuter,
		 *   __in_   DWORD dwClsContext,
		 *   __in_   REFIID riid,
		 *   __out_  LPVOID *ppv
		 * );
		 */
		return _lib('Ole32.dll').declare('CoCreateInstance', ctypes.winapi_abi,
			ostypes.HRESULT,	// return
			ostypes.REFCLSID,	// rclsid
			ostypes.LPUNKNOWN,	// pUnkOuter
			ostypes.DWORD,		// dwClsContext
			ostypes.REFIID,		// riid
			ostypes.LPVOID		// *ppv
		);
	},
	CoInitializeEx: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms695279%28v=vs.85%29.aspx
		 * HRESULT CoInitializeEx(
		 *   __in_opt_  LPVOID pvReserved,
		 *   __in_      DWORD dwCoInit
		 * );
		 */
		return _lib('Ole32.dll').declare('CoInitializeEx', ctypes.winapi_abi,
			ostypes.HRESULT,	// result
			ostypes.LPVOID,		// pvReserved
			ostypes.DWORD		// dwCoInit
		);
	},
	CoTaskMemFree: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms680722%28v=vs.85%29.aspx
		 * void CoTaskMemFree(
		 *   __in_opt_  LPVOID pv
		 * );
		 */
		return _lib('Ole32.dll').declare('CoTaskMemFree', ctypes.winapi_abi,
			ostypes.LPVOID	// pv
		);
	},
	CoUninitialize: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms688715%28v=vs.85%29.aspx
		 * void CoUninitialize(void);
		 */
		return _lib('Ole32.dll').declare('CoUninitialize', ctypes.winapi_abi,
			ostypes.VOID	// return
		);
	},
	PropVariantClear: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/aa380073%28v=vs.85%29.aspx
		 * WINOLEAPI PropVariantClear(
		 * __in_ PROPVARIANT *pvar
		 * );
		 */
		return _lib('Ole32.dll').declare('PropVariantClear', ctypes.winapi_abi,
			ostypes.WINOLEAPI,			// return
			ostypes.PROPVARIANT.ptr		// *pvar
		);
	}
	SHGetPropertyStoreForWindow: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/dd378430%28v=vs.85%29.aspx
		 * HRESULT SHGetPropertyStoreForWindow(
		 * __in_ HWND hwnd,
		 * __in_ REFIID riid,
		 * __out_ void **ppv
		 * );
		 */
		return _lib('shell32').declare('SHGetPropertyStoreForWindow', ctypes.winapi_abi,
			ostypes.HRESULT,	// return
			ostypes.HWND,		// hwnd
			ostypes.REFIID,		// riid
			ostypes.VOIDPTR	// **ppv // arai on irc 1/11/2015 // 01:21	noida	hey arrai capella would void** be ctypes.voidptr_t? or ctypes.voidptr_t.ptr? // 01:23	arai	I think they are totally different types, and it should be ctypes.voidptr_t.ptr
			// actually scratch what arai said, like `SHGetPropertyStoreForWindow` third argument is out `void**` the `QueryInterface` also has out argument `void**` and he used `ctypes.voidptr_t` (https://github.com/west-mt/ssbrowser/blob/452e21d728706945ad00f696f84c2f52e8638d08/chrome/content/modules/WindowsShortcutService.jsm#L74)
		);
	},
	SHStrDup: function() {
		/* http://msdn.microsoft.com/en-us/library/windows/desktop/bb759924%28v=vs.85%29.aspx
		* HRESULT SHStrDup(
		* __in_ LPCTSTR pszSource,
		* __out_ LPTSTR *ppwsz
		* );
		*/
		var SHStrDup = _lib('Shlwapi.dll').declare('SHStrDupW', ctypes.winapi_abi,
			ostypes.HRESULT,	// return
			ostypes.LPCTSTR,	// pszSource	// old val from old Gist of mine RelunchCommand@yajd `ctypes.voidptr_t` and the notes from then: // can possibly also make this ctypes.char.ptr // im trying to pass PCWSTR here, i am making it as `ctypes.jschar.array()('blah blah').address()`
			ostypes.LPTSTR.ptr	// *ppwsz	 	// old val from old Gist of mine RelunchCommand@yajd `ctypes.voidptr_t` and the notes from then: // can possibly also make this ctypes.char.ptr
		); 
	}
}
// end - predefine your declares here

// start - helper functions
function checkHRESULT(hr, funcName) {
	if(hr < 0) {
		throw 'HRESULT ' + hr + ' returned from function ' + funcName;
	}
}

/* http://msdn.microsoft.com/en-us/library/windows/desktop/bb762305%28v=vs.85%29.aspx
 * NOTE1: I have to write my own InitPropVariantFromString because its not in a dll its defined in a header
 * I looked at wine's implementation ( https://github.com/wine-mirror/wine/blob/master/include/propvarutil.h#L88 ) and compared
 * it to the usage example on MSDN doc page linked here, and Raymond's example of "I set the PROP­VARIANT manually instead of using Init­Prop­Variant­From­Boolean just to emphasize that the boolVal must be VARIANT_TRUE and not TRUE." ( http://blogs.msdn.com/b/oldnewthing/archive/2011/06/01/10170113.aspx )
 * HRESULT InitPropVariantFromString(
 *   __in_   BOOL fVal,
 *   __out_  PROPVARIANT *ppropvar
 * );
 */
function InitPropVariantFromBoolean(fVal/*jsbool*/, ppropvar/*ostypes.PROPVARIANT.ptr*/) {
	// returns ostypes.HRESULT
	ppropvar.vt = ostypes.VT_BOOL;
	ppropvar.boolVal = fVal ? ostypes.VARIANT_TRUE : ostypes.VARIANT_FALSE;
	return ostypes.S_OK;
}

/* http://msdn.microsoft.com/en-us/library/windows/desktop/bb762305%28v=vs.85%29.aspx
 * NOTE1: I have to write my own InitPropVariantFromString because its not in a dll its defined in a header
 * NOTE2: When using this see notes on MSDN doc page chat of PROPVARIANT ( http://msdn.microsoft.com/en-us/library/windows/desktop/aa380072%28v=vs.85%29.aspx )this guy says: "VT_LPWSTR must be allocated with CoTaskMemAlloc :: (Presumably this also applies to VT_LPSTR) VT_LPWSTR is described as being a string pointer with no information on how it is allocated. You might then assume that the PROPVARIANT doesn't own the string and just has a pointer to it, but you'd be wrong. In fact, the string stored in a VT_LPWSTR PROPVARIANT must be allocated using CoTaskMemAlloc and be freed using CoTaskMemFree. Evidence for this: Look at what the inline InitPropVariantFromString function does: It sets a VT_LPWSTR using SHStrDupW, which in turn allocates the string using CoTaskMemAlloc. Knowing that, it's obvious that PropVariantClear is expected to free the string using CoTaskMemFree. I can't find this explicitly documented anywhere, which is a shame, but step through this code in a debugger and you can confirm that the string is freed by PropVariantClear: ```#include <Propvarutil.h>	int wmain(int argc, TCHAR *lpszArgv[])	{	PROPVARIANT pv;	InitPropVariantFromString(L"Moo", &pv);	::PropVariantClear(&pv);	}```  If  you put some other kind of string pointer into a VT_LPWSTR PROPVARIANT your program is probably going to crash."
 * HRESULT InitPropVariantFromString(
 *   __in_   PCWSTR psz,
 *   __out_  PROPVARIANT *ppropvar
 * );
 */
function InitPropVariantFromString(psz/*ostypes.PCWSTR*/, ppropvar/*ostypes.PROPVARIANT.ptr*/) {
	//console.log('propvarPtr.contents.pwszVal', propvarPtr.contents.pwszVal, propvarPtr.contents.pwszVal.toSource(), uneval(propvarPtr.contents.pwszVal));
	//console.log('propvarPtr', propvarPtr);
	// console.log('propvarPtr.contents.pwszVal', propvarPtr.contents.pwszVal);
	// console.log('propvarPtr.contents.pwszVal.address()', propvarPtr.contents.pwszVal.address());
	
	var hr_SHStrDup = SHStrDup(psz, ppropvar.contents.pwszVal.address()); //note in PROPVARIANT defintion `pwszVal` is defined as `LPWSTR` and `SHStrDup` expects second arg as `LPTSTR.ptr` but both `LPTSTR` and `LPWSTR` are defined the same with `ctypes.jschar` so this should be no problem
	console.info('hr_SHStrDup:', hr_SHStrDup, hr_SHStrDup.toString(), uneval(hr_SHStrDup));
	
	// console.log('propvarPtr.contents.pwszVal', propvarPtr.contents.pwszVal);
	if (!checkHRESULT(hr_SHStrDup)) {
		console.error('should never get here I THINK as if we get here then we have to do PropVariantInit, which is just a memset which we dont have to do per @nmaier on stackoverflow [firefox-addon][jsctypes]');
		throw new Error('should never get here I THINK as if we get here then we have to do PropVariantInit, which is just a memset which we dont have to do per @nmaier on stackoverflow [firefox-addon][jsctypes]');
		//PropVariantInit(propvarPtr); //can skip this, it just does a memset
	} else {
		ppropvar.vt = ostypes.VT_LPWSTR;
		console.log('as expected checkHRESULT of hr_SHStrDup was true');
	}
	return hr_SHStrDup;
}
// end - helper functions

function shutdown() {
	// do in here what you want to do before shutdown
	
	if (ppv) {
		try {
			ppv.Release(ppvPtr);
		} catch (ex) {
			Cu.reportError('Failure releasing ppv: ' + ex);
		}
	}
	if (propertyStore) {
		try {
			propertyStore.Release(propertyStorePtr);
		} catch (ex) {
			Cu.reportError('Failure releasing propertyStore: ' + ex);
		}
	}
	if (shellLink) {
		try {
			shellLink.Release(shellLinkPtr);
		} catch (ex) {
			Cu.reportError('Failure releasing shellLink: ' + ex);
		}
	}
	if (shouldUninitialize) {
		try {
			_dec('CoUninitialize')();
		} catch (ex) {
			Cu.reportError('Failure calling CoUninitialize: ' + ex);
		}
	}
	
	for (var l in lib) {
		try {
			lib[l].close();
		} catch (ex) {
			throw new Error('Failure closing "' + l + '": ' + ex);
		}
	}
}

function main() {
	//do code here
	
	/****** i dont use shell so i dont think
	//start - shell link, which i think is needed for all COM due to the `hr = shellLink.QueryInterface(shellLinkPtr, IID_IPropertyStore.address(), propertyStorePtr.address());`
	var IShellLinkWVtbl = new ctypes.StructType('IShellLinkWVtbl');
	var IShellLinkW = new ctypes.StructType('IshellLinkW', [{
		'lpVtbl': IShellLinkWVtbl.ptr
	}]);
	var IShellLinkWPtr = new ctypes.PointerType(IShellLinkW);
	IShellLinkWVtbl.define(
		[{
			/* http://msdn.microsoft.com/en-us/library/windows/desktop/ms682521%28v=vs.85%29.aspx
			 * HRESULT QueryInterface(
			 *   __in_   REFIID riid,
			 *   __out_  void **ppvObject
			 * );
			 */
			'QueryInterface': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.REFIID,
					ostypes.VOIDPTR
				]).ptr
		}, {
			'AddRef': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.ULONG, [
					IShellLinkW.ptr
				]).ptr
		}, {
			'Release': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.ULONG, [
					IShellLinkW.ptr
				]).ptr
		}, {
			'GetArguments': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPTSTR,	// pszArgs
					ostypes.INT		// cchMaxPath
				]).ptr
		}, {
			'GetDescription': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPTSTR,	// pszName
					ostypes.INT		// cchMaxName
				]).ptr
		}, {
			'GetHotKey': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.WORD.ptr	// *pwHotkey
				]).ptr
		}, {
			'GetIconLocation': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPTSTR,		// pszIconPath
					ostypes.INT,		// cchIconPath
					ostypes.INT.ptr		// *piIcon
				]).ptr
		}, {
			'GetIDList': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.PIDLIST_ABSOLUTE.ptr	// *ppidl
				]).ptr
		}, {
			'GetPath': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPTSTR,					// pszFile
					ostypes.INT,					// cchMaxPath
					ostypes.WIN32_FIND_DATA.ptr,	// *pfd
					ostypes.DWORD					// fFlags
				]).ptr
		}, {
			'GetShowCmd': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.INT.ptr		// *piShowCmd
				]).ptr
		}, {
			'GetWorkingDirectory': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPTSTR,		// pszDir
					ostypes.INT			// cchMaxPath
				]).ptr
		}, {
			'Resolve': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.HWND,	// hwnd
					ostypes.DWORD	// fFlags
				]).ptr
		}, {
			'SetArguments': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR		// pszArgs
				]).ptr
		}, {
			'SetDescription': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR		// pszName
				]).ptr
		}, {
			'SetHotKey': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.WORD	// wHotkey
				]).ptr
		}, {
			'SetIconLocation': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR,	// pszIconPath
					ostypes.INT			// iIcon
				]).ptr
		}, {
			'SetIDList': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.PCIDLIST_ABSOLUTE	// pidl
				]).ptr
		}, {
			'SetPath': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR		// pszFile
				]).ptr
		}, {
			'SetRelativePath': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR,	// pszPathRel
					ostypes.DWORD		// dwReserved
				]).ptr
		}, {
			'SetShowCmd': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.INT		// iShowCmd
				]).ptr
		}, {
			'SetWorkingDirectory': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IShellLinkW.ptr,
					ostypes.LPCTSTR		// pszDir
				]).ptr
		}]
	);
	//end - shell link, which i think is needed for all COM
	*/
	
	//start - IPropertyStore vtbl
	var IPropertyStoreVtbl = new ctypes.StructType('IPropertyStoreVtbl');
	var IPropertyStore = new ctypes.StructType('IPropertyStore', [{
		'lpVtbl': IPropertyStoreVtbl.ptr
	}]);
	var IPropertyStorePtr = new ctypes.PointerType(IPropertyStore);

	IPropertyStoreVtbl.define(
		[{
			'QueryInterface': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr,
					ostypes.REFIID,
					ostypes.VOIDPTR
				]).ptr
		}, {
			'AddRef': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.ULONG, [
					IPropertyStore.ptr
				]).ptr
		}, {
			'Release': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.ULONG, [
					IPropertyStore.ptr
				]).ptr
		}, {
			'Commit': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr
				]).ptr
		}, {
			'GetAt': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr,
					ostypes.DWORD,			// iProp
					ostypes.PROPERTYKEY.ptr	//*pkey
				]).ptr
		}, {
			'GetCount': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr,
					ostypes.DWORD.ptr	// *cProps
				]).ptr
		}, {
			'GetValue': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr,
					ostypes.REFPROPERTYKEY,		// key
					ostypes.PROPVARIANT.ptr		// *pv
				]).ptr
		}, {
			'SetValue': ctypes.FunctionType(ctypes.stdcall_abi,
				ostypes.HRESULT, [
					IPropertyStore.ptr,
					ostypes.REFPROPERTYKEY,		// key
					ostypes.REFPROPVARIANT		// propvar
				]).ptr
		}]
	);
	//end - IPropertyStore vtbl

	/****** i dont use shell so i dont think i need to do CoInitializeEx stuff
	// start - looks like something i would run in _dec or just in main	
    var hrCoInitializeEx = ostypes.HRESULT(_dec('CoInitializeEx')(null, ostypes.COINIT_APARTMENTTHREADED));
	
    if(ostypes.S_OK.toString() == hrCoInitializeEx.toString() || ostypes.S_FALSE.toString() == hrCoInitializeEx.toString()) {
		shouldUninitialize = true;
    } else {
		throw('Unexpected return value from CoInitializeEx: ' + hrCoInitializeEx);
    }
	// end - looks like something i would run in _dec or just in main
	*/
	/****** i think no need for shell due to commented out block below so removing this
	// start - looks like something i would run in _dec or just in main
	var CLSID_ShellLink = new ostypes.GUID();
	var hr_CLSIDFromString_CLSIDShellLink = _dec('CLSIDFromString')('{00021401-0000-0000-C000-000000000046}', CLSID_ShellLink.address());
	checkHRESULT(hr_CLSIDFromString_CLSIDShellLink, 'CLSIDFromString (CLSID_ShellLink)');

	var IID_IShellLink = new ostypes.GUID();
	var hr_CLSIDFromString_IIDShellLink = _dec('CLSIDFromString')('{000214F9-0000-0000-C000-000000000046}', IID_IShellLink.address());
	checkHRESULT(hr_CLSIDFromString_IIDShellLink, 'CLSIDFromString (IID_ShellLink)');

	shellLinkPtr = new IShellLinkWPtr();
	var hr_CoCreateInstance = _dec('CoCreateInstance')(CLSID_ShellLink.address(), null, ostypes.CLSCTX_INPROC_SERVER, IID_IShellLink.address(), shellLinkPtr.address());
	checkHRESULT(hr_CoCreateInstance, 'CoCreateInstance');
	shellLink = shellLinkPtr.contents.lpVtbl.contents;
	// end - looks like something i would run in _dec or just in main	
	*/
	// start - looks like something i would run in _dec or just in main
	var IID_IPropertyStore = new ostypes.GUID();
	var hr_CLSIDFromString_IIDIPropertyStore = _dec('CLSIDFromString')('{886d8eeb-8cf2-4446-8d02-cdba1dbdcf99}', IID_IPropertyStore.address()); // IID_IPersistFile was on the MSDN page (http://msdn.microsoft.com/en-us/library/windows/desktop/ms687223%28v=vs.85%29.aspx) under Requirements however IID_IPropertyStore was not on its MSDN page (http://msdn.microsoft.com/en-us/library/windows/desktop/bb761474%28v=vs.85%29.aspx) so I got this from github
	console.info('hr_CLSIDFromString_IIDIPropertyStore:', hr_CLSIDFromString_IIDIPropertyStore, hr_CLSIDFromString_IIDIPropertyStore.toString(), uneval(hr_CLSIDFromString_IIDIPropertyStore));
	checkHRESULT(hr_CLSIDFromString_IIDIPropertyStore, 'CLSIDFromString (IID_IPropertyStore)');

	/****** i think no need for shell as SHGetPropertyStoreForWindow gives me the IPropertyStore
	propertyStorePtr = new IPropertyStorePtr();
	hr = shellLink.QueryInterface(shellLinkPtr, IID_IPropertyStore.address(), propertyStorePtr.address());
	console.info('hr:', hr, hr.toString(), uneval(hr));
	checkHRESULT(hr, 'QueryInterface (IShellLink->IPersistFile)');
	propertyStore = propertyStorePtr.contents.lpVtbl.contents;
	// end - looks like something i would run in _dec or just in main
	*/
	
	// from: http://blogs.msdn.com/b/oldnewthing/archive/2011/06/01/10170113.aspx
	var IPropertyStore_SetValue = function(pps/*IPropertyStore.ptr*/, pkey/*ostypes.REFPROPERTYKEY*/, pszValue/*ostypes.PCWSTR*/) {
		//pps must be passed in as reference
		var ppropvar = ostypes.PROPVARIANT();

		var hr_InitPropVariantFromString = InitPropVariantFromString(pszValue, ppropvar.address());
		if (checkHRESULT(hr_InitPropVariantFromString)) {
			console.info('pps.SetValue', pps.SetValue);
			pps.SetValue(pkey, ppropvar.address());
			var rez_PropVariantClear = PropVariantClear(ppropvar.address());
			console.info('rez_PropVariantClear:', rez_PropVariantClear, rez_PropVariantClear.toString(), uneval(rez_PropVariantClear));
		} else {
			throw new Error('failed InitPropVariantFromString');
		}
		return hr_InitPropVariantFromString;
	}
	
	ppvPtr = new IPropertyStorePtr();
	var hr_SHGetPropertyStoreForWindow = SHGetPropertyStoreForWindow(hwnd, IID_IPropertyStore, ppvPtr.address()); //I figured out IID_IPropertyStore in the calls above, `CLSIDFromString`, I do this in place of the `IID_PPV_ARGS` macro, I could just make those two lines I did above the `IID_PPV_ARGS` function. Also see this Stackoverflow topic about IID_PPV_ARGS: http://stackoverflow.com/questions/24542806/can-iid-ppv-args-be-skipped-in-jsctypes-win7
	console.info('hr_SHGetPropertyStoreForWindow:', hr_SHGetPropertyStoreForWindow, hr_SHGetPropertyStoreForWindow.toString(), uneval(hr_SHGetPropertyStoreForWindow));
	if (!checkHRESULT(hr_SHGetPropertyStoreForWindow, 'SHGetPropertyStoreForWindow')) { //this throws so no need to do an if on hr brelow, im not sure that was possible anyways as hr is now `-2147467262` and its throwing, before thi, with my `if (hr)` it would continue thinking it passed
		throw new Error('checkHRESULT error');
	}
	ppv = ppvPtr.contents.lpVtbl.contents;
	
	// start get PKEY's
	var fmtid_ID = fmtid_RelaunchCommand = fmtid_RelaunchDisplayNameResource = fmtid_RelaunchIcon = new struct_GUID();
	var hr_fmtid = CLSIDFromString('{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}', myGUID.address()); // same for guid for: ID, RelaunchCommand, RelaunchDisplayNameResourche, RelaunchIcon, and IsDestListSeparator // source: https://github.com/truonghinh/TnX/blob/260a8a623751ffbce14bad6018ea48febbc21bc6/TnX-v8/Microsoft.Windows.Shell/Standard/ShellProvider.cs#L358
	checkHRESULT(hr_fmtid, 'hr_fmtid'); //this throws on error
	
	var PKEY_AppUserModel_ID = new struct_PROPERTYKEY(fmtid_ID, 5);
	var PKEY_AppUserModel_RelaunchCommand = new struct_PROPERTYKEY(fmtid_RelaunchCommand, 2);
	var PKEY_AppUserModel_RelaunchDisplayNameResource = new struct_PROPERTYKEY(fmtid_RelaunchDisplayNameResource, 4);
	var PKEY_AppUserModel_RelaunchIcon = new struct_PROPERTYKEY(fmtid_RelaunchIcon, 3);

	// end get PKEY's
	
	IPropertyStore_SetValue(ppv.address(), PKEY_AppUserModel_ID, ostypes.PCWSTR('Contoso.Scratch')); // the helper function `IPropertyStore_SetValue` already checks hr and throws error if it fails so no need to check return value here
	IPropertyStore_SetValue(ppv.address(), PKEY_AppUserModel_RelaunchCommand, ostypes.PCWSTR('Contoso.Scratch')); // the helper function `IPropertyStore_SetValue` already checks hr and throws error if it fails so no need to check return value here
	IPropertyStore_SetValue(ppv.address(), PKEY_AppUserModel_RelaunchDisplayNameResource, ostypes.PCWSTR('C:\\full\\path\\to\\scratch.exe,-1'));
	
	
}

// start - globals for my main stuff
var ppvPtr;
var ppv;
var propertyStorePtr;
var propertyStore;
var shellLinkPtr;
var shellLink;
var shouldUninitialize;
// end - globals

try {
	main();
} catch(ex) {
	throw ex;
} finally {
	shutdown();
}