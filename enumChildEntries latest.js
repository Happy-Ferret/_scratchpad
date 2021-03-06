//start - helper function
function enumChildEntries(pathToDir, delegate, max_depth, runDelegateOnRoot, depth) {
	// IMPORTANT: as dev calling this functiopn `depth` arg must ALWAYS be undefined (dont even set it to 0 or null, must completly omit setting it, or set it to undefined). this arg is meant for internal use for iteration
	// `delegate` is required
	// pathToDir is required, it is string
	// max_depth should be set to null/undefined if you want to enumerate till every last bit is enumerated. paths will be iterated to including max_depth.
	// if runDelegateOnRoot, then delegate runs on the root path with depth arg of -1
	// this function iterates all elements at depth i, then after all done then it iterates all at depth i + 1, and then so on
	// if arg of `runDelegateOnRoot` is true then minimum depth is -1 (and is of the root), otherwise min depth starts at 0, contents of root
	// if delegate returns true, it will stop iteration
	// if set max_depth to 0, it will just iterate immediate children of pathToDir, unlesss you set runDelegateOnRoot to true, then it will just run delegate on the root
	var deferredMain_enumChildEntries = new Deferred();
	
	if (depth === undefined) {
		// at root pathDir
		depth = 0;
		if (runDelegateOnRoot) {
			var entry = {
				isDir: true,
				name: OS.Path.basename(pathToDir),
				path: pathToDir
			};
			var rez_delegate = delegate(entry, -1);
			if (rez_delegate) {
				deferredMain_enumChildEntries.resolve(entry);
				return deferredMain_enumChildEntries.promise; // to break out of this func, as if i dont break here it will go on to iterate through this dir
			}
		}
	} else {
		depth++;
	}
	
	if ((max_depth === null || max_depth === undefined) || (depth <= max_depth)) {
		var iterrator = new OS.File.DirectoryIterator(pathToDir);
		var subdirs = [];
		var promise_batch = iterrator.nextBatch();
		promise_batch.then(
			function(aVal) {
				console.log('Fullfilled - promise_batch - ', aVal);
				// start - do stuff here - promise_batch
				for (var i = 0; i < aVal.length; i++) {
					if (aVal[i].isDir) {
						subdirs.push(aVal[i]);
					}
					var rez_delegate_on_child = delegate(aVal[i], depth);
					if (rez_delegate_on_child) {
						deferredMain_enumChildEntries.resolve(aVal[i]);
						return/* deferredMain_enumChildEntries.promise -- im pretty sure i dont need this, as of 040115*/; //to break out of this if loop i cant use break, because it will get into the subdir digging, so it will not see the `return deferredMain_enumChildEntries.promise` after this if block so i have to return deferredMain_enumChildEntries.promise here
					}
				}
				// finished running delegate on all items at this depth and delegate never returned true

				if (subdirs.length > 0) {
					var promiseArr_itrSubdirs = [];
					for (var i = 0; i < subdirs.length; i++) {
						promiseArr_itrSubdirs.push(enumChildEntries(subdirs[i].path, delegate, max_depth, null, depth)); //the runDelegateOnRoot arg doesnt matter here anymore as depth arg is specified
					}
					var promiseAll_itrSubdirs = Promise.all(promiseArr_itrSubdirs);
					promiseAll_itrSubdirs.then(
						function(aVal) {
							console.log('Fullfilled - promiseAll_itrSubdirs - ', aVal);
							// start - do stuff here - promiseAll_itrSubdirs
							deferredMain_enumChildEntries.resolve('done iterating all - including subdirs iteration is done - in pathToDir of: ' + pathToDir);
							// end - do stuff here - promiseAll_itrSubdirs
						},
						function(aReason) {
							var rejObj = {name:'promiseAll_itrSubdirs', aReason:aReason};
							rejObj.aExtra = 'meaning finished iterating all entries INCLUDING subitering subdirs in dir of pathToDir';
							rejobj.pathToDir = pathToDir;
							console.warn('Rejected - promiseAll_itrSubdirs - ', rejObj);
							deferredMain_enumChildEntries.reject(rejObj);
						}
					).catch(
						function(aCaught) {
							var rejObj = {name:'promiseAll_itrSubdirs', aCaught:aCaught};
							console.error('Caught - promiseAll_itrSubdirs - ', rejObj);
							deferredMain_enumChildEntries.reject(rejObj);
						}
					);
				} else {
					deferredMain_enumChildEntries.resolve('done iterating all - no subdirs - in pathToDir of: ' + pathToDir);
				}
				// end - do stuff here - promise_batch
			},
			function(aReason) {
				var rejObj = {name:'promise_batch', aReason:aReason};
				if (aReason.winLastError == 2) {
					rejObj.probableReason = 'directory at pathToDir doesnt exist';
				}
				console.warn('Rejected - promise_batch - ', rejObj);
				deferredMain_enumChildEntries.reject(rejObj);
			}
		).catch(
			function(aCaught) {
				var rejObj = {name:'promise_batch', aCaught:aCaught};
				console.error('Caught - promise_batch - ', rejObj);
				deferredMain_enumChildEntries.reject(rejObj);
			}
		);
	} else {
		deferredMain_enumChildEntries.resolve('max depth exceeded, so will not do it, at pathToDir of: ' + pathToDir);
	}

	return deferredMain_enumChildEntries.promise;
}
// end - helper function


/************ start usage **************/
var totalEntriesEnummed = 0; //meaning total number of entries ran delegate on, includes root dir
function delegate_handleEntry(entry) {
  // return true to make enumeration stop
  totalEntriesEnummed++;
  console.info('entry:', entry);
}

var pathToTarget = OS.Constants.Path.desktopDir;
var promise_enumEntries = enumChildEntries(pathToTarget, delegate_handleEntry, null /*to get all*/, false, null);
promise_enumEntries.then(
  function(aVal) {
    // on resolve, aVal is undefined if it went through all possible entries
    console.log('Fullfilled - promise_enumEntries - ', aVal);
    console.info('totalEntriesEnummed:', totalEntriesEnummed)
  },
  function(aReason) {
    console.error('Rejected - promise_enumEntries - ', aReason);
    throw {rejectorOf_promiseName:'promise_enumEntries', aReason:aReason};
  }
).catch(
  function(aCatch) {
    console.error('Caught - promise_enumEntries - ', aCatch);
    throw aCatch;
  }  
);