package com.liksaite.generator {
  import gs.easing.Quad;

  import flash.utils.setTimeout;
  import gs.easing.Back;

  import flash.system.Security;
  import flash.system.System;

  import gs.TweenLite;
  import gs.easing.Linear;

  import com.adobe.serialization.json.JSON;

  import flash.display.Bitmap;
  import flash.display.BitmapData;
  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageDisplayState;
  import flash.events.Event;
  import flash.events.MouseEvent;
  import flash.geom.Point;
  import flash.geom.Rectangle;
  import flash.net.URLLoader;
  import flash.net.URLRequest;
  import flash.utils.setInterval;

  /**
   * @author matas
   */
  public class IngaGen extends Sprite {

    // embeded fonts
    [Embed(systemFont="Helvetica", fontName="MainFontNormal", fontFamily="MainFont", advancedAntiAliasing="true", mimeType="application/x-font", unicodeRange="Europe")]
    public var my_font_1 : Class;

    [Embed(systemFont="Helvetica", fontName="MainFontBold", fontWeight='bold', fontFamily="MainFont", advancedAntiAliasing="true", mimeType="application/x-font", unicodeRange="Europe")]
    public var my_font_2 : Class;

    private var _loader : Loader;
    private var _images : Array;
    private var _list : String;
    private var _inited : Boolean;
    private var _poststr : String;    private var _posts : Array;

    public function IngaGen() {
      
      Security.allowDomain('tumblr.com');      Security.allowDomain('flickr.com');
      //      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;
      

      
      addEventListener(Event.ADDED_TO_STAGE, onInit);
    }

    private function onInit(event : Event) : void {
      _images = [];
      _list = "";
      // TODO: load the list every 30 seconds, extract the diffrence, do load Images
      var textLoader : URLLoader = new URLLoader();
      var imageListLoader : URLLoader = new URLLoader();
      imageListLoader.addEventListener(Event.COMPLETE, function(event : Event):void {
        trace('list loaded:\n' + imageListLoader.data);
        // compare the list with the previous
        if(_list !== imageListLoader.data) {
          if(_list.length < imageListLoader.data.length) {
            var notloaded : Array = imageListLoader.data.replace(_list, '').replace(/\n$/, '').split('\n');
            loadImages(notloaded);
          } else {
            var removed : Array = _list.replace(imageListLoader.data, '').replace(/\n$/, '').split('\n');
            removeImages(removed);
          }
          _list = imageListLoader.data;
        }
      });
      textLoader.addEventListener(Event.COMPLETE, function(event : Event):void {
        trace('text loaded:\n' + textLoader.data);
        var feed : Object = JSON.decode(textLoader.data);
        
        _posts = feed.posts;
        trace('feed.tumblelog.posts' + feed.posts);
      });
      // load the list with file names
      var getTheList : Function = function():void {
        imageListLoader.load(new URLRequest("list.php?" + (Math.random() * 50000)));
        textLoader.load(new URLRequest("http://fuckyeahkurtvonnegut.tumblr.com/api/read/json?debug=1&type=quote"));
      }
      getTheList();
      setInterval(getTheList, 120000);
    }

    private function removeImages(removed : Array) : void {
    	
      var filtered : Array = [];
      for (var i : uint = 0, l : uint = _images.length;i < l;i++) {
        if(findInArray(removed, _images[i].uri) < 0) {
          filtered.push(_images[i]);
        }
      }
      trace('remove images:' + removed + '\n left:' + _images);
      _images = filtered;
    }

    private function findInArray(arr : Array, str : String) : Number {
      for (var i : uint = 0, l : uint = arr.length;i < l;i++) {
        if(arr[i] == str) {
          trace('found:' + arr[i]);
          return i;
        }
      }
      return -1;
    }

    private function loadImages(data : Array) : void {

      trace('load images :' + data)
      var uri : String = data.shift();
      var request : URLRequest = new URLRequest(uri);
      _loader = new Loader();
      _loader.contentLoaderInfo.addEventListener(Event.INIT, function(event : Event):void {
        _images.push({uri: uri, data: Bitmap(_loader.content).bitmapData});
        if(data.length > 0) { 
          loadImages(data);
        }else if(!_inited) { 
          onInitImages();
        }
      });
      _loader.load(request);
    }

    private function onInitImages() : void {
      _inited = true;
      var bitmapContainer:Sprite = new Sprite();
      addChild(bitmapContainer);
      var bmp1 : GenCanvas = new GenCanvas({width: 800, height: 600});
      bitmapContainer.addChild(bmp1);
      var bmp2 : GenCanvas = new GenCanvas({width: 800, height: 600});
      bitmapContainer.addChild(bmp2);
      
      var textContainer:Sprite = new Sprite();
      addChild(textContainer);
      var textCanvas1 : TextCanvas = new TextCanvas();
      textContainer.addChild(textCanvas1);
      var textCanvas2 : TextCanvas = new TextCanvas();      textContainer.addChild(textCanvas2);
      
      bitmapContainer.mask = textContainer;
      // link circulary
      bmp1.next = bmp2;
      bmp2.next = bmp1;
      
      //      bmp2.y = 600;
      // select first canvas
      var activeCanvas : GenCanvas = bmp1;
      // TODO size should be smaller when _images array is bigger
      var sampleSize : Function = function():uint {
        return Math.max(18, Math.round(800 / (_images.length * 1.2)));
      };
      var blockSize : Function = function():uint {
        return sampleSize();
      };
      // select random canvas
      var palette : Function = function():BitmapData {
        // TODO: select from only the last 4-7 max?
        return _images[(_images.length > 10 ? _images.length - 8 : 0) + Math.round(Math.random() * (_images.length > 10 ? 7 : _images.length - 1))].data;
      };

      var randomPoint : Function = function(total : Number):uint {
        // exact sample grid
        //         return Math.floor(Math.random() * Math.floor(total / sampleSize)) * sampleSize;
        // random samples inside of the possible zone        return Math.floor(Math.random() * (total - sampleSize()));
      }
      
      var waitTime : Function = function():Number {
        return Math.max(6000 - (_images.length * 80), 1500);
      };
      var generateBitmaps : Function = function():void {
        var i : uint = 0;        var sampleWidth : uint = sampleSize();
        var blockWidth : uint = sampleWidth;
        var source : BitmapData;
        var perRow : Number = Math.floor(800 / blockWidth);
        while(i < (activeCanvas.width * activeCanvas.height) / blockWidth) {
          source = palette();          activeCanvas.paint(source, new Rectangle(randomPoint(source.width), randomPoint(source.height), sampleWidth, sampleWidth), new Point((i % perRow) * blockWidth, Math.floor(i / perRow) * blockWidth));          //          activeCanvas.paint(source, new Rectangle(randomPoint(source.width), randomPoint(source.height), Math.round(Math.random() * sampleWidth), Math.round(Math.random() * sampleWidth)), new Point((i % perRow) * blockWidth, Math.floor(i / perRow) * blockWidth));
          i++;
        }
        
        activeCanvas.y = -600;        TweenLite.to(activeCanvas, 5, {y: 0, ease: Linear.easeNone});
        TweenLite.to(activeCanvas.next, 5, {y: 600, ease: Linear.easeNone, onComplete: generateBitmaps});
        // flip teh canvas
        activeCanvas = activeCanvas.next;
      }
      var generateTexts : Function = function(sprite:TextCanvas, callback:Function):void {
        if(_posts && _posts.length > 0) {
          sprite.putText(_posts[Math.round(Math.random() * (_posts.length - 1))]["quote-text"]);
        }
        sprite.y = 800;
        sprite.alpha = .65 + (Math.random() * .35);
        TweenLite.to(sprite, Math.max(15, sprite.height / 30), {y: 0 - sprite.height, alpha: .35, ease: Quad.easeOut, onComplete: callback});
      };
      
      var generateText1 : Function = function():void {
        generateTexts(textCanvas1, generateText1);
      };
      var generateText2 : Function = function():void {
        generateTexts(textCanvas2, generateText2);
      };
      
      generateBitmaps();
      generateText1();      generateText2();
      setTimeout(generateText2, 10 * 1000);
      
      // toggle the masking
      setInterval(function():void{
//        bitmapContainer.mask = bitmapContainer.mask == textContainer ? null : textContainer;
      }, 2 * 1000);      
      //click proxy
      var m : Sprite = new Sprite();
      addChild(m);
      m.graphics.beginFill(0xff0000, 0);
      m.graphics.drawRect(0, 0, 800, 600)
      m.graphics.endFill();
      function onMainClick(event : MouseEvent) : void {
        trace('CLICK!!!');
        if(stage.displayState != StageDisplayState.FULL_SCREEN) {
          stage.displayState = StageDisplayState.FULL_SCREEN;
        }
      }
      m.addEventListener(MouseEvent.CLICK, onMainClick)
    }
  }
}
