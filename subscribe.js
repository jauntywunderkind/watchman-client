import { inherits} from "util"
import FanOut from "async-iter-fan-out/fan-out.js"

import _command from "./_command.js"

const _subscribe= _command( "subscribe")

export function WatchSubscribe( name, sub, project){
	this.name= name
	this.sub= sub
	this.project= project
	this.push= this.push.bind( this)
	project.client.on( name, this.push)
	this._rebindSubscribe()
	FanOut.call( this)
	return this
}
export {
	WatchSubscribe as default,
	WatchSubscribe as Subscribe
}
inherits( WatchSubscribe, FanOut)

WatchSubscribe.prototype._rebindSubscribe= function(){
	if( !this.project){
		this._subscribe= Promise.reject("No Subscribe")
		return
	}
	this._subscribe= (async ()=> {
		return _subscribe.call( this.project.client, await this.project.watch(), this.name, this.sub)
	})()
}

const fanOutEnd= FanOut.prototype.end
WatchSubscribe.prototype.end= function(){
	this.project.client.removeListener( this.name, this.push)
	fanOutEnd.call( this)
}
