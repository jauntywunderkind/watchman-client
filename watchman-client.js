"use module"
import FbWatchman from "fb-watchman"
//import EventReader from "async-iter-event-reader/event-reader.js"
import get from "voodoo-opt/get.js"
import gets from "voodoo-opt/get.js"

import Project from "./project.js"
import { _command } from "./_command.js"
import { _promisify} from "./_promisify.js"

const FbClient= FbWatchman.Client 

const
	capabilityCheck= _promisify( FbClient.prototype.capabilityCheck, { name: "capabilityCheck"}),
	command= _promisify( FbClient.prototype.command)

const
	//watchProject= _makeCommand( "watch-project"),
	subscribe= _command( "subscribe"),
	unsubscribe= _command( "unsubscribe")

export let WatchmanClient= function( opt){
	FbClient.call( this, opt)
	//EventReader.call( this, opt)
	this.project= {}
	return this
}
export {
	WatchmanClient as default,
	WatchmanClient as Watchman,
	WatchmanClient as Client
}

WatchmanClient.prototype= Object.create( FbClient.prototype, {
	command: {
		value: command
	},
	capabilityCheck: {
		value: capabilityCheck
	},
	watchProject: {
		value: watchProject
	}
	//subscribe: {
	//	value: subscribe
	//},
	//...Object.getOwnPropertyDescriptors( EventReader.prototype)
})

function watchProject( path){
	if( this.project[ path]){
		return this.project[ path]
	}
	const watchProject= new Project( path, this)
	this.project[ path]= watchProject
	return watchProject
}
