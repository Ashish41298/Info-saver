import {
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDocxToHtml,
  getViewerDetails,
  googleCheckSubscription,
  iframeIsLoaded,
  isLocalFile,
  replaceLocalUrl,
  IFrameReloader,
} from 'docviewhelper';
import { saveAs } from 'file-saver';
import WebViewer from '@pdftron/webviewer';
// eslint-disable-next-line @typescript-eslint/naming-convention
export type viewerType = 'google' | 'office' | 'mammoth' | 'pdf' | 'url';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.css']
})

export class DocumentViewComponent implements OnInit, AfterViewInit {
  // @Output() dataLoaded = new EventEmitter<boolean>();
  @Output() loaded: EventEmitter<boolean> = new EventEmitter();
  @Input() filename:any
  @Input() urldoc:any
  @Input() url = '';
  @Input() MainDoc:any
  @Input() queryParams = '';
  @Input() viewerUrl = '';
  @Input() googleCheckInterval = 3000;
  @Input() googleMaxChecks = 5;
  @Input() disableContent: 'none' | 'all' | 'popout' | 'popout-hide' = 'none';
  @Input() googleCheckContentLoaded = true;
  @Input() viewer: any = 'image';
  @Input() overrideLocalhost = '';
  @ViewChildren('iframe') iframes?: QueryList<ElementRef> = undefined;

  public fullUrl?: SafeResourceUrl = undefined;
  public externalViewer = false;
  public docHtml = '';
  public configuredViewer: viewerType = 'google';
  private checkIFrameSubscription?: IFrameReloader = undefined;
  private shouldCheckIframe = false;

  constructor(private domSanitizer: DomSanitizer, private ngZone: NgZone, private http:HttpClient) {}
  Winwidth:any
  wvInstance:any;
  ngOnInit() {
    if(this.url){
      this.loaded.emit(true);
    }
  }

@ViewChild('Doxviewer') viewerRef?:ElementRef ;
  async ngAfterViewInit(): Promise<void> {
   const Mdoc = JSON.parse(this.MainDoc);
   if(this.stringch() != "url" || this.stringch() != "video"){
    WebViewer({
      path: '../assets/lib', // point to where the files you copied are served from
      licenseKey: `${environment.Webviewer_key}`,
      initialDoc: `${environment.Main_backend_url}Searchable/${Mdoc.name}`,
      selectAnnotationOnCreation: true,// 'https://pdftron.s3.amazonaws.com/downloads/pl/Cover_Letter_Word.docx', // exp 'https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_about.pdf' // path to your doc
      enableOfficeEditing: true,
    }, await this.viewerRef?.nativeElement).then((instance) => {
      instance.UI.loadDocument(
        `${environment.Main_backend_url}Searchable/${Mdoc.name}`,
        {
          filename:Mdoc.name,
          enableOfficeEditing: true,
        });
       
    }).then(()=>{
      this.loaded.emit(false);
    }
    )
   }else{
      this.loaded.emit(false);
   }
    if (this.shouldCheckIframe) {
      const iframe = this.iframes?.first?.nativeElement as HTMLIFrameElement;
      if (iframe) {
        this.shouldCheckIframe = false;
        this.reloadIframe(iframe);
        this.loaded.emit(false);
      }
    }

  }
  
 
  ngOnDestroy(): void {
    if (this.checkIFrameSubscription) {
      this.checkIFrameSubscription.unsubscribe();
    }else{''}
    this.url = '';
    this.fullUrl = '';
    this.urldoc = '';
    this.MainDoc = '';
    this.filename = '';
    this.viewerUrl = '';
    this.viewer = '';
  }
  imgviews:boolean = false;
stringch(){
    switch (this.urldoc) {
        case 'image/jpg':
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
    return this.viewer = 'image';
        case  'audio/mp3':
        case  'audio/wav':
        case  'audio/mpeg':
    return this.viewer = 'url';
        case 'video/mp4':
        case 'video/avg':
   return this.viewer = 'video';
        case 'text/plain':
        case 'text/txt':
        case 'text/html':
        case 'application/x-zip-compressed':
        case 'application/zip':
        case 'application/rar':
        return this.viewer = 'url'; //google
        case 'application/pdf':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.ms-powerpoint':
        return this.viewer = 'Office';
      default:
        return this.viewer = ' ';
    }
}
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
     this.stringch();
    if (
      changes &&
      changes['viewer'] &&
      (changes['viewer'].currentValue !== changes['viewer'].previousValue)
    ) {
      if (
        this.viewer !== '&&' &&
        this.viewer !== 'google' &&
        this.viewer !== 'office' &&
        this.viewer !== 'mammoth' &&
        this.viewer !== 'pdf' &&
        this.viewer !== 'url'
      ) {
        
      }
      this.configuredViewer =  await this.viewer;
    }

    if (
      (changes['url'] &&
        changes['url'].currentValue !== changes['url'].previousValue) ||
      (changes['viewer'] &&
        changes['viewer'].currentValue !== changes['viewer'].previousValue) ||
      (changes['viewerUrl'] &&
        changes['viewerUrl'].currentValue !==
          changes['viewerUrl'].previousValue)
    ) {
      let viewerDetails = getViewerDetails(
        this.url,
        this.configuredViewer,
        this.queryParams,
        this.viewerUrl
      );
      this.externalViewer = viewerDetails.externalViewer;
      if (
        viewerDetails.externalViewer &&
        this.overrideLocalhost &&
        isLocalFile(this.url)
      ) {
        const newUrl = replaceLocalUrl(this.url, this.overrideLocalhost);
        viewerDetails = getViewerDetails(
          newUrl,
          this.configuredViewer,
          this.queryParams,
          this.viewerUrl
        );
      }
      this.docHtml = '';
      if (this.checkIFrameSubscription) {
        this.checkIFrameSubscription.unsubscribe();
      }
      if (!this.url) {
        this.fullUrl = undefined;
      } else if (
        viewerDetails.externalViewer ||
        this.configuredViewer === 'url' ||
        this.configuredViewer === 'pdf'
      ) {
        this.fullUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          viewerDetails.url
        );
        if (
          this.configuredViewer === 'google' &&
          this.googleCheckContentLoaded
        ) {
          this.ngZone.runOutsideAngular(() => {
            // if it's not loaded after the googleIntervalCheck, then open load again.
            const iframe = this.iframes?.first?.nativeElement as HTMLIFrameElement;
            if (iframe) {
              this.reloadIframe(iframe);
            } else {
              this.shouldCheckIframe = true;
            }
          });
        }
      } else if (this.configuredViewer === 'mammoth') {
        this.docHtml = await getDocxToHtml(this.url);
      }
    }
  }

  private reloadIframe(iframe: HTMLIFrameElement) {
    this.checkIFrameSubscription = googleCheckSubscription();
    this.checkIFrameSubscription.subscribe(
      iframe,
      this.googleCheckInterval,
      this.googleMaxChecks
    );
  }
  ////****loader-v */
  iframeLoaded() {
    const iframe = this.iframes?.first?.nativeElement as HTMLIFrameElement;
    if (iframe && iframeIsLoaded(iframe)) {
      if (this.checkIFrameSubscription) {
        this.checkIFrameSubscription.unsubscribe();
      }
    }
  }
  downloadImage() {
    const imageUrl:any = this.url;
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      saveAs(url, this.filename);
      URL.revokeObjectURL(url);
    });
  }
  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
  this.Winwidth = `${window.innerWidth}px`;
}

onVideoLoaded(){
  this.loaded.emit(false);

}
}
