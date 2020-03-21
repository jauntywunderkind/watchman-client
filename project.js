import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import CanonicalStringify from "canonical-json/index2.js"

import { WatchSubscribe} from "./subscribe.js"
import _command from "./_command.js"

const _watchProject= _command( "watch-project")

export function WatchProject( path, client){
	this.path= path
	this.subscriptions= {}
	this._rebindWatch( client)
	return this
}
export default WatchProject

WatchProject.prototype._rebindWatch( client){
	this._watch= client? _watchProject.call( client, this.path): null
	// TODO: do we want to re-build all subscriptions we have? maybe
}

WatchProject.prototype.subscribe= async function( name, opt, client){
	const optText= CanonicalStringify( opt)
	let sub= this.subscriptions[ subText]
	if( sub){
		return sub
	}
	const
		_watch= await this._watch,
		relativePath = _watch.relative_path
	opt= Object.assign({}, opt, { relative_path})
	sub= new Subscribe( _watch.watch, name, opt, client)
	this.subscriptions[ subText]= sub
	return sub[ Symbol.asyncIterator]()
}
