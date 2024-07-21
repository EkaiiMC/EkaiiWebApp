import {test, expect} from "@jest/globals";
import { ApiScope, hasPermission } from "@/api-auth";


test('simple api scopes', () => {
  const scope : ApiScope = {'test' : true}
  expect(hasPermission(scope, 'test')).toBeTruthy()
  expect(hasPermission(scope, 'fail')).toBeFalsy()
})

test('nested api scopes', () => {
  const scope : ApiScope = {'test': {'perm': true}}
  expect(hasPermission(scope, 'test')).toBeFalsy()
  expect(hasPermission(scope, 'fail')).toBeFalsy()
  expect(hasPermission(scope, 'test.perm')).toBeTruthy()
  expect(hasPermission(scope, 'test.fail')).toBeFalsy()
}) 