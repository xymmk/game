function game2048(container)
{
    this.container = container;
    
    //タイル16個ある
    this.tiles = new Array(16);
}
 
game2048.prototype = {
    
    //イニシャライズ
    init: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            
            //新しいタイルオブジェクトを作る
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        
        //初期化する時、二つのタイルに値を渡すため、二回を呼び出す
        this.randomTile();
        this.randomTile();
    },
    
    //新しいタイルを作る
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val)
        return tile;
    },
    
    //タイルに値を渡す
    setTileVal: function(tile, val){
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    
    //2あるいは4をランダムとして選択し、ランダムのタイルに埋め込む
    randomTile: function(){
        var zeroTiles = [];
        for(var i = 0, len = this.tiles.length; i < len; i++){
            
            //値は0のタイルだけ新しい値を渡す
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }
        
        //埋め込み先のタイル : 0 ~ 15 
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        
        //埋め込む値:2 or 4
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    
    //キーボードでタイルを移動する
    move:function(direction){
        var j;
        switch(direction){
            //key :　ｗ　↑　へ移動する
            case 'W':
                
                //一行目のタイルは移動できないため、i　は　4　から始まる
                for(var i = 4, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 4){
                        this.merge(this.tiles[j - 4], this.tiles[j]);
                        j -= 4;
                    }
                }
                break;
            
             //key : ｓ　↓　へ移動する
            case 'S':
                
                //四行目のタイルは移動できないため、i は　11　から始まる
                for(var i = 11; i >= 0; i--){
                    j = i;
                    while(j <= 11){
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            //key : a ←　へ　移動する
            case 'A':
                for(var i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    
                    //一列目タイルは移動できないため
                    while(j % 4 != 0){
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            //key : d →　へ移動する
            case 'D':
                for(var i = 14; i >= 0; i--){
                    j = i;
                    
                    //四列目移動できないため
                    while(j % 4 != 3){
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        
        //実行が終わったら、また新しいタイルに値を渡す
        this.randomTile();
    },
    
    //タイルを移動した後、タイルの値を計算する
    merge: function(prevTile, currTile){
        var prevVal = prevTile.getAttribute('val');
        var currVal = currTile.getAttribute('val');
        if(currVal != 0){
            
            //次のタイルは0である場合
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);
            }
            
            //次のタイルの値と同じである場合
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);
            }
        }
    },
    
    //タイルの値は同じかどうか判断する
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    
    //2048ができたら
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 2048){
                return true;
            }
        }
    },
    
    //game overの判断
    over: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            
            //全部は０である場合、移動できる
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }
            
            //四列目を除き、横の方向からみると、隣り合うタイルの値は同じである場合、移動できる
            if(i % 4 != 3){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }
            
            //四行目を除き、縦の方向からみると、隣り合うタイルの値は同じである場合、移動できる
            if(i < 12){
                if(this.equal(this.tiles[i], this.tiles[i + 4])){
                    return false;
                }
            }
        }
        return true;
    },
    
    //ゲーム再開する、タイルをクリアする
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);
    }
}
 
var game, startBtn;
 
window.onload = function(){
    var container = document.getElementById('div2048');
    startBtn = document.getElementById('start');
    startBtn.onclick = function(){
        this.style.display = 'none';
        game = game || new game2048(container);
        game.init();
    }
}
 
window.onkeydown = function(e){
    var keynum, keychar;
    if(window.event){       // IE
        keynum = e.keyCode;
    }
    else if(e.which){       // Netscape/Firefox/Opera
        keynum = e.which;
    }
    keychar = String.fromCharCode(keynum);
    if(['W', 'S', 'A', 'D'].indexOf(keychar) > -1){
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn.innerHTML = 'game over, replay?';
            return;
        }
        game.move(keychar);
    }
}
