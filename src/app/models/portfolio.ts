export interface PortfolioImage {
  secure_url: string;
  public_id: string;
  _id?: string;
}

export interface UserInfo {
  fullName: string;
  profilePic: string;
  email: string;
  role: string;
}

export interface PortfolioItem {
  _id?: string;
  id?: string;
  addedBy: UserInfo;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  category_en: string;
  category_ar: string;
  image: PortfolioImage;
  gallery?: PortfolioImage[];
  githubRepo?: string;
  productionUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  updatedBy?: UserInfo;
  // Additional properties for component use
  virtualId?: number;
  displayTitle?: string;
}

export interface PortfolioResponse {
  message: string;
  data: {
    data: PortfolioItem[]; // مصفوفة من العناصر
    seeMore: boolean; // الفلاج اللي بيجي من الـ API
  };
}
