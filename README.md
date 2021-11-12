# SplitWindowSpectator211009

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Summary
* 구글에서 이미지 구릅별로 crawling 하여 이미지의 url을 저장한 화일을 미리 만들어, 
이 화일에 있는 이미지 url로 실시간으로 이미지를 읽어온다.
* 백엔드 서버가 별도로 있는 것이 아니어서, 이미지 서버의 상태와 이미지서버와 관련된
traffic의 상황에 따라서 이미지별로 로딩 속도가 현저히 차이가 날 수 있다.
* 이미지를 여러 구룹(category)으로 구분하여 구룹별로 읽어오는데, 이미지를 로딩하는 시간이 
많이 걸리므로, 이것을 보완하기 위하여 `webworker`기술을 적용하였다.
* 그리고, 한번 읽어들이 이미지는 나중에 빠르게 전시하기 위해서 cache를 적용하여 저장한다.
* 사용자가 하나의 그룹(category)을 선택했다가, 이미지가 caching중에, 다른 그룹을
선택하는 경우를 고려하여 webworker가 이미지 로딩중에 다른 구룹 선택이 되면, 
바로 다른 그룹으로 바꾸어서 image loading이 가능하게 구현했다.
### Caching image
* 사용자가 random하게 이미지 그룹을 선택할 수 있으므로 하나의 cache에 모든 그룹의
이미지를 읽어오는 순서와 상관없이 저장하고, 
* 그룹별 이미지를 전시할 때 해당 그룹만 선별하여 전시하도록 구현했다.
* 이때 그룹별로 선별하는 작업에 시간이 많이 소요되므로 webworker를 사용하여
그룹별로 선별하는 작업을 진행하도록 했다.
* 사용자가 그룹을 선택할 때 그 그룹에 대해서 이미 caching 된 것이 있으면
그것을 전시하고, 그 그룹에서 아직 다 로딩하지 못한 것이 있으면
그것들을 읽어서 전시하는 동시에 caching 작업도 진행한다. 
### Split window
* window split 기능은 기존의 라이브러리를 사용해도 되는데, 
그렇게 되면 customizing이 어렵기 때문에 별도로 directive를 적용하여
구현했다. 
* split window 구현 시, 여러개의 window가 각각의 이미지 그룹을 표시하는 과정을
거치므로, 이때는 각 window에서 첫번째 이미지만 전시하고 전시가 끝나면 바로
다음 window을 바톤을 넘겨서 진행하는 방향으로 했다.
* 이런 과정을 거쳐야만 각각의 window가 각각 고유의 id를 유지할 수 있으므로
window별로 통제가 가능하다.




### 주요적용기술
* Angular: ver 12.2.0
* Angular Material ( cdk, grid...)
* RxJS: ver 6.5 (Reactive programming library)
* NgXS: (Redux: State Management Library)
* Webworker: Observable-webworker (RxJS oriented webworker)
* TDD: spectator ( Angular oriented TDD development tool)



## Overall diagram
![](src/assets/md/images/overall.png)
~~~
1: category 를 선택하면 선택한 정보를 전달한다.
2: thumbnail 정보가 update되면 이 사항을 thumbnail list가 인식한다.
3: 1번에서 수신한 정보는 상태정보를 통해서 carousel-main program에 전달된다.
4: carousel-main에 전달된 정보는 image-cache에 저장된 정보를 파악한 후 
   저장이 안되어 있으면 image webworker를 통해서 이미지를 읽어와 image cache에 저장한다.
5: 프로그램이 처음 시작될 때 이미지를 정로 webworker를 통해서 읽어온 후 image store에 
   저장한다.
6: 이미지 스토어에 저장된 image는 series(category) list로 표시된다.
7: 이미지가 cache에 저장됨과 동시에 상태가(NgXS)가 바뀌므로 thumbnail list가 동작하여
   thumbnail로 저장된 이미지 들을 표시한다.
8: 각각의 windows( split window)가 동작할 때 각 window마다의 webworker가 동작하여
   서버에서 이미지 loading작업을 진행한다.
9: 프로그램이 처음 시작할 때 category 별로 이미지를 loading하는 작업을 
   main 화면에 이미지를 표시하는 작업에 영향을 주지 않기 위해서 webworker로 작업을 진행한다.
10: 이미지가 cache에 category별로 구분되지 않은 상태로 저장되기 때문에 이미지를 
   화면에 전시할 시에 선택된 category별로 sorting하는 작업을 webworker를 사용하여
   구분한다.  
~~~

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
