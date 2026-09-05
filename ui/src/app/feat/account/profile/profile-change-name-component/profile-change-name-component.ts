import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AccountService } from '../../account-service';
import { ApiErrorResponse } from '../../../../shared/api/type/api.type';
import { DialogComponent } from '../../../../shared/components/ui/dialog-component/dialog-component';

@Component({
  selector: 'app-profile-change-name-component',
  imports: [
    ButtonModule,
    DialogComponent,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './profile-change-name-component.html',
})
export class ProfileChangeNameComponent {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  loading = signal<boolean>(false);
  error = signal<ApiErrorResponse | null>(null);

  changeNameDialogVisible = signal<boolean>(false);
  changeNameForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  changeName() {
    this.loading.set(true);

    this.accountService.changeMyName(this.changeNameForm.getRawValue().name).subscribe({
      next: () => {
        this.loading.set(false);
        this.changeNameDialogVisible.set(false);
        window.location.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error);
      },
    });
  }
}
