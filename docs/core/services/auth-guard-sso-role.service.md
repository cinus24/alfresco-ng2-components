---
Title: Auth Guard SSO Role service
Added: v3.1.0
Status: Active
Last reviewed: 2019-03-19
---

# [Auth Guard SSO role service](../../../lib/core/services/auth-guard-sso-role.service.ts "Defined in auth-guard-sso-role.service.ts")

Checks the user roles of a user.

## Details

The [Auth Guard SSO role service](../../core/services/auth-guard-sso-role.service.md) implements an Angular
[route guard](https://angular.io/guide/router#milestone-5-route-guards)
to check the user has the right role permission. This is typically used with the
`canActivate` guard check in the route definition. The roles that user needs to have in order to access the route has to be specified in the roles array as in the example below:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardSsoRoleService ],
        data: { roles: ['USER_ROLE1', 'USER_ROLE2']}
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be not able to access this content if they do not have the roles.

## Redirect over forbidden

If the you want to redirect the user to a page after a forbidden access, you can use the **redirectUrl** as in the example below:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardSsoRoleService ],
        data: { roles: ['ACTIVITI_USER'], redirectUrl: '/error/403'}
    },
    ...
]
```

**Note**: you can use this Guard in and with the other ADF auth guards.

## See also

-   [Auth guard ecm service](auth-guard-ecm.service.md)
-   [Auth guard bpm service](auth-guard-bpm.service.md)
-   [Auth guard service](auth-guard.service.md)
