export interface BlogImage {
  secure_url: string;
  public_id: string;
}

export interface BlogGallery {
  secure_url: string;
  public_id: string;
  _id: string;
}

export interface Blog {
  _id: string;
  title_en: string;
  subTitle_en: string;
  content_en: string;
  category: string;
  image: BlogImage;
  gallery: BlogGallery[];
  // Arabic versions if available
  title_ar?: string;
  subTitle_ar?: string;
  content_ar?: string;
}
