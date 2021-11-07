import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SplitService {
  bWorker: any = undefined;

  elements: any[] = ['element1', 'element2', 'element3', 'element4']
  selectedElement: any = this.elements[0];
  currentImageIndex:any[]  = ['element1', 'element2', 'element3', 'element4'];

  isFinishedRendering: Subject<any>[];
  isFinishedRendering$: Observable<any>[];
  isStartedRendering: Subject<any>[];
  isStartedRendering$: Observable<any>[];


  constructor() { }
  resetSplitWindowProcessing() {
    this.currentImageIndex[this.elements[0]] = 0;
    this.currentImageIndex[this.elements[1]] = 0;
    this.currentImageIndex[this.elements[2]] = 0;
    this.currentImageIndex[this.elements[3]] = 0;

    this.isFinishedRendering = [];
    this.isFinishedRendering$ = [];
    this.isStartedRendering = [];
    this.isStartedRendering$ = [];

    this.isFinishedRendering[this.elements[0]] = new Subject();
    this.isFinishedRendering[this.elements[1]] = new Subject();
    this.isFinishedRendering[this.elements[2]] = new Subject();
    this.isFinishedRendering[this.elements[3]] = new Subject();
    this.isFinishedRendering$[this.elements[0]] = this.isFinishedRendering[this.elements[0]].asObservable();
    this.isFinishedRendering$[this.elements[1]] = this.isFinishedRendering[this.elements[1]].asObservable();
    this.isFinishedRendering$[this.elements[2]] = this.isFinishedRendering[this.elements[2]].asObservable();
    this.isFinishedRendering$[this.elements[3]] = this.isFinishedRendering[this.elements[3]].asObservable();
    this.isStartedRendering[this.elements[0]] = new Subject();
    this.isStartedRendering[this.elements[1]] = new Subject();
    this.isStartedRendering[this.elements[2]] = new Subject();
    this.isStartedRendering[this.elements[3]] = new Subject();
    this.isStartedRendering$[this.elements[0]] = this.isStartedRendering[this.elements[0]].asObservable();
    this.isStartedRendering$[this.elements[1]] = this.isStartedRendering[this.elements[1]].asObservable();
    this.isStartedRendering$[this.elements[2]] = this.isStartedRendering[this.elements[2]].asObservable();
    this.isStartedRendering$[this.elements[3]] = this.isStartedRendering[this.elements[3]].asObservable();
  }

}
