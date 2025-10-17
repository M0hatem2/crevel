export interface Footer {
  _id: string;
  logo: {
    public_id: string;
    secure_url: string;
  };
  website: {
    url: string;
    name: string;
  };
  location: {
    title_en: string;
    title_ar: string;
    url: string;
  };
  social: {
    platform: string;
    url: string;
    _id?: string;
  }[];
  mobile: string;
  email: string;
  copyright: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FooterResponse {
  message: string;
  footer: Footer;
}
