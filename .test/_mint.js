import tape from "tape"

/** produce a new test instance runner */
export function _mint( key, desc, fn){
	return ({[ key]: function(){
		tape( desc, fn)
	}})[ key]
}
export const mint= _mint
export default _mint

