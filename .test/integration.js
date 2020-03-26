#!/usr/bin/env node
import { utimes} from "fs"
import tape from "tape"
import { dirname} from "path"

import WatchmanClient from "../watchman-client.js"
import _mint from "./_mint.js"

const
	capabilities= {
		optional: [],
		required: ["relative_root"]
	},
	__dirname= dirname( import.meta.url.substring( 7))

export const
	capabilityCheck= _mint( "capabilityCheck", "integration test - check availability", async function( t){
		const
			w= new WatchmanClient({}),
			cc= await w.capabilityCheck( capabilities)
		t.ok( cc, "reply")
		t.ok( cc.capabilities, "capabilities")
		t.equal( cc.capabilities.relative_root, true, "has relative_root")
		w.end()
		t.end()
	}),
	badWatch= _mint( "badWatch", "integration test - fail to watch a non-existant project", async function( t){
		const w= new WatchmanClient({})
		try{
			await w.watchProject( "/i-have-had-it-with-these-snakes-on-this-plane")._watch
			t.fail( "project ought not have existed")
		}catch(err){
			t.ok( err, "project confirmed not existing")
		}
		w.end()
		t.end()
	}),
	watch= _mint( "watch", "integration test - watch this project", async function( t){
		const
			w= new WatchmanClient({}),
			project= await w.watchProject( __dirname)._watch
		t.equal( project.relative_path, ".test", "found .test directory")
		w.end()
		t.end()
	}),
	clock= _mint( "clock", "integration test - clock", async function( t){
		const
			w= new WatchmanClient({}),
			project= await w.watchProject( __dirname),
			clock= await project.clock()
		t.ok( clock&& clock.clock, "clock")
		w.end()
		t.end()
	}),
	subscribe= _mint( "subscribe", "integration test - subscribe to this project", async function( t){
		const
			w= new WatchmanClient({}),
			watchmanClientPath= dirname( import.meta.url.substring( 7)),
			project= await w.watchProject( watchmanClientPath),
			sub= await project.subscribe( "int-sub-1"),
			_sub= await sub._subscribe
		t.equal( _sub.subscribe, "int-sub-1", "got our subscription")
		t.ok( _sub.clock, "clock")
		w.end()
		t.end()
	}),
	touch= _mint.only( "touch", "integration test - watch touch .test directory", async function( t){
		const
			w= new WatchmanClient({}),
			watchmanClientPath= dirname( import.meta.url.substring( 7)),
			project= await w.watchProject( watchmanClientPath),
			sub= await project.subscribe( "int-sub-1", {since:true}),
			iter= sub[ Symbol.asyncIterator](),
			first= iter.next()

		// touch .test
		const now= new Date()
		utimes(__dirname, now, now, function(){})

		// read out this change
		const change= await first
		t.equal( change.value.files[0].name, ".test", ".test changed")
		w.end()
		t.end()
	}),
	createDelete= _mint( "createDelete", "integration test - watch create delete", async function( t){
		const
			w= new WatchmanClient({}),
			watchmanClientPath= dirname( import.meta.url.substring( 7)),
			project= await w.watchProject( watchmanClientPath),
			sub= await project.subscribe( "int-sub-1")
		// TODO
		w.end()
		t.end()
	}),
	integration= async function(){
		const runner= await import("./_run_exports.js")
		return runner.default({
			capabilityCheck,
			clock,
			badWatch,
			watch,
			subscribe,
			touch,
			createDelete
		})
	}
export default integration

if( typeof process!== undefined&& `file://${ process.argv[ 1]}` === import.meta.url){
	integration()
}
