/** turn a function `fn` into a function with accepts an optional callback, and is async if there is no callback */
export function _promisify( fn, { argCount= 1, name}= { name: fn.name}){
	// create & de-reference our function within an object, such that it retains `fn.name`
	return ({[ name]: function( ...args){
		// a callback way provided - run as normal
		if( args.length> argCount){
			return fn.call( this, ...args)
		}

		// pad args
		const underfill= argCount- args.length
		if( underfill> 0){
			args.push(...new Array(underfill))
		}

		// run
		return new Promise(( resolve, reject)=>{
			fn.call( this, ...args, function( err, ok){
				if( err){
					reject( err)
				}else{
					resolve( ok)
				}
			})
		})
	}})[ name]
}
export default _promisify
