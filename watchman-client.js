"use module"
import FbWatchman from "fb-watchman"
import { promisify} from "util"
import get from "voodoo-opt/get.js"
import gets from "voodoo-opt/get.js"

function WatchmanClient( opts){
	return this
}
WatchmanClient.prototype= Object.assign( FbWatchman.Client.prototype, {
	command: {
		value: command
	}
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
	}
})

function _makeOptionalPromisify( fn, argCount= 1){
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
	command= _makeOptionalPromisify( Client.command),
	capabilityCheck= _makeOptionalPromisify( Client.capabilityCheck)


function _makeCommand( cmd){
	return ({[ cmd]: function( ...args){
		return this.command([ cmd, ...args])
	})
}

const
	watchProject= _makeCommand( "watch-project"),
	clock= _makeCommand( "clock"),
	subscribe= _makeCommand( "subscribe"),
	unsubscribe= _makeCommand( "unsubscribe")
