import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import CanonicalStringify from "canonical-json/index2.js"

import { AllFields} from "./fields.js"
import { Subscribe} from "./subscribe.js"
import _command from "./_command.js"

const
	_clock= _command( "clock"),
	_watchProject= _command( "watch-project")

export function WatchProject( path, client){
	this.path= path
	this.subscription= {}
	this.client= client
	this._rebindWatch()
	return this
}
export {
	WatchProject as default,
	WatchProject as Watch
}

WatchProject.prototype._rebindWatch= function(){
	if( !this.client){
		this._watch= Promise.reject("No Watch")
		return
	}
	this._watch= _watchProject.call( this.client, this.path)
	// TODO: do we want to re-build all subscription we have? maybe
}

WatchProject.prototype.clock= async function(){
	const _watch= await this._watch
	return _clock.call( this.client, _watch.watch)
}

WatchProject.prototype.subscribe= async function( name, sub, client){
	sub= sub|| {}
	let s= this.subscription[ name]
	if( s){
		return s
	}

	const 
		[ relative_path, since]= await Promise.all([
			this.relative_path(),
			sub.clock=== true? client.clock(): null
		]),
		fields= sub.fields|| AllFields,
		_sub= Object.assign({ fields, ...(since&& {since}), relative_path}, sub)

console.log({since})
	s= new Subscribe( name, _sub, this)
	this.subscription[ name]= s
	return s
};

["watcher", "relative_path", "version", "watch"].forEach( function( name){
	WatchProject.prototype[ name]= async function(){
		return (await this._watch)[ name]
	}
})
