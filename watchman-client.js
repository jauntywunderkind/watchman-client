"use module"
import FbWatchman from "fb-watchman"
import { promisify} from "util"
import EventReader from "event-reader/event-reader.js"
import get from "voodoo-opt/get.js"
import gets from "voodoo-opt/get.js"

const FbClient= FbWatchman.Client 

/** turn a function `fn` into a function with accepts an optional callback, and is async if there is no callback */
function _makeOptionalPromisify( fn, argCount= 1){
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

const
	command= _makeOptionalPromisify( FbClient.prototype.command),
	capabilityCheck= _makeOptionalPromisify( FbClient.prototype.capabilityCheck)

function _makeCommand( cmd){
	return ({[ cmd]: function( ...args){
		return this.command([ cmd, ...args])
	}})[ cmd]
}

const
	watchProject= _makeCommand( "watch-project"),
	clock= _makeCommand( "clock"),
	subscribe= _makeCommand( "subscribe"),
	unsubscribe= _makeCommand( "unsubscribe")

export let WatchmanClient= function( opt){
	EventReader.call( this, opt)
	return this
}
export {
	WatchmanClient as default,
	WatchmanClient as Watchman,
	WatchmanClient as Client
}

WatchmanClient.prototype= Object.assign( FbClient.prototype, {
	command: {
		value: command
	},
	capabilityCheck: {
		value: capabilityCheck
	},
	watchProject: {
		value: watchProject
	},
	clock: {
		value: clock
	},
	subscribe: {
		value: subscribe
	},
	...Object.getOwnPropertyDescriptors( EventReader.prototype)
})
