#!/usr/bin/env node
import tape from "tape"
import { dirname} from "path"

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
	badWatch= _mint("badWatch", "integration test - fail to watch a non-existant project", async function( t){
		const w= new WatchmanClient({})
		try{
			await w.watchProject("/i-have-had-it-with-these-snakes-on-this-plane")
			t.fail("project ought not have existed")
		}catch(err){
			t.ok( err, "project confirmed not existing")
		}
		w.end()
		t.end()
	}),
	subscribe= _mint( "subscribe", "integration test - subscribe to watchman-client project", async function( t){
		const
			w= new WatchmanClient({}),
			watchmanClientPath= dirname( import.meta.url.substring( 7)),
			project= await w.watchProject( watchmanClientPath)
		w.end()
		t.end()
	}),
	integration= async function(){
		const runner= await import("./_run_exports.js")
		return runner.default({
			capabilityCheck,
			badWatch,
			subscribe
		})
	}
export default integration

if( typeof process!== undefined&& `file://${ process.argv[ 1]}` === import.meta.url){
	integration()
}
