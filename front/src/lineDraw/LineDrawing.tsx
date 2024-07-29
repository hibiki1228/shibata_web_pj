import p5 from 'p5'
import { InteractCanvas } from './InteractCanvas';
import {LineImage} from './LineImage';
import React from 'react';


export function sketch(p5 : p5){
    let canvas_w = 0; //キャンバスの横幅(仮)
    let canvas_h = 0; //キャンバスの高さ(仮)
    const refresh_rate = 30; //リフレッシュレート
    const bg_color = [255,255,255];

    let imgs:any[] = [];    //画像
    let interact_canv:any; // キャンバス
    let vec:p5.Vector; // マウスの動き
    let data:any; // jsonデータ

    p5.preload = () => {
        // 画像の読み込み
        let imgNo = 1;
        let img_num = [40, 35];
        let img_url = ["https://raw.githubusercontent.com/S4sy0s/image_forImage/main/bed_img/",
                         "https://raw.githubusercontent.com/S4sy0s/image_forImage/main/chair_img/"];
        let file = ["bed", "chair"];
        for(let cnt = 0; cnt < img_num[imgNo]; cnt++ ){
            imgs.push(p5.loadImage( img_url[imgNo] + file[imgNo] + `${('000' + (cnt+1)).slice(-3)}.png`));
        }
        p5.loadJSON(img_url[imgNo] + 'img_info.json', preloadjson);
    }
    function preloadjson(jsondata:any){
        data = jsondata;
    }

    p5.setup = () =>{
        canvas_w = p5.windowWidth;
        canvas_h = p5.windowHeight;
        p5.frameRate(refresh_rate);
        p5.imageMode(p5.CENTER);

        let num = 0;
        let cnv = p5.createCanvas(canvas_w, canvas_h);
        cnv.id('line');

        p5.background(bg_color);
        for(const img of imgs){
            imgs[num] = new LineImage(p5, img, data[String(num+1)], true, true, data["size"]);
            num++;
        }
        interact_canv = new InteractCanvas(p5, imgs);
        
        interact_canv.initDraw();
        
        vec = p5.createVector(0,0);
    }

    p5.draw = () => {
        vec.x = 0;
        vec.y = 0;
        if(p5.mouseX >0 && p5.mouseX < canvas_w && p5.mouseY < canvas_h && p5.mouseY >0
            && p5.pmouseX > 0 && p5.pmouseX < canvas_w && p5.pmouseY < canvas_h && p5.pmouseY >0
        ){// 波の発生
            vec.x = (p5.mouseX - p5.pmouseX);
            vec.y = (p5.mouseY - p5.pmouseY);
            let o_pos = p5.createVector(p5.pmouseX, p5.pmouseY);
            interact_canv.drop(o_pos);
        }
        p5.background(bg_color);
        interact_canv.draw(vec);
    }
}