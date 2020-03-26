import { inherits} from "util"
import FanOut from "async-iter-fan-out/fan-out.js"

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
inherits( WatchSubscribe, FanOut)

WatchSubscribe.prototype._rebindSubscribe= function(){
	
}
