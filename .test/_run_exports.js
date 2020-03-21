export function runExports( exports){
	for( let [name, fn] of Object.entries( exports)){
		fn.call( this)
	}
}
export default runExports
