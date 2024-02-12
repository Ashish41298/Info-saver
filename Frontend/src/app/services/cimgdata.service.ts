import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CimgdataService {

  constructor(private http: HttpClient) { }
  Images :any =[
    {
      id: "1",
      img: "https://www.solidbackgrounds.com/images/950x350/950x350-white-smoke-solid-color-background.jpg"
    },
    {
      id: "2",
      img: "https://picsum.photos/200/300/?blur"
    },
    {
      id: "3",
      img: "https://img.freepik.com/free-photo/abstract-purple-maroon-colour-rhombus-pattern-background-banner-multipurpose-design_1340-17121.jpg?w=826&t=st=1669554413~exp=1669555013~hmac=ed90261327a82c43c6b157152365e57b53db4974464d5e2d1adc1bd33f53cca8"
    },
    {
      id: "4",
      img: "https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-2728.jpg?w=826&t=st=1669553737~exp=1669554337~hmac=2ea0912f7e867e4261f89f4f56a017f2caaf0afa6ff7f7b6fcde6f2c3a9df295"
    },
    {
      id: "5",
      img: "https://img.freepik.com/premium-photo/blue-neon-color-gradient-horizontal-background-with-copy-space_356877-1135.jpg?w=996"
    },
    {
      id: "6",
      img: "https://images.unsplash.com/photo-1663501001437-c1c20ac6b37d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    {
      id: "7",
      img: "https://img.freepik.com/free-vector/gradient-blur-pink-blue-abstract-background_53876-117324.jpg"
    },
    {
      id: "8",
      img: "https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-2430.jpg?t=st=1663682325~exp=1663682925~hmac=7acbd6b7e2b361b7a16c99e8853c379c8a3691005731138379172d105312d8fa"
    },
    {
      id: "9",
      img: "https://img.freepik.com/premium-photo/blue-dark-gradient-texture-wall-background_28629-888.jpg"
    },
    {
      id: "10",
      img: "https://img.freepik.com/free-photo/old-shabby-concrete-wall-texture-with-cracked-purple-concrete-studio-wall-abstract-grunge-background_1258-73039.jpg?t=st=1663682325~exp=1663682925~hmac=a17a5caab77a520ea75a4aaabfced1a6f9ac9ca64ec05ff8e9b2274c4bd96e61"
    },
    {
      id: "11",
      img: "https://img.freepik.com/free-vector/abstract-green-watercolor-background_23-2149040583.jpg?w=826&t=st=1669554848~exp=1669555448~hmac=abb6fda2ff1e389d5c4fd15cf2d9b2a6d0eab22c489471fbb81c9329e69b7a67"
    }
  ]
  ppr:any=[];
  data:any;
  arrimg(): Observable<any>{
 this.ppr =this.Images;
 return this.ppr
  }
}
