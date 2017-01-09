# ng-reactive-breadcrumb

This is a very flexible component which generates breadcrumb trail as you navigate through the app. It is loosely based on the [ng2-breadcrumb](https://github.com/gmostert/ng2-breadcrumb), but was completely rewritten. 

The main idea behind it is to add *reactivity* to the path names. The reason is that static path configuration is not enough sometimes, for example you would like to render breadcrumb with an entity name which is loaded asynchronously:

```typescript
// Say, we configure a path name
breadCrumbService.configureRoute({path: '/entity/1', name: entity.name}); // Uh-Oh, we do not have the name yet
````

Adding observables to the game allows us to do this and even much more!

We can use an Observable or Promise, which will return the name later, we can even make an ajax call!
```typescript
breadCrumbService.configureRoute({path: '/entity/1', name: this.http.get('api/entity/1').map(data => data.name)});
```

Observables are really a game changer here. But if you're looking for a simple static configuration - it is supported as well.

## Dependencies

There are no dependencies actually. The built-in component uses Bootstrap breadcrumb class, but you can overwrite it or define your own template the way you like it.

## Install

## How to use

1. Import the breadcrumb module in your project:

```typescript
import { NgReactiveBreadCrumbModule } from 'ng-reactive-breadcrumb';

@NgModule({
    imports: [
        NgReactiveBreadCrumbModule
    ]
})
export class AppModule {}
```

2. Configure the breadcrumb service (optional!):

```typescript
import { BreadCrumbService } from 'ng-reactive-breadcrumb';

export class AppComponent {
    constructor(private _breadCrumbService: BreadCrumbService) {
        this._breadCrumbService.configure([
            {path: '/one', name: 'ONE'},
            {path: '/two', name: 'TWO'},
            {path: '/three', name: 'THREE'}
        ]);
    }
}
```

3. Configure your app routing

4. Use the breadcrumb component in your own component's template:

```html
<ng-reactive-breadcrumb></ng-reactive-breadcrumb>
```

## Documentation

## Examples

- [Zero configuration](https://embed.plnkr.co/0bycsEZb4tQvfJlg4ofc/)
- [Static configuration](https://embed.plnkr.co/IsrPHX9clEI1l40KpFa0/)

```javascript
this.breadCrumbService.configure([
  {path: '/one', name: 'ONE'},
  {path: '/one/two', name: '2-as-two'},
  {path: '/one/two/three', name: 'Three'},
  {path: '/one/two/three/four', name: 'FOUR (4)'},
  {path: '/one/two/three/four/five', name: 'Just five'}
]);
```

# License

[MIT](/LICENSE)
