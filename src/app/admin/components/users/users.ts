import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminUsersService } from './services/admin-users.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users.html',
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class UsersSettingsComponent implements OnInit {
   users: any[] = [];
   blockedUsers: any[] = [];
   deletedUsers: any[] = [];
   filteredUsers: any[] = [];
   filteredBlockedUsers: any[] = [];
   filteredDeletedUsers: any[] = [];
   loading = false;
   blockedLoading = false;
   deletedLoading = false;
   error: string | null = null;
   activeTab: 'active' | 'blocked' | 'deleted' = 'active';
   searchQuery = '';

  constructor(
    private adminUsersService: AdminUsersService,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {}

  // Check if current user is super admin (you can customize this logic based on your auth system)
  isSuperAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.role === 'SuperAdmin' || currentUser.role === 'Admin';
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    console.log('UsersSettingsComponent: Starting to load users...');
    console.log('UsersSettingsComponent: Current token:', localStorage.getItem('token'));

    const params = { isBlocked: false, isDeleted: false };
    this.adminUsersService.getUsers(params).subscribe({
      next: (response) => {
        console.log('UsersSettingsComponent: Success response:', response);

        // Handle different response formats
        let users = response.users?.data || response.data || response;

        // If we requested isBlocked=false and isDeleted=false but got all users (fallback),
        // filter them on the frontend
        if ((params?.isBlocked === false || params?.isDeleted === false) && Array.isArray(users)) {
          users = users.filter((user: any) => !user.isBlocked && !user.isDeleted);
          console.log('UsersSettingsComponent: Filtered users (frontend):', users);
        }

        this.users = users;
        this.filteredUsers = users;
        this.applySearchFilter();
        this.loading = false;
        console.log('UsersSettingsComponent: Users loaded:', this.users);
      },
      error: (err) => {
        console.error('UsersSettingsComponent: Error details:', err);
        this.error =
          err.message ||
          this.translateService.instant(
            'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
          ) ||
          'Failed to load users';
        this.loading = false;
        console.log('UsersSettingsComponent: Error message:', this.error);
      },
    });
  }

  loadBlockedUsers() {
    this.blockedLoading = true;
    this.error = null;

    console.log('UsersSettingsComponent: Starting to load blocked users...');

    const params = { isBlocked: true, isDeleted: false };
    this.adminUsersService.getUsers(params).subscribe({
      next: (response) => {
        console.log('UsersSettingsComponent: Blocked users response:', response);

        // Handle different response formats
        let blockedUsers = response.users?.data || response.data || response;

        // If we requested isBlocked=true and isDeleted=false but got all users (fallback),
        // filter them on the frontend
        if (
          (params?.isBlocked === true || params?.isDeleted === false) &&
          Array.isArray(blockedUsers)
        ) {
          blockedUsers = blockedUsers.filter((user: any) => user.isBlocked && !user.isDeleted);
          console.log('UsersSettingsComponent: Filtered blocked users (frontend):', blockedUsers);
        }

        this.blockedUsers = blockedUsers;
        this.filteredBlockedUsers = blockedUsers;
        this.applySearchFilter();
        this.blockedLoading = false;
        console.log('UsersSettingsComponent: Blocked users loaded:', this.blockedUsers);
      },
      error: (err) => {
        console.error('UsersSettingsComponent: Error loading blocked users:', err);
        this.error =
          err.message ||
          this.translateService.instant(
            'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
          ) ||
          'Failed to load blocked users';
        this.blockedLoading = false;
        console.log('UsersSettingsComponent: Error message:', this.error);
      },
    });
  }

  loadDeletedUsers() {
    this.deletedLoading = true;
    this.error = null;

    console.log('UsersSettingsComponent: Starting to load deleted users...');

    const params = { isDeleted: true };
    this.adminUsersService.getUsers(params).subscribe({
      next: (response) => {
        console.log('UsersSettingsComponent: Deleted users response:', response);

        // Handle different response formats
        let deletedUsers = response.users?.data || response.data || response;

        // If we requested isDeleted=true but got all users (fallback),
        // filter them on the frontend
        if (params?.isDeleted === true && Array.isArray(deletedUsers)) {
          deletedUsers = deletedUsers.filter((user: any) => user.isDeleted);
          console.log('UsersSettingsComponent: Filtered deleted users (frontend):', deletedUsers);
        }

        this.deletedUsers = deletedUsers;
        this.filteredDeletedUsers = deletedUsers;
        this.applySearchFilter();
        this.deletedLoading = false;
        console.log('UsersSettingsComponent: Deleted users loaded:', this.deletedUsers);
      },
      error: (err) => {
        console.error('UsersSettingsComponent: Error loading deleted users:', err);
        this.error =
          err.message ||
          this.translateService.instant(
            'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
          ) ||
          'Failed to load deleted users';
        this.deletedLoading = false;
        console.log('UsersSettingsComponent: Error message:', this.error);
      },
    });
  }

  switchTab(tab: 'active' | 'blocked' | 'deleted') {
    this.activeTab = tab;
    if (tab === 'blocked' && this.blockedUsers.length === 0) {
      this.loadBlockedUsers();
    }
    if (tab === 'deleted' && this.deletedUsers.length === 0) {
      this.loadDeletedUsers();
    }
  }

  isModalOpen = false;
  editMode = false;
  form: any = { name: '', email: '', role: 'Viewer' };
  editingIndex: number | null = null;

  openAddUserModal() {
    this.editMode = false;
    this.form = { name: '', email: '', role: 'Viewer' };
    this.isModalOpen = true;
  }

  editUser(user: any) {
    this.editMode = true;
    this.form = { ...user };
    this.editingIndex = this.users.indexOf(user);
    this.isModalOpen = true;
  }

  saveUser() {
    if (this.editMode && this.editingIndex !== null) {
      this.users[this.editingIndex] = { ...this.form };
    } else {
      this.users.push({ ...this.form });
    }
    this.closeModal();
  }

  confirmUser(user: any) {
    this.adminUsersService.confirmUser(user._id).subscribe({
      next: () => {
        this.loadUsers(); // Reload the list
      },
      error: (err) => {
        this.error =
          err.message ||
          this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR');
      },
    });
  }

  blockUser(user: any) {
    const reason =
      prompt(
        this.translateService.instant(
          'ADMIN.USERS_MANAGEMENT.MESSAGES.ENTER_BLOCK_REASON'
        )
      ) || 'Blocked by admin';
    const userName = prompt('Enter userName:') || user.username || user.name || '';
    const confirmationPassword = prompt('Enter confirmation password:');
    if (confirmationPassword) {
      this.adminUsersService.blockUser(user._id, reason, userName, confirmationPassword).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (err) => {
          this.error =
            err.message ||
            this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR');
        },
      });
    } else {
      this.error = 'Confirmation password is required';
    }
  }

  unblockUser(user: any) {
    this.adminUsersService.unblockUserWithAccept(user._id).subscribe({
      next: () => {
        if (this.activeTab === 'blocked') {
          this.loadBlockedUsers(); // Reload blocked users list
        } else {
          this.loadUsers(); // Reload active users list
        }
      },
      error: (err: any) => {
        this.error =
          err.message ||
          this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR');
      },
    });
  }

  deleteUser(user: any) {
    if (
      confirm(
        this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.CONFIRM_DELETE')
      )
    ) {
      this.adminUsersService.deleteUser(user._id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (err) => {
          this.error =
            err.message ||
            this.translateService.instant(
              'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
            );
        },
      });
    }
  }

  undeleteUser(user: any) {
    if (
      confirm(
        this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.CONFIRM_UNDELETE')
      )
    ) {
      this.adminUsersService.undeleteUser(user._id).subscribe({
        next: () => {
          if (this.activeTab === 'deleted') {
            this.loadDeletedUsers(); // Reload deleted users list
          } else {
            this.loadUsers(); // Reload active users list in case user wants to see the restored user
          }
        },
        error: (err) => {
          this.error =
            err.message ||
            this.translateService.instant(
              'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
            );
        },
      });
    }
  }

  // ==================== SUPER ADMIN METHODS ====================

  // Add admin role to a user
  addAdminRole(user: any) {
    if (
      confirm(
        this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.CONFIRM_ADD_ADMIN')
      )
    ) {
      const userName = prompt('Enter userName:');
      if (userName) {
        const confirmationPassword = prompt('Enter confirmation password:');
        if (confirmationPassword) {
          // Get current user info for the request
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

          this.adminUsersService
            .addAdminRole(
              user._id,
              confirmationPassword,
              currentUser.email || user.email, // Use current user email as reason
              userName // Use manually entered userName
            )
            .subscribe({
              next: () => {
                this.loadUsers(); // Reload to reflect the role change
              },
              error: (err) => {
                this.error =
                  err.message ||
                  this.translateService.instant(
                    'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
                  );
              },
            });
        } else {
          this.error = 'Confirmation password is required';
        }
      } else {
        this.error = 'UserName is required';
      }
    }
  }

  // Remove admin role from a user
  removeAdminRole(user: any) {
    if (
      confirm(
        this.translateService.instant(
          'ADMIN.USERS_MANAGEMENT.MESSAGES.CONFIRM_REMOVE_ADMIN'
        )
      )
    ) {
      this.adminUsersService.removeAdminRole(user._id).subscribe({
        next: () => {
          this.loadUsers(); // Reload to reflect the role change
        },
        error: (err) => {
          this.error =
            err.message ||
            this.translateService.instant(
              'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
            );
        },
      });
    }
  }

  // Change username for a user
  changeUserName(user: any) {
    const newUsername = prompt(
      this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.ENTER_NEW_USERNAME'),
      user.username || user.name || ''
    );

    if (newUsername && newUsername.trim()) {
      this.adminUsersService.changeUserName(user._id, newUsername.trim()).subscribe({
        next: () => {
          this.loadUsers(); // Reload to reflect the username change
        },
        error: (err) => {
          this.error =
            err.message ||
            this.translateService.instant(
              'ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR'
            );
        },
      });
    }
  }

  // Load all admins (for admin management interface)
  loadAllAdmins() {
    this.loading = true;
    this.error = null;

    this.adminUsersService.getAllAdmins().subscribe({
      next: (response) => {
        console.log('UsersSettingsComponent: All admins response:', response);
        const admins = response.admins?.data || response.data || response;
        this.users = admins; // Set as users for display in the same interface
        this.loading = false;
      },
      error: (err) => {
        console.error('UsersSettingsComponent: Error loading all admins:', err);
        this.error =
          err.message ||
          this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR');
        this.loading = false;
      },
    });
  }

  // Load specific admin by ID (for detailed admin view)
  loadAdminById(id: string) {
    this.loading = true;
    this.error = null;

    this.adminUsersService.getAdminById(id).subscribe({
      next: (response) => {
        console.log('UsersSettingsComponent: Admin by ID response:', response);
        const admin = response.admin?.data || response.data || response;
        // You could set this to a single admin view or handle it differently
        this.users = [admin]; // Set as array for consistency with existing interface
        this.loading = false;
      },
      error: (err) => {
        console.error('UsersSettingsComponent: Error loading admin by ID:', err);
        this.error =
          err.message ||
          this.translateService.instant('ADMIN.USERS_MANAGEMENT.MESSAGES.GENERIC_ERROR');
        this.loading = false;
      },
    });
  }

  // ==================== SEARCH FUNCTIONALITY ====================

  onSearchChange() {
    this.applySearchFilter();
  }

  private applySearchFilter() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      // If no search query, show all users for current tab
      this.filteredUsers = [...this.users];
      this.filteredBlockedUsers = [...this.blockedUsers];
      this.filteredDeletedUsers = [...this.deletedUsers];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();

    // Filter active users
    this.filteredUsers = this.users.filter(user =>
      user.email && user.email.toLowerCase().includes(query)
    );

    // Filter blocked users
    this.filteredBlockedUsers = this.blockedUsers.filter(user =>
      user.email && user.email.toLowerCase().includes(query)
    );

    // Filter deleted users
    this.filteredDeletedUsers = this.deletedUsers.filter(user =>
      user.email && user.email.toLowerCase().includes(query)
    );
  }

  // Get current tab data based on active tab (returns filtered data)
  getCurrentTabData() {
    switch (this.activeTab) {
      case 'active':
        return this.filteredUsers;
      case 'blocked':
        return this.filteredBlockedUsers;
      case 'deleted':
        return this.filteredDeletedUsers;
      default:
        return this.filteredUsers;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Reload current tab data
  reload() {
    this.error = null;
    switch (this.activeTab) {
      case 'active':
        this.loadUsers();
        break;
      case 'blocked':
        this.loadBlockedUsers();
        break;
      case 'deleted':
        this.loadDeletedUsers();
        break;
    }
  }

}
