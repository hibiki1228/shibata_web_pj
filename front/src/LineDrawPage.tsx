import React from 'react'
//import {Sketch} from "../sketch/sketch2"
import { ReactP5Wrapper } from 'react-p5-wrapper'
import {sketch} from "./lineDraw/LineDrawing";
const LineDrawPage = () => {

    return (
      <>
      <ReactP5Wrapper sketch = {sketch} />
      </>
    )
}
export default LineDrawPage;