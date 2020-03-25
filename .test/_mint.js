import tape from "tape"

/** produce a new test instance runner */
export function _mint( key, desc, fn){
	let _tape= this&& this.tape|| tape
	return ({[ key]: function(){
		_tape( desc, async function testErrorCatcherWrapper( t){
			try{
				await fn( t)
			}catch(err){
				console.error("error", err)
			}
		})
	}})[ key]
}
export const mint= _mint
export default _mint

export const only= function only( key, desc, fn){
	return _mint.call({ tape: tape.only}, key, desc, fn)
}
_mint.only= only
