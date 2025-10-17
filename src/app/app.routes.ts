import { Routes } from '@angular/router';
import { AuthComponent } from './core/layouts/auth/auth.component';
import { LoginComponent } from './core/auth/components/login/login.component';
import { UserLoginComponent } from './core/auth/components/user-login/user-login.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { OtpConfirmComponent } from './core/auth/components/otp-confirm/otp-confirm.component';
import { ForgotPasswordComponent } from './core/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/auth/components/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './core/auth/components/confirm-email/confirm-email.component';
import { UserComponent } from './core/layouts/user/user.component';
import { authGuard } from './core/guards/auth.guard';
import { isLoggedGuard } from './core/guards/is-logged.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminHome } from './admin/components/admin-home/admin-home';

export const routes: Routes = [
  // 🔐 AUTH LAYOUT
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [isLoggedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Admin Login' },
      { path: 'user-login', component: UserLoginComponent, title: 'User Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
      { path: 'otp-confirm', component: OtpConfirmComponent, title: 'OTP Confirmation' },
      { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password' },
      { path: 'reset-password', component: ResetPasswordComponent, title: 'Reset Password' },
    ],
  },

  // 📩 EMAIL CONFIRMATION
  {
    path: 'confirm-email/:token',
    component: ConfirmEmailComponent,
    title: 'Confirm Email',
  },

  // 🛠️ ADMIN LAYOUT
  {
    path: 'admin',
    component: AdminHome,
    canActivate: [authGuard, roleGuard],
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/components/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
        title: 'Admin Dashboard',
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./admin/components/admin-portfolio/admin-portfolio').then(
            (m) => m.AdminPortfolio
          ),
        title: 'Manage Portfolio',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/components/users/users').then((m) => m.UsersSettingsComponent),
        title: 'User Management',
      },
      {
        path: 'how-we-succeed',
        loadComponent: () =>
          import('./admin/components/admin-how-we-succeed/admin-how-we-succeed').then(
            (m) => m.AdminHowWeSucceed
          ),
        title: 'How We Succeed',
      },
      {
        path: 'footer',
        loadComponent: () =>
          import('./admin/components/admin-footer/admin-footer').then(
            (m) => m.AdminFooterComponent
          ),
        title: 'Footer Settings',
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./admin/components/admin-services/admin-services').then((m) => m.AdminServices),
        title: 'Service Management',
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./admin/components/admin-blog/admin-blog').then((m) => m.AdminBlog),
        title: 'Blog Management',
      },
      {
        path: 'aboutUs',
        loadComponent: () =>
          import('./admin/components/admin-about-us/admin-about-us').then((m) => m.AdminAboutUS),
        title: 'About Us Management',
      },
      {
        path: 'briefs',
        loadComponent: () =>
          import('./admin/components/admin-briefs/admin-briefs').then((m) => m.AdminBriefs),
        title: 'Briefs Management',
      },
      {
        path: 'meetings',
        loadComponent: () =>
          import('./admin/components/admin-meetings/admin-meetings').then((m) => m.AdminMeetings),
        title: 'Meetings Management',
      },
      {
        path: 'contactUs',
        loadComponent: () =>
          import('./admin/components/admin-contact-us/admin-contact-us').then(
            (m) => m.AdminContactUs
          ),
        title: 'Contact Us Management',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./admin/components/admin-contact/admin-contact').then((m) => m.AdminContact),
        title: 'Contact Management',
      },
      {
        path: 'new-briefs',
        loadComponent: () =>
          import('./admin/components/admin-brif-nave/admin-brif-nave').then((m) => m.AdminBrifNave),
        title: 'New Briefs Management',
      },
    ],
  },

  // 🌐 USER LAYOUT
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () => import('./models/home/home').then((m) => m.Home),
        title: 'Home',
      },
      {
        path: 'about',
        loadComponent: () => import('./models/about-us/about-us').then((m) => m.AboutUs),
        title: 'About Us',
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./models/web-services/web-services').then((m) => m.WebServices),
        title: 'Services',
      },

      {
        path: 'brife',
        loadComponent: () => import('./models/brife/brife').then((m) => m.Brief),
        title: 'Brife',
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./models/portfolio/portfolio').then((m) => m.Portfolio),
        title: 'Portfolio',
      },
      {
        path: 'portfolio/:id',
        loadComponent: () =>
          import('./shared/components/Portfolio-Detail-card/Portfolio-Detail-card').then(
            (m) => m.PortfolioDetailCard
          ),
        title: 'Portfolio Detail',
      },
      {
        path: 'blog',
        loadComponent: () => import('./models/blog/blog').then((m) => m.Blog),
        title: 'Blog',
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('./models/blog/blog-details').then((m) => m.BlogDetails),
        title: 'Blog Details',
      },
      {
        path: 'contact',
        loadComponent: () => import('./models/contact-me/contact-me').then((m) => m.ContactMe),
        title: 'Contact Me',
      },
    ],
  },

  // 🚫 404 PAGE
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    title: 'Page Not Found',
  },
];
