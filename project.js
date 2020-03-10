import { EventReaderListener} from "async-iter-event-reader/event-reader.js"
import _command from "./_command.js"

const
	_watchProject= _command( "watch-project"),
	_subscribe= _command( "watch-project")

export function WatchProject( path, client){
	this.subscriptions= {}
	this._watch= _watchProject.call( client, path)
	return this
}
export default WatchProject

WatchProject.prototype.subscribe= async function( name, sub, client){
	const subText= JSON.stringify( sub)
	let sub= this.subscriptions[ subText]

	if( !sub){
		const
			_watch= await this._watch,
			relativePath = _watch.relative_path,
		sub= _subscribe.call( client, watch, name, sub)
		this.subscriptions[ subText]= sub
	}

	// todo: do anything with this
	return sub
}
