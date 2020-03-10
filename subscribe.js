import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import _command from "./_command.js"

const _subscribe= _command( "watch-project")

export function WatchSubscribe( watch, name, opt, client){
	this.name= name
	this.opt= opt
	this._rebindSubscribe( client)
	return this
}
export default WatchSubscribe

WatchSubscribe
