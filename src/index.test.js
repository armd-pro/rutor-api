'use strict'

const { test } = require( 'ava' )
const { config } = require( '.' )

test( 'Default config loaded', t => {
    const actual = config( {} )
    const expected = {
        base: 'http://cool-tor.org/search/',
        page: 0,
        category: 0,
        method: 100,
        order: 0
    }
    t.deepEqual( actual, expected )
} )

test( 'Explicit config overrides defaults', t => {
    const actual = config( { base: 'http://cool-tor.org/search/' } )
    const expected = {
        base: 'http://cool-tor.org/search/',
        page: 0,
        category: 0,
        method: 100,
        order: 0
    }
    t.deepEqual( actual, expected )
} )

