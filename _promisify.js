/** turn a function `fn` into a function with accepts an optional callback, and is async if there is no callback */
export function _promisify( fn, argCount= 1){
	// create & de-reference our function within an object, such that it retains `fn.name`
	return ({[ fn.name]: function( ...args){
		if( args.length> argCount){
			return fn.call( this, ...args)
		}else{
			return new Promise(( resolve, reject)=>{
				fn.call( this, ...args, function( err, ok){
					if( err){
						reject( err)
					}else{
						resolve( ok)
					}
				})
			})
		}
	}})[ fn.name]
}
export default _promisify
