import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import CanonicalStringify from "canonical-json/index2.js"

import { WatchSubscribe} from "./subscribe.js"
import _command from "./_command.js"

const
	_clock= _command( "clock"),
	_watchProject= _command( "watch-project")

export function WatchProject( path, client){
	this.path= path
	this.subscription= {}
	this.client= client
	this._rebindWatch( client)
	return this
}
export default WatchProject

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
	const subText= CanonicalStringify( sub)
	let s= this.subscription[ subText]
	if( s){
		return s
	}

	const
		[ _watch, clock]= await Promise.all([
			this._watch,
			sub.clock=== true? client.clock(): null
		]),
		relative_path = _watch.relative_path
	opt= Object.assign({}, opt, { relative_path})
	sub= new Subscribe( _watch.watch, name, opt, client)
	this.subscription[ subText]= sub
	return sub[ Symbol.asyncIterator]()
}
