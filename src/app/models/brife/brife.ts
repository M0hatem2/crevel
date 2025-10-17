import { Component } from '@angular/core';
import { BrifeFormComponent } from "../../features/brife-form/brife-form";
import { ContactUs } from "../../features/contact-us/contact-us";

@Component({
  selector: 'app-brief',
  imports: [BrifeFormComponent, ContactUs],
  templateUrl: './brife.html',
  styleUrls: ['./brife.scss']
})
export class Brief {

}

// Brief request interface
export interface BriefRequest {
  companyName: string;
  businessSector: string;
  mobileNumber: string;
  email: string;
  website: string;
  socialMediaLinks: string[];
}

// API response interface
export interface BriefResponse {
  message: string;
  data: any;
}
