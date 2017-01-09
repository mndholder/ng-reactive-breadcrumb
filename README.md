# ng-reactive-breadcrumb

This is a very flexible component which generates breadcrumb trail as you navigate through the app. It is loosely based on the [ng2-breadcrumb](https://github.com/gmostert/ng2-breadcrumb), but was completely rewritten. 

The main idea behind it is to add *reactivity* to the path names. The reason is that static path configuration is not enough sometimes, for example you would like to render breadcrumb with an entity name which is loaded asynchronously:

```typescript
// Say, we configure a path name
breadCrumbService.configureRoute({path: '/entity/1', name: entity.name}); // Uh-Oh, we do not have the name yet
```

Adding observables to the game allows us to do this and even much more. We can use an Observable or a Promise, which will return the name later, we can even make an ajax call!

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

## Service configuration

If you use simple route names, then you don't have to configure the service at all, the service will auto-generate names from the paths. For example:

```
/first -> First
/first/second -> Second
/first/second/third -> Third
/foo_bar -> Foo_bar
etc.
```

If your routes is a bit more complicated, the service has to be configured.
There are two methods to configure the service, the latter one is just a nifty shortcut:
- ```configureRoute``` method ([link](https://cdn.rawgit.com/mndholder/ng-reactive-breadcrumb/f352419b/docs/classes/_src_services_breadcrumb_service_.breadcrumbservice.html#configureroute))
- ```configure``` method ([link](https://cdn.rawgit.com/mndholder/ng-reactive-breadcrumb/f352419b/docs/classes/_src_services_breadcrumb_service_.breadcrumbservice.html#configure))

### configureRoute method

This method accepts an Object, which must define the path we are configuring:

```typescript
import { BreadCrumbService } from 'ng-reactive-breadcrumb';

export class AppComponent {
    constructor(private _breadCrumbService: BreadCrumbService) {
        this._breadCrumbService.configureRoute({
            path: '/one',
            name: 'ONE'
        });
    }
}
```

The path can be either a ```string``` or a ```RegExp```, so it is possible to configure more than one route with the same name:

```typescript
this._breadCrumbService.configureRoute({
    path: /\/one$/,
    name: 'ONE'
});
```

The name can be anything that is compatible with [Angular async pipe](https://angular.io/docs/ts/latest/api/common/index/AsyncPipe-pipe.html). It can be just a static string or, for example, an Observable:

```typescript
this._breadCrumbService.configureRoute({
    path: /\/one$/,
    name: Observable.of('ONE')
});
```

Using the Observable allows changing the name reactively, whenever you like, for example:

```typescript
let subject = new BehaviorSubject('ONE');
this._breadCrumbService.configureRoute({
    path: /\/one$/, 
    name: subject.asObservable()
});
...
subject.next('TWO'); // The name in the breadcrumb will change to TWO
...
subject.next('THREE'); // The name in the breadcrumb will change to THREE
...
```

It can even be an ajax request, if you like:
```typescript
this._breadCrumbService.configureRoute({
    path: /\/one$/,
    name: this._http.get('something')
});
```

### configure method

This is just a simple shortcut, which allows configuring many routes at once:

```typescript
this.breadCrumbService.configure([
  {path: '/one', name: 'ONE'},
  {path: '/one/two', name: 'TWO'},
  {path: '/one/two/three', name: 'Three'}
]);
```

### Hiding routes

Some routes can be hidden. If they are hidden, they won't be shown in the breadcrumb trail. To hide the route, use ```hidden``` property:

```typescript
this.breadCrumbService.configure([
  {path: '/one', name: 'ONE'},
  {path: '/one/two', name: 'TWO'},
  {path: '/one/two/three', name: 'Three', hidden: true} // This will not show up in the breadcrumb, like it never existed
]);
```

## Documentation

Auto-generated documentation is in the repository. Refer to ```docs``` directory or alternatively use these links:
- [Documentation index](https://cdn.rawgit.com/mndholder/ng-reactive-breadcrumb/f352419b/docs/index.html);
- [BreadCrumbComponent documentation](https://cdn.rawgit.com/mndholder/ng-reactive-breadcrumb/f352419b/docs/classes/_src_components_breadcrumb_component_.breadcrumbcomponent.html);
- [BreadCrumbService documentation](https://cdn.rawgit.com/mndholder/ng-reactive-breadcrumb/f352419b/docs/classes/_src_services_breadcrumb_service_.breadcrumbservice.html)

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
