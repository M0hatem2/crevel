import { NgModule, Optional, SkipSelf } from '@angular/core';
@NgModule({
  providers: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule should be imported only in AppModule.');
    }
  }
}
