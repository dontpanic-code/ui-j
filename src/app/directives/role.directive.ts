import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Directive({
  selector: '[appRole]'
})
export class AppRoleDirective implements OnInit {
  @Input() appRole: string;

  constructor(private el: ElementRef, private authenticationService: MsAdalAngular6Service) {}

  ngOnInit() {
    const currentUser = this.authenticationService.userInfo;
  }
}
