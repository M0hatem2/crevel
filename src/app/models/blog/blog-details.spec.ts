import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BlogDetails } from './blog-details';
import { LanguageService } from '../../core/services/language.service';
import { BlogCardService } from '../../shared/components/blog-card/services/blog.service';

describe('BlogDetails', () => {
  let component: BlogDetails;
  let fixture: ComponentFixture<BlogDetails>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<any>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;
  let mockBlogService: jasmine.SpyObj<BlogCardService>;

  const mockBlog = {
    _id: 'test-id',
    title_en: 'Test Blog',
    title_ar: 'مدونة تجريبية',
    subTitle_en: 'Test Subtitle',
    subTitle_ar: 'العنوان الفرعي',
    content_en: 'Test content',
    content_ar: 'محتوى تجريبي',
    category: 'marketing',
    image: {
      secure_url: 'https://example.com/image.jpg',
      public_id: 'test-image'
    },
    gallery: []
  };

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-id')
        }
      }
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', [], {
      currentLanguage: 'en'
    });
    const blogServiceSpy = jasmine.createSpyObj('BlogCardService', ['getBlogs']);

    await TestBed.configureTestingModule({
      imports: [BlogDetails],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: BlogCardService, useValue: blogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetails);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<any>;
    mockLanguageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    mockBlogService = TestBed.inject(BlogCardService) as jasmine.SpyObj<BlogCardService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blog details on init', () => {
    mockBlogService.getBlogs.and.returnValue(of([mockBlog]));

    component.ngOnInit();

    expect(mockBlogService.getBlogs).toHaveBeenCalled();
    expect(component.blog).toEqual(mockBlog);
    expect(component.isLoading).toBeFalse();
    expect(component.hasError).toBeFalse();
  });

  it('should handle error when loading blog details', () => {
    mockBlogService.getBlogs.and.returnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();

    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(component.blog).toBeNull();
  });

  it('should set error when no blog id provided', () => {
    mockActivatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(null);

    component.ngOnInit();

    expect(component.hasError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should return correct title based on language', () => {
    component.blog = mockBlog;
    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'en', writable: true });

    expect(component.getTitle()).toBe('Test Blog');

    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'ar', writable: true });
    expect(component.getTitle()).toBe('مدونة تجريبية');
  });

  it('should return correct subtitle based on language', () => {
    component.blog = mockBlog;
    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'en', writable: true });

    expect(component.getSubtitle()).toBe('Test Subtitle');

    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'ar', writable: true });
    expect(component.getSubtitle()).toBe('العنوان الفرعي');
  });

  it('should return correct content based on language', () => {
    component.blog = mockBlog;
    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'en', writable: true });

    expect(component.getContent()).toBe('Test content');

    Object.defineProperty(mockLanguageService, 'currentLanguage', { value: 'ar', writable: true });
    expect(component.getContent()).toBe('محتوى تجريبي');
  });

  it('should navigate back to blog list', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blog']);
  });
});