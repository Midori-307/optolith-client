// @ts-check
const { Nothing } = require('../Maybe');
const { fromUniqueElements } = require('../OrderedSet');
const { fromDefault, mergeSafeR2, mergeSafeR3, mergeSafeR4, mergeSafeR5, makeLenses, member, notMember, toObject, isRecord } = require('../Record');
const { view } = require('../Lens');

// CONSTRUCTOR

test ('fromDefault', () => {
  const test = fromDefault ({ x: 0 }) ({ x: 1 })

  expect (test .defaultValues) .toEqual ({ x: 0 })
  expect (test .values) .toEqual ({ x: 1 })
  expect (test .isRecord) .toEqual (true)
  expect (test .keys) .toEqual (fromUniqueElements ('x'))
})

// MERGING RECORDS

test ('mergeSafeR2', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 1 })
  const test2 = fromDefault ({ x: 3, y: 3 }) ({ x: 7, y: Nothing })

  // @ts-ignore
  expect (mergeSafeR2 (test2) (test)) .toEqual (testCreator ({ x: 7 }))
})

test ('mergeSafeR3', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 1 })
  const test2 = fromDefault ({ x: 3, y: 3 }) ({ x: 7, y: Nothing })
  // @ts-ignore
  const test3 = testCreator ({ y: 4, x: Nothing })

  // @ts-ignore
  expect (mergeSafeR3 (test3) (test2) (test)) .toEqual (testCreator ({ x: 0, y: 4 }))
})

test ('mergeSafeR4', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 1 })
  const test2 = fromDefault ({ x: 3, y: 3 }) ({ x: 7, y: Nothing })
  // @ts-ignore
  const test3 = testCreator ({ y: 4, x: Nothing })
  const test4 = testCreator ({ x: 5 })

  // @ts-ignore
  expect (mergeSafeR4 (test4) (test3) (test2) (test)) .toEqual (testCreator ({ x: 5, y: 4 }))
})

test ('mergeSafeR5', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 1 })
  const test2 = fromDefault ({ x: 3, y: 3 }) ({ x: 7, y: Nothing })
  // @ts-ignore
  const test3 = testCreator ({ y: 4, x: Nothing })
  const test4 = testCreator ({ x: 5 })
  // @ts-ignore
  const test5 = testCreator ({ y: 8, x: Nothing })

  expect (mergeSafeR5 (test5) (test4) (test3) (test2) (test))
    // @ts-ignore
    .toEqual (testCreator ({ x: 0, y: 8 }))
})

// CUSTOM FUNCTIONS

test ('makeLenses', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 2 })
  const lenses = makeLenses (testCreator)

  expect (view (lenses .x) (test)) .toEqual (2)
})

test ('member', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (member ('x') (test))
    .toBeTruthy ()
  expect (member ('y') (test))
    .toBeTruthy ()
  expect (member ('z') (test))
    .toBeFalsy ()
})

test ('notMember', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (notMember ('x') (test))
    .toBeFalsy ()
  expect (notMember ('y') (test))
    .toBeFalsy ()
  expect (notMember ('z') (test))
    .toBeTruthy ()
})

test ('toObject', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (toObject (test)) .toEqual ({ x: 2, y: 0 })
})

test ('isRecord', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (isRecord (test)) .toEqual (true)
  expect (isRecord (3)) .toEqual (false)
})
