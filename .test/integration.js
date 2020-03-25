#!/usr/bin/env node
import tape from "tape"

import WatchmanClient from "../watchman-client.js"
import _mint from "./_mint.js"

const capabilities= {
	optional: [],
	required: ["relative_root"]
}

export const
	capabilityCheck= _mint( "capabilityCheck", "integration test - check availability", async function( t){
		const
			w= new WatchmanClient({}),
			cc= await w.capabilityCheck( capabilities)
		t.ok( cc, "reply")
		t.ok( cc.capabilities, "capabilities")
		t.equal( cc.capabilities.relative_root, true, "has relative_root")
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
			capabilityCheck,
			subscribe
		})
	}
export default integration

if( typeof process!== undefined&& `file://${ process.argv[ 1]}` === import.meta.url){
	integration()
}
