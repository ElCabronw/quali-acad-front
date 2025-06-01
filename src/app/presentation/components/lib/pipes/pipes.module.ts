import { NgModule } from "@angular/core";
import { NotHiddenPipe } from "./not-hidden.pipe";

@NgModule({
  declarations: [NotHiddenPipe],
  exports: [NotHiddenPipe],
})
export class PipesModule {}
