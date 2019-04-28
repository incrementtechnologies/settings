# settings
## Modules
Account, Billing Information, Merchant, Notification, Payment, Profile

## Routes
``` javascript

  {
    path: '/profile/:parameter?',
    name: 'profile',
    component: resolve => require(['components/increment/settings/Update.vue'], resolve),
    meta: {
      tokenRequired: true
    }
  },
```