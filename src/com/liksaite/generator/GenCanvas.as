package com.liksaite.generator {
  import flash.display.Bitmap;
  import flash.display.BitmapData;
  import flash.display.Sprite;
  import flash.geom.Point;
  import flash.geom.Rectangle;

  /**
   * @author matas
   */
  public class GenCanvas extends Sprite {

    private var _canvas : BitmapData;
    private var _bmp : Bitmap;
    private var _next : GenCanvas;

    public function GenCanvas(settings : Object = null) {
      var width : Number = settings.width ||  1000;      var height : Number = settings.height ||  1000;
      var transparent : Boolean = settings.hasOwnProperty('transparent') ? settings.transparent : false;
      var background : uint = settings.background || 0x000000;
      _canvas = new BitmapData(width, height, transparent, background);
      _bmp = new Bitmap(_canvas);
      _bmp.alpha = .8;
      addChild(_bmp);
      
       cacheAsBitmap = true;
    }

    public function get next() : GenCanvas {
      return _next;
    }

    public function set next(next : GenCanvas) : void {
      _next = next;
    }

    
    
    public function paint(source : BitmapData, sample : Rectangle, destination : Point) : void {
      _canvas.copyPixels(source, sample, destination);
    }
  }
}
