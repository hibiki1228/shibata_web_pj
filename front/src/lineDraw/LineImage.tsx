import * as p5 from "p5"
import React from "react";

export class LineImage{
  p:p5;
  img:p5.Image;
  move_flag:boolean;
  rotate_theta:number;
  bbox:any;
  c:any;
  v:any;

  // コンストラクタ
  public constructor(p5:p5,img:any, info:any, resize = true, center=true, size:any=null){
      this.p = p5;
      this.img = img; // 渡された画像の保存
      this.move_flag = false;
      this.rotate_theta = 0;
      this._init(info);
      if(resize == true){
          this.resize(center, size);
    }
  }

  // 画像の位置について初期化処理
  _init = (info:any)=>{ //info = ["bbox_lx", "bbox_ly", "bbox_rx", "bbox_ry", "width", "height", "cent_x", "cent_y"];
    this.img.width = info["width"]; // 線の幅
    this.img.height = info["height"]; // 線の高さ
    this.bbox = Array(4);
    this.bbox[0] = this.p.createVector(info["bbox_lx"], info["bbox_ly"]); //bboxの左上
    this.bbox[1] = this.p.createVector(this.bbox[0].x , this.bbox[0].y + this.img.height); //bboxの左下
    this.bbox[2] = this.p.createVector(this.bbox[0].x + this.img.width, this.bbox[0].y); //bboxの右上
    this.bbox[3] = this.p.createVector(info["bbox_rx"], info["bbox_ry"]); //bboxの右下
    this.c = this.p.createVector(this.bbox[0].x + Math.trunc(this.img.width/2), this.bbox[0].y + Math.trunc(this.img.height/2));
    this.v = this.p.createVector(0,0); //画像が保持する速度
  }

  _setPos = (x:number,y:number) =>{ // 線の中心座標の更新用
    this.c = this.p.createVector(x,y);
  }

  resize =(center:boolean, size:any=null)=>{ // 画像リサイズ
    let resize = 0.5; // 画像サイズの縮小
    let x = this.img.width;
    let y = this.img.height;
    let c_x = 0;
    let c_y = 0;
    if(center){
      c_x = Math.trunc(this.p.windowWidth / 2) - Math.trunc(size["width"] * resize);
      c_y = Math.trunc(this.p.windowHeight / 2) - Math.trunc(size["height"]*resize);
    }
    this.img.height = Math.trunc(resize*y);
    this.img.width = Math.trunc(resize*x);

    this._setPos(Math.trunc(this.c.x * resize + c_x), Math.trunc(this.c.y* resize + c_y));
    this._setBbox();
  }

  // 発生元から指の動きによる力のセット
  public calVel = (o_pos:p5.Vector, vec:p5.Vector) =>{ // o_pos ->発生元  // vec -> 指の動き
    let power = 0.01;  // マウス動作時の伝える力
    let x = this.c.x - o_pos.x;
    let y = this.c.y - o_pos.y;

    let sum_vec = this.p.createVector(x, y);
    if(sum_vec.mag() != 0){
      sum_vec.x /= sum_vec.mag();
      sum_vec.y /= sum_vec.mag();
      sum_vec.x *= power * vec.mag();
      sum_vec.y *= power * vec.mag();
    }else{sum_vec = this.p.createVector(0,0);}
    
    return sum_vec; 
  }

  // 画像のvectorのセット
  _setVel = (vector:p5.Vector)=> {
    let duration = 15; // 画像の動く時間
    let friction = 0.005; //摩擦（どの程度減衰するか）
    // 与える力の計算
    if(this.move_flag === false){ //画像が動いていないとき
      this.v.x = vector.x;
      this.v.y = vector.y;
      this.move_flag = true;
    }else{ //画像が動いているとき
      if(Math.trunc(this.v.mag() * 10) < 1){ //ある程度速度無い場合止めるフラグ
        this.v.x = 0;
        this.v.y = 0;
        this.move_flag = false;
      }else{ // 水中の摩擦計算
        //粘性抵抗力　this.v.x = vector.x + this.v.x - 6 * Math.PI * (this.col_size.x/2) * 0.0008 * this.v.x / this.duration;
        this.v.x = vector.x + this.v.x - this.img.width * friction * this.v.x / duration;
        //粘性抵抗力　this.v.y = vector.y + this.v.y - 6 * Math.PI * (this.col_size.y/2) * 0.0008 * this.v.y / this.duration;
        this.v.y = vector.y + this.v.y - this.img.height * friction * this.v.y / duration;

      }
    }
  }

  public setRotate = (o_pos:p5.Vector, vector:p5.Vector) =>{ // ※vectorは指の動きを表す
    // vec1:指の動き  vec2:発生元から重心へのベクトル
    if(vector.mag()!=0){
      let vec1 = vector;
      let vec2 = this.p.createVector(this.c.x - o_pos.x, this.c.y - o_pos.y);
      let cos = 0;
      let theta = 0;
      if(vec1.mag() * vec2.mag() != 0){
          cos = vec1.dot(vec2) / (vec1.mag() * vec2.mag());
      }
      if(cos < 0){
        theta = -1 * this.p.acos(cos);
      }else{
        theta = this.p.acos(cos);
      }
      this.rotate_theta = this.rotate_theta + theta/50;
    }
    
    let digit = 1000000;
    this.rotate_theta = Math.trunc((this.rotate_theta%(2*this.p.PI))*digit) / digit;
  }
  _setBbox = ()=>{
    let base = Array(4);
    base[0] = this.p.createVector(-this.img.width/2, -this.img.height/2);
    base[1] = this.p.createVector(this.img.width/2, -this.img.height/2);
    base[2] = this.p.createVector(this.img.width/2, this.img.height/2);
    base[3] = this.p.createVector(-this.img.width/2, this.img.height/2);
    
    for(let i = 0; i < 4; i++){
      this.bbox[i].x = Math.trunc(base[i].x * this.p.cos(this.rotate_theta) + base[i].y * -this.p.sin(this.rotate_theta) + this.c.x);
      this.bbox[i].y = Math.trunc(base[i].x * this.p.sin(this.rotate_theta) + base[i].y * this.p.cos(this.rotate_theta) + this.c.y);
    }
  }

  _hit =(bound:number)=>{
      if(this.bbox[0].x < 0 || this.bbox[1].x < 0 || this.bbox[2].x < 0 || this.bbox[3].x < 0 ||
          this.bbox[0].x > this.p.windowWidth || this.bbox[1].x > this.p.windowWidth || this.bbox[2].x > this.p.windowWidth || this.bbox[3].x > this.p.windowWidth
      )this.v.x *=-1 *bound;
      if(this.bbox[0].y < 0 || this.bbox[1].y < 0 || this.bbox[2].y < 0 || this.bbox[3].y < 0 ||
          this.bbox[0].y > this.p.windowHeight || this.bbox[1].y > this.p.windowHeight || this.bbox[2].y > this.p.windowHeight || this.bbox[3].y > this.p.windowHeight
      )this.v.y *=-1 *bound;
  
      let x = 0;
      let y = 0;
      let idx = 4;

      for(let i = 0; i<4; i++){
          let b_x = this.bbox[i].x;
          let b_y = this.bbox[i].y;
          this.bbox[i].x = this.p.constrain(this.bbox[i].x, 0, this.p.windowWidth);
          this.bbox[i].y = this.p.constrain(this.bbox[i].y, 0, this.p.windowHeight);
  
          if(b_x != this.bbox[i].x || b_y != this.bbox[i].y){
              x = this.bbox[i].x - b_x;
              y = this.bbox[i].y - b_y;
              idx = i;
          }
      }
  
      if(idx != 4 && (!isNaN(x)) && (!isNaN(y))){
          for(let i = 0; i< 4; i++){
          if(i != idx){
              this.bbox[i].x += x;
              this.bbox[i].y += y;
          }
      }
      if((!isNaN(x)) && (!isNaN(y))){
          this.c.x += x;
          this.c.y += y;
      }
    }

  }

  // 画像の移動
  public move = (vector:p5.Vector)=>{
    let bound = 0.6; // 跳ね返り係数
    this._setVel(vector); 

    let coord = this.p.createVector(this.c.x, this.c.y); //画像の中心座標の動き
    coord.add(this.v);
    this._setPos(coord.x, coord.y);
    this._setBbox();
    this._hit(bound); // 跳ね返り計算
  }

  // 表示関数
  public disp = () => {
    this.p.push();
    this.p.translate(this.c.x, this.c.y);
    this.p.rotate(this.rotate_theta);
    this.p.image(this.img, 0, 0);
    this.p.translate(this.c.x, this.c.y);
    this.p.pop();
  }
}