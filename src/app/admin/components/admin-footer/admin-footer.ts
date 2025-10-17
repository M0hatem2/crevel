import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterService } from './services/admin-footer.service';
import { Footer } from './footer.model';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './admin-footer.html',
  styleUrl: './admin-footer.scss'
})
export class AdminFooterComponent implements OnInit {
  footerData: Footer | null = null;
  loading = false;
  message = '';
  selectedLogo: File | null = null;

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.loadFooter();
  }

  loadFooter() {
    this.loading = true;
    this.footerService.getFooter().subscribe({
      next: (res: any) => {
        this.footerData = res.footer;
        this.loading = false;
      },
      error: () => {
        this.message = 'Error loading footer data';
        this.loading = false;
      }
    });
  }

  saveChanges() {
    if (!this.footerData) return;

    // Validate required fields
    if (!this.footerData.website?.name || !this.footerData.website?.url) {
      this.message = 'Website name and URL are required ❌';
      return;
    }

    if (!this.footerData.mobile || !this.footerData.email) {
      this.message = 'Mobile and email are required ❌';
      return;
    }

    // Prepare only the fields that should be updated
    const updateData = {
      website: {
        name: this.footerData.website.name,
        url: this.footerData.website.url
      },
      location: {
        title_en: this.footerData.location.title_en,
        title_ar: this.footerData.location.title_ar,
        url: this.footerData.location.url
      },
      mobile: this.footerData.mobile,
      email: this.footerData.email,
      copyright: this.footerData.copyright,
      social: this.footerData.social.filter(soc => soc.platform && soc.url).map(soc => ({
        platform: soc.platform,
        url: soc.url
        // Don't send _id for new social links, let the API handle it
      }))
    };

    console.log('Sending update data:', updateData); // Debug log

    this.footerService.updateFooter(updateData).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Updated successfully ✅';
        this.loadFooter(); // Reload to get updated data with proper IDs
      },
      error: (error: any) => {
        console.error('Update error:', error);
        if (error.status === 400) {
          this.message = 'Invalid data provided. Please check all fields ❌';
        } else {
          this.message = `Error updating footer: ${error.message || 'Unknown error'} ❌`;
        }
      }
    });
  }

  onLogoSelect(event: any) {
    this.selectedLogo = event.target.files[0];
  }

  uploadLogo() {
    if (!this.selectedLogo) return;

    this.footerService.changeLogo(this.selectedLogo).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Logo updated successfully ✅';
        this.loadFooter(); // إعادة تحميل الصورة الجديدة
      },
      error: () => {
        this.message = 'Error uploading logo ❌';
      }
    });
  }

  addSocialLink() {
    if (!this.footerData) return;

    this.footerData.social.push({
      platform: '',
      url: ''
      // Don't add _id for new items - let the API handle it
    });
  }

  removeSocialLink(index: number) {
    if (!this.footerData) return;

    this.footerData.social.splice(index, 1);
  }
}