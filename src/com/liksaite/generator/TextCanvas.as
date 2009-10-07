package com.liksaite.generator {
  import flash.display.Sprite;
  import flash.text.TextField;
  import flash.text.TextFieldAutoSize;
  import flash.text.TextFormat;

  /**
   * @author matas
   */
  public class TextCanvas extends Sprite {

    private var _next : TextCanvas;
    private var _label : TextField;
    private var _style : TextFormat;

    public function TextCanvas(settings : Object = null) {

    	
      _style = new TextFormat("MainFontBold");
      _style.size = 100;
      _style.bold = true;
      _style.color = 0xffffff;
      _label = new TextField();
      _label.embedFonts = true;
      _label.defaultTextFormat = _style;
      _label.autoSize = TextFieldAutoSize.LEFT;
      _label.width = 700;
      _label.wordWrap = true;
      _label.text = "...";
      addChild(_label);
      
      cacheAsBitmap = true;
    }

    public function get next() : TextCanvas {
      return _next;
    }

    public function set next(next : TextCanvas) : void {
      _next = next;
    }

    public function putText(text : String) : void {
      _label.htmlText = text;
    	_style.size = 30 + (Math.random() * 70);
      _label.setTextFormat(_style);
//    	_label.y = Math.round(Math.random() * 200);
    }
    

  }
}
