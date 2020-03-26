import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import CanonicalStringify from "canonical-json/index2.js"

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
	}else{
		this._watch= _watchProject.call( this.client, this.path)
	}
	// TODO: do we want to re-build all subscription we have? maybe
}

WatchProject.prototype.clock= async function(){
	const _watch= await this._watch
	return _clock.call( this.client, _watch.watch)
}

WatchProject.prototype.subscribe= async function( name, sub, client){
	sub= sub|| {}
	const subText= CanonicalStringify( sub)
	let s= this.subscription[ subText]
	if( s){
		return s
	}

	const [ relative_path, watch, clock]= await Promise.all([
		this.relative_path(),
		this.watch(),
		sub.clock=== true? client.clock(): null
	])
	sub= Object.assign({}, { clock, relative_path}, sub)
	s= new Subscribe( watch, name, sub, client)
	this.subscription[ subText]= s
	return s
};

["watcher", "relative_path", "version", "watch"].forEach( function( name){
	WatchProject.prototype[ name]= async function(){
		return (await this._watch)[ name]
	}
})
