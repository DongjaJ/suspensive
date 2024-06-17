import { queryFn, queryKey } from '@suspensive/test-utils'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { SuspenseQueries } from './SuspenseQueries'
import type { UseSuspenseQueryResult } from './useSuspenseQuery'

describe('<SuspenseQueries/>', () => {
  it('type check', () => {
    ;() => (
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>
        {([
          query1,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '1'.
          query2,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '2'.
          query3,
        ]) => {
          expectTypeOf(query1).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query2).toEqualTypeOf<undefined>()
          expectTypeOf(query3).toEqualTypeOf<undefined>()
          return <></>
        }}
      </SuspenseQueries>
    )
    ;() => (
      <SuspenseQueries
        queries={[
          { queryKey, queryFn },
          { queryKey, queryFn },
        ]}
      >
        {([
          query1,

          query2,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '2'.
          query3,
        ]) => {
          expectTypeOf(query1).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query2).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query3).toEqualTypeOf<undefined>()
          return <></>
        }}
      </SuspenseQueries>
    )

    expectTypeOf(
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>{() => <></>}</SuspenseQueries>
    ).toEqualTypeOf<JSX.Element>()
    expectTypeOf(
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>{() => <></>}</SuspenseQueries>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
