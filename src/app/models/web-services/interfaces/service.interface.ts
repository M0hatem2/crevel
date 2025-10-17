export interface ServiceItem {
   _id: string;
   title_en: string;
   description_en: string;
   title_ar?: string;
   description_ar?: string;
   icon: string;
 }

export interface PortfolioImage {
  secure_url: string;
  public_id: string;
}

export interface PortfolioItem {
   image: PortfolioImage;
   _id: string;
   title_en: string;
   description_en: string;
   category: string;
   category_en?: string;
   category_ar?: string;
   gallery: PortfolioImage[];
 }

export interface ServicesResponse {
  smessage: string;
  data: {
    data: ServiceItem[];
    seeMore: boolean;
  };
}

export interface PortfolioResponse {
  message: string;
  data: PortfolioItem;
}

export interface SpecificServiceResponse {
  message: string;
  data: {
    _id: string;
    title_ar: string;
    description_ar: string;
    icon: string;
  };
}