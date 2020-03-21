#!/usr/bin/env node
import tape from "tape"

import WatchmanClient from "../watchman-client.js"
import _mint from "./_mint.js"

export const
	checkAvailability= _mint( "integration test - check availability", async function( t){
		const
			w= new WatchmanClient({}),
			av= await w.capabilityCheck()
	}),
	subscribe= _mint( "integration test - subscribe to watchman-client project", async function( t){
		console.log("sub")
		const
			w= new WatchmanClient({}),
			p= await w.project("watchman-client")
	}),
	integration= async function(){
		console.log("integration")
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
