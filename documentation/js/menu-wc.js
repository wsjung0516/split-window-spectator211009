'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">split-window-spectator211009 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AngularMaterials.html" data-type="entity-link" >AngularMaterials</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AngularMaterials-43763afc0f2d8da45a1703d97d316a49a30896e321d25a72aba448368db71e052738d99f64fcd6362f101c67775a1b9d9e8110d1b64de4460a8c04f6d2e2b4d0"' : 'data-target="#xs-components-links-module-AngularMaterials-43763afc0f2d8da45a1703d97d316a49a30896e321d25a72aba448368db71e052738d99f64fcd6362f101c67775a1b9d9e8110d1b64de4460a8c04f6d2e2b4d0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AngularMaterials-43763afc0f2d8da45a1703d97d316a49a30896e321d25a72aba448368db71e052738d99f64fcd6362f101c67775a1b9d9e8110d1b64de4460a8c04f6d2e2b4d0"' :
                                            'id="xs-components-links-module-AngularMaterials-43763afc0f2d8da45a1703d97d316a49a30896e321d25a72aba448368db71e052738d99f64fcd6362f101c67775a1b9d9e8110d1b64de4460a8c04f6d2e2b4d0"' }>
                                            <li class="link">
                                                <a href="components/CarouselMainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarouselMainComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-880bd98406105a390b889038176b65dac91e56613a7454c492e7e44d1ce066e4d17d99cab7264fea0ec104a322054832248a2f2d4811b5bd6f1d6685b658f2a6"' : 'data-target="#xs-components-links-module-AppModule-880bd98406105a390b889038176b65dac91e56613a7454c492e7e44d1ce066e4d17d99cab7264fea0ec104a322054832248a2f2d4811b5bd6f1d6685b658f2a6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-880bd98406105a390b889038176b65dac91e56613a7454c492e7e44d1ce066e4d17d99cab7264fea0ec104a322054832248a2f2d4811b5bd6f1d6685b658f2a6"' :
                                            'id="xs-components-links-module-AppModule-880bd98406105a390b889038176b65dac91e56613a7454c492e7e44d1ce066e4d17d99cab7264fea0ec104a322054832248a2f2d4811b5bd6f1d6685b658f2a6"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CarouselModule.html" data-type="entity-link" >CarouselModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CarouselModule-7a043c3e8de8a3228e7892b6ae39d85fcd6cc10294df0e4f75e37c63e0b6c610c8975902acd3a721c9da7e9621a04715a37a59a9761fd0aeb85b1ca3360244c3"' : 'data-target="#xs-injectables-links-module-CarouselModule-7a043c3e8de8a3228e7892b6ae39d85fcd6cc10294df0e4f75e37c63e0b6c610c8975902acd3a721c9da7e9621a04715a37a59a9761fd0aeb85b1ca3360244c3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CarouselModule-7a043c3e8de8a3228e7892b6ae39d85fcd6cc10294df0e4f75e37c63e0b6c610c8975902acd3a721c9da7e9621a04715a37a59a9761fd0aeb85b1ca3360244c3"' :
                                        'id="xs-injectables-links-module-CarouselModule-7a043c3e8de8a3228e7892b6ae39d85fcd6cc10294df0e4f75e37c63e0b6c610c8975902acd3a721c9da7e9621a04715a37a59a9761fd0aeb85b1ca3360244c3"' }>
                                        <li class="link">
                                            <a href="injectables/CarouselService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarouselService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GridModule.html" data-type="entity-link" >GridModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' : 'data-target="#xs-components-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' :
                                            'id="xs-components-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' }>
                                            <li class="link">
                                                <a href="components/GridComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GridTemplateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridTemplateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' : 'data-target="#xs-directives-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' :
                                        'id="xs-directives-links-module-GridModule-3be5b59a156947d8440574c3d1acfa359ec0c6a15a96a4d7a1761cc73c0a07bcc355d2653a2b1356c836a3112ca3551d5d03986f2981738cfba05c3b5c09f256"' }>
                                        <li class="link">
                                            <a href="directives/GridTemplateDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GridTemplateDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SelectColorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SelectColorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThumbnailModule.html" data-type="entity-link" >ThumbnailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' : 'data-target="#xs-components-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' :
                                            'id="xs-components-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' }>
                                            <li class="link">
                                                <a href="components/SeriesItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeriesItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeriesListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeriesListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThumbItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThumbItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThumbnailListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThumbnailListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' : 'data-target="#xs-injectables-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' :
                                        'id="xs-injectables-links-module-ThumbnailModule-1ed2cf788af899731aee33a04263f1cbae9ef1be5b532e1978628041bb03f00361caa3f0ea59fbfdd5bebde53b0dea6268723406713e4027cbd2bf2cc9c6f3cb"' }>
                                        <li class="link">
                                            <a href="injectables/SeriesItemService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeriesItemService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/LoadingWorker.html" data-type="entity-link" >LoadingWorker</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeriesWorker.html" data-type="entity-link" >SeriesWorker</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetActiveSplit.html" data-type="entity-link" >SetActiveSplit</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCategoryList.html" data-type="entity-link" >SetCategoryList</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentCategory.html" data-type="entity-link" >SetCurrentCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentSplitOperation.html" data-type="entity-link" >SetCurrentSplitOperation</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetFocusedSplit.html" data-type="entity-link" >SetFocusedSplit</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetImageUrls.html" data-type="entity-link" >SetImageUrls</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetIsImageLoaded.html" data-type="entity-link" >SetIsImageLoaded</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetIsSeriesLoaded.html" data-type="entity-link" >SetIsSeriesLoaded</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSelectedImageById.html" data-type="entity-link" >SetSelectedImageById</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSelectedImageByUrl.html" data-type="entity-link" >SetSelectedImageByUrl</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSelectedSeriesById.html" data-type="entity-link" >SetSelectedSeriesById</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSelectedSplitWindowId.html" data-type="entity-link" >SetSelectedSplitWindowId</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSeriesUrls.html" data-type="entity-link" >SetSeriesUrls</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSplitAction.html" data-type="entity-link" >SetSplitAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSplitMode.html" data-type="entity-link" >SetSplitMode</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSplitState.html" data-type="entity-link" >SetSplitState</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetWebworkerWorkingStatus.html" data-type="entity-link" >SetWebworkerWorkingStatus</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatusAction.html" data-type="entity-link" >StatusAction</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CacheSeriesService.html" data-type="entity-link" >CacheSeriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CarouselService.html" data-type="entity-link" >CarouselService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomVirtualScrollStrategy.html" data-type="entity-link" >CustomVirtualScrollStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link" >ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeriesItemService.html" data-type="entity-link" >SeriesItemService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SplitService.html" data-type="entity-link" >SplitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatusState.html" data-type="entity-link" >StatusState</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ImageModel.html" data-type="entity-link" >ImageModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SeriesModel.html" data-type="entity-link" >SeriesModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatusStateModel.html" data-type="entity-link" >StatusStateModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tile.html" data-type="entity-link" >Tile</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});