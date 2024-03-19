import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import WebView from 'react-native-webview';
import useStateRef from '@/hooks/useStateRef';
import {isAndroid} from '@/utils/platform';

const injectCode = () => {
  return `<!doctype html>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <style>
    html {
      height: 100%;
    }
    body {
      height: 100%;
      margin: 0;
      overflow: hidden;
      background-color:#f6f6f6;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    </style>
    <canvas id="canvas"></canvas>
   
    <script>
    const Waveform = function (selector) {
      this.canvas = document.querySelector(selector)
      this.ctx = this.canvas.getContext('2d')
      this.canvas.width = document.body.clientWidth * window.devicePixelRatio
      this.canvas.height = document.body.clientHeight * window.devicePixelRatio
      this.ctx.strokeStyle = '#15588d'
    }
    Waveform.prototype.update = function (data) {
      const LINE_SCALE=1;
      const LINE_WIDTH=1;
      const LINE_SPACE=1;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      if(data.length * (LINE_WIDTH + LINE_SPACE) >= this.canvas.width) 
      {
        let n =  this.canvas.width / (LINE_WIDTH + LINE_SPACE) - 5
        data = data.slice(-n);
      }

      let middle = this.canvas.height / 2;
      let curX = 0.0;

      for (const power of data) { 
        let scaledHeight = power / LINE_SCALE
        curX = curX + LINE_WIDTH + LINE_SPACE
        this.ctx.beginPath()
        this.ctx.moveTo(curX, middle + scaledHeight / 2)
        this.ctx.lineTo(curX, middle - scaledHeight / 2)
        this.ctx.stroke()
      }
    }

    Waveform.prototype.updateData = function (data) {
      const LINE_SCALE=1;
      const LINE_WIDTH=1;
      const LINE_SPACE=1;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      if(data.length * (LINE_WIDTH + LINE_SPACE) >= this.canvas.width) 
      {
        let n =  this.canvas.width / (LINE_WIDTH + LINE_SPACE) - 5
        data = data.slice(-n);
      }

      let middle = this.canvas.height / 2;
      let curX = 0.0;

      for (const power of data) { 
        let scaledHeight = power / LINE_SCALE
        curX = curX + LINE_WIDTH + LINE_SPACE
        this.ctx.beginPath()
        this.ctx.moveTo(curX, middle + scaledHeight/1.2)
        this.ctx.lineTo(curX, middle - scaledHeight/1.2)
        this.ctx.stroke()
      }
    }
    window.waveform = new Waveform('#canvas')
    document.ontouchmove = function (event) {
      event.preventDefault()
    }
    </script>`;
};

export const Canvas = forwardRef((props, ref) => {
  const webViewRef = useRef();
  const [loaded, setLoaded, loadedRef] = useStateRef(false);

  useImperativeHandle(ref, () => ({
    update(amplitudeData) {
      if (loadedRef.current) {
        if (isAndroid) {
          webViewRef.current?.injectJavaScript(`
          waveform.updateData("${amplitudeData}".split(",").map(function (value) {
            return parseInt(value)
          }));
          true;
        `);
        } else {
          webViewRef.current?.injectJavaScript(`
          waveform.update("${amplitudeData}".split(",").map(function (value) {
            return parseInt(value)
          }));
          true;
        `);
        }
      }
    },
  }));

  return (
    <WebView
      ref={webViewRef}
      onLoad={() => setLoaded(true)}
      cacheEnabled={false}
      source={{
        html: injectCode(),
      }}
    />
  );
});
