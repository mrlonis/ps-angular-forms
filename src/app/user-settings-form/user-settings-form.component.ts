import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from '../data/data.service';
import { UserSettings } from '../data/user-settings';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.css']
})
export class UserSettingsFormComponent implements OnInit {
  originalUserSettings: UserSettings = {
    name: "",
    emailOffers: false,
    interfaceStyle: "",
    subscriptionType: "",
    notes: ""
  };

  // Spread syntax for simple copy
  // If you wanted a deep copy you would use some kind of utility
  userSettings: UserSettings = { ...this.originalUserSettings };

  postError = false;
  postErrorMessage = "";

  subscriptionTypes!: Observable<string[]>;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.subscriptionTypes = this.dataService.getSubscriptionTypes();
  }

  onBlur(field: NgModel) {
    console.log("onBlur: " + field.valid);
  }

  onHttpError(errorResponse: any) {
    console.log("onHttpError: ", errorResponse);
    this.postError = true;
    this.postErrorMessage = errorResponse.error.errorMessage;
  }

  onSubmit(form: NgForm) {
    console.log("onSubmit: " + form.valid);

    if (form.valid) {
      this.dataService.postUserSettingsForm(this.userSettings).subscribe(
        result => {
          console.log("Success: ", result);
          this.postError = false;
          this.postErrorMessage = ""
        },
        error => this.onHttpError(error)
      );
    } else {
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors."
    }
  }

}
