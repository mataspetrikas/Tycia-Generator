package com.liksaite.generator {
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextField;
  import flash.geom.Rectangle;
  import flash.geom.Point;
  import flash.display.Sprite;
  import flash.display.Bitmap;
  import flash.display.BitmapData;

  /**
   * @author matas
   */
  public class GenCanvas extends Sprite {
    private var _canvas : BitmapData;
    private var _bmp : Bitmap;
    private var _next : GenCanvas;
    private var _label : TextField;

    public function GenCanvas(settings:Object = null) {
    	var width:Number = settings.width || 1000;    	var height:Number = settings.height || 1000;
    	var transparent:Boolean = settings.hasOwnProperty('transparent') ? settings.transparent : false;
    	var background: uint = settings.background || 0x000000;
      _canvas = new BitmapData(width, height, transparent, background);
      _bmp = new Bitmap(_canvas);
      _bmp.alpha = .8;
    	addChild(_bmp);
    	
    	var style:TextFormat = new TextFormat("Helvetica");
    	style.size = 100;
    	style.bold = true;
    	style.color = 0xffffff;
    	_label = new TextField();
      _label.defaultTextFormat = style;
      _label.autoSize = TextFieldAutoSize.LEFT;
      _label.width = 700;
      _label.wordWrap = true;
      _label.alpha = .75;
      _label.text = "...";
    	addChild(_label);
    }
    
    public function get next() : GenCanvas {
      return _next;
    }
    
    public function set next(next : GenCanvas) : void {
      _next = next;
    }
    
    public function putText(text : String) : void {
    	_label.text = text;
//    	_label.y = Math.round(Math.random() * 200);
    }

    public function paint(source : BitmapData, sample : Rectangle, destination : Point) : void {
      _canvas.copyPixels(source, sample, destination);
    }
  }
}
