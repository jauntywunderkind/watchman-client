import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import _command from "./_command.js"

const _subscribe= _command( "watch-project")

export function WatchSubscribe( watch, name, opt, client){
	this.name= name
	this.opt= opt
	this._rebindSubscribe()
	return this
}
export {
	WatchSubscribe as default,
	WatchSubscribe as Subscribe
}

WatchSubscribe.prototype._rebindSubscribe= function(){
	
}
