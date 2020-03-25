#!/usr/bin/env node
import tape from "tape"

import WatchmanClient from "../watchman-client.js"
import _mint from "./_mint.js"

const capabilities= {
	optional: [],
	required: ["relative_root"]
}

export const
	checkAvailability= _mint( "checkAvailability", "integration test - check availability", async function( t){
		const
			w= new WatchmanClient({}),
			av= await w.capabilityCheck( capabilities)
		t.end()
	}),
	subscribe= _mint( "subscribe", "integration test - subscribe to watchman-client project", async function( t){
		const
			w= new WatchmanClient({}),
			p= await w.project("watchman-client")
		t.end()
	}),
	integration= async function(){
		const runner= await import("./_run_exports.js")
		return runner.default({
			checkAvailability,
			subscribe
		})
	}
export default integration

if( typeof process!== undefined&& `file://${ process.argv[ 1]}` === import.meta.url){
	integration()
}
