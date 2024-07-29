import p5 from "p5"
import { LineImage } from "./LineImage";
import React from "react";

export class InteractCanvas{
  p: p5;
  imgs:LineImage[];
  drop_flag:boolean;
  o_pos:p5.Vector;
  canvas:any;


  // コンストラクタ
  constructor(p5:p5,  imgs:LineImage[]){
      this.p = p5;
      this.imgs = imgs;
      this.drop_flag = false;
      this.o_pos = p5.createVector(0,0);
      this._initCanvas();
  }
  // キャンバスの初期化
  _initCanvas = () =>{
    this.canvas = document.getElementById('line');
  }

  public drop = (o_pos:p5.Vector) =>{
    this.drop_flag = true;
    this.o_pos = o_pos;
  }
  public noDrop = () => {
    this.drop_flag = false;
    this.o_pos.x = 0;
    this.o_pos.y = 0;
  }

  public initDraw = () => { //初期描画
    for(let img of this.imgs){
      img.disp();
    }
  }
  public draw = (mouse_vector:p5.Vector) => {
    for(let img of this.imgs){
      let vector;
      vector = img.calVel(this.o_pos, mouse_vector);
      img.setRotate(this.o_pos, vector);
      img.move(vector);
      img.disp();
    }
  }
}
