import FbWatchman from "fb-watchman"
import _promisify from "./_promisify.js"

const FbClient= FbWatchman.Client

export const __command= _promisify( FbClient.prototype.command)

export function _command( cmd){
	return ({[ cmd]: function( ...args){
		return this.command([ cmd, ...args])
	}})[ cmd]
}
export default _command
