import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GestorMuseos';
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ){
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('../assets/icon-edit.svg'))
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('../assets/icon-delete.svg'))
    iconRegistry.addSvgIcon('see', sanitizer.bypassSecurityTrustResourceUrl('../assets/icon-see.svg'))



  }
}
