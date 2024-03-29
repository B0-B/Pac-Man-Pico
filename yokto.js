(async() => {
            
    // graphics
    const   height = 640,
            width = 960,
            mazeWallGapRate = 0.3,
            mazeWallLength = 8,
            mazeWallNumber = 100,
            resolution = 40,
            wallColor = '#1b0f9d',
            retroBg = '#121212',
            maxFrameRate = 60,
            coinRotationRate = 1,
            increments = 2,
            pacVelocity = .5, // px/ms
            bigCoinRate = 0.03;
    var     ghostVelocity = .3;

    // general
    function u(){return Math.random()}
    function fl(x){return Math.floor(x)}
    function sl(t){return new Promise(r=>setTimeout(r,t))}
    function canvasOffset (canvas) {return [canvas.offsetLeft + canvas.clientLeft, canvas.offsetTop + canvas.clientTop]}
    function au(b64){return new Audio("data:audio/mpeg;base64,"+b64)}
    function cl(ctx){ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);}

    /* Sound data */
    var sound = {
        mute: 0,
        eat: au("//MkxAAHaAHUAUAAABOD4fUCYPg+HxOCAIAgCHU7+CDsTg/wQd/3f/1g+gSCPMh2//MkxAUIwXZ4qY0QAPhVwRvwnhA/Z2/+f/yEEf/+7f//\
        U7BBBP/OLu//lNXy7Lca//MkxAUISJrcAYwQAMLBEaCHZOL2U3qhQJG9nIQ0btzBj//+3/W9pkfVQDz/VBdV//MkxAYIQGrgycMYAIGFAhKgyg4xbqCGW\
        SMm4hjA4Fj4nDND5p+c7o2gXrScEAAJ//MkxAgJ2AL6PhjEch4sDR4qCsOw0IjsiJXYdiJZ1bir/sDQd3wWEpH//8NKEDhx//MkxAMHyNZ8MABGVDkwrk\
        KQtE4V71dmq/8NQEpZ89Uek8NcRKLPIgrV3AHob//1//MkxAYGOQ1sDUAQACt/9HKJd+o9+VDvt4aQDS8BPDTxUJfFsNPJgvPwMxxyf5ga//MkxBALoeJ\
        kAYpoAJLp/+pAeBJm//5vpu3/+ghLizd///2TfQWmU//zgEr+eaJ6//MkxAQIkRbkAYIoAFQ+dwEFoDDpCYxqjD/xLVy6f9taDp7qTcuj5fzn+mo/4ahf\
        //MkxAQHUFrpccgYAPwWPJpMsJAgPD0SKqjZFxOWH83oU37P//rq8QSzjKyhqVmU//MkxAkHCD7dcBmMQCTAqntCRY1LPztLha4t35XnvxLV5OIw4jDzE\
        wroakzIZQrG//MkxA8HYOqMAAgEwPKXrQzhXTpGtx3///++lRX+Kt/izP/qF2RUVFg8BQZFBIaN//MkxBQFiAGwAAhEAAqLKkxBTUUzLjEwMKqqqqqqqq\
        qqqqqqqqqqqqqqqqqqqqqq"),
        die: au("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\
        BYGifR/+k5/+7/9MAyqau7CjSCwNkXtWiJ8PV//MkxHoKQIrJlANSBCr0VtfMYBHEV1oHfY8z//HvAC0WpMolA56hm4dgmF4AAydB//MkxHQIIILqXjmE\
        SINdvmMJ/zIv6Oh7////TcQaUxYADEagSa7QmGmHN1IIBQuN//MkxHYH+J7AAANYOD/u/kIiIQH/eoz/2/f//+hjGExzuKr0D8Q5ri4+JDkO0bFK//Mkx\
        HkIQMcOWANEMki37f//ubYoB8nFLlYEUlXUetd/5CZkX9UZ6zZq73DfrKQm//MkxHsJQW7+WAIKTpav85U7CqNhXQhvnDieGXan+7xAwO9S/jgxAOJsOr\
        aTwRC6//MkxHkJaYLiWAHKJHUvy4oHwGyOsoJen/lKEcKiMgkg+IYxGXUa3YSR++sWCcPB//MkxHYJeLq8AAPSLP4v/pDw8Nf/1/Ych7QRhpiHcHhYXzn\
        rY7QqBICzOSot//Ku//MkxHMIKIsKWAMEEiIJjwwoKKilkhDLpVqgIICOrqVVV9moCJBUGkQ7//I1CpxG//MkxHUGYIq4AFhYpAiQkQyMlEbG5dJp0HjX\
        lhYV1in9Qv/+pUxBTUUzLjEwMFVV//MkxH4HeEbmWBPMIlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxIMGuIqgAFgSoFVVVVVVV\
        VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxIsHmIqQ8BJGBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxI8GoFHoAE\
        hSAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"),
        siren: au("//MkxAAHaF58EUwQAAjmZmZnKXf9gkA0BoTE4IAcJiyjv/BAMf/5d//8ov6+oSAT//MkxAUIWUq4AZJoABFDATMvAmRPeceHr//z7bj6no\
        uTm////57lnf1VEQP/3Utk//MkxAYI+VasydI4AEWcCBwFcDjjJ69///+qCcJTxoQT////RSMyCH/8RAODAFCu//MkxAUIkZLVnFAE6gH/e7O08KEAm++\
        vysrxym3f///5W1fzQYO/+CuBKgBWBcMo//MkxAUI2E7uXgBERh2gAIZbqLFPQFFiH+QUdOFWX//KOso1kf4ndYZlQ1UDVicB//MkxAQIWT7+XhAE5rF1\
        wAH8y1yimFOdXjlf/IqGf////UXEX/8nlnfyCiEBh/Uz//MkxAUIySqwyg4OZBxuVAYgRpe19Ddv//x89gnJDxz////Ys//+Xd//D1UfgDAe//MkxAQIk\
        R7mXjgExA//4AH0nGZhgUJP7aoBnDnUQ5v//+ru4nDv/q6P+pU26ljC//MkxAQG0Ja4KAYOKLUjBgwstjRf//1JnhYeiX9QYh7/5n/7VfVimCkJ5niGZs\
        02//MkxAsG6IqwAC4KRD2/8QAAcFhgWEv4PxG79Gty3avwyvMQVgC2RUOT/RQAEQGO//MkxBIHGMKsAA4KJDnb/6CixF/xL/0VGI21e2oAbTBa5FTPItP\
        MJBmJn8yZKllg//MkxBgG8Fr+WAJEBq0u+GkQkpRCh8lAPMIyCyF0IssIMnOU9GwkaGXcqKEjSkxB//MkxB8HGF5gAEvMCE1FMy4xMDCqqqqqqqqqqqqq\
        qqqqqqqqqqqqqqqqqqqqqqqq"),
        vul: au("//MkxAAHIAK5uUEAAkF0o3IwA+KAgcggcWOB+Ucp3Lh9QYKHOsH37uGFoiqsRgwb//MkxAYI0GrUAYkQAAmsQr3X2sgZzjPDMhfkc/Iyzond\
        T/ovT/dR/+j6lYyr6JWV//MkxAUIaI7UycgQACAVHB1AKEI5e/2sle63pCGREJfyEIO9XlJb/Z9amR0XNgJn//MkxAYI4YbMABJEaBTVHRA2tF2eem1Fb\
        /r/Zjoccn//9Df/pcRwN/6+mvfiYupq//MkxAUIuRrQAUgQAGYWnQgFTsAuVCbOpm/+/7X8w81NNR7//Wdb/If8N72fIc9g//MkxAUJGQrUAYNQAGa+RA\
        ujYXhgRmscUdZtP2s/b+6uRnUdCpJrf/+g/qKKgQAA//MkxAMGCAZ9dYEQApAhhAAAT6+zAvJBTzX/b9a/+/V/9VVMQU1FMy4xMDBVVVVV")
    }

    // format body
    const body = document.body;
    body.style.background = retroBg;
    body.style.margin = 0;
    body.style.overflow = 'hidden';

    //  canvas
    // create layers
    // Layer 1: Background Layer
    // Layer 2: Interaction Layer
    // Layer 3: Dynamic Layer
    // Layer 4: Text Layer
    const   r = resolution;
    const   columns = fl(width/r);
    const   rows = fl(height/r);
    const   displayPadding = 2*r;
    var layers = {};
    for (i of [1,2,3,4,5]) {
        const el = document.createElement('canvas');
        const obj = {
            canvas: el,
            ctx: el.getContext('2d'),
        }
        await sl(.1)
        obj.ctx.canvas.width = width;
        obj.ctx.canvas.height = height+displayPadding;
        if (i == 1) {
            obj.ctx.fillStyle = retroBg;
            obj.ctx.fillRect(0, 0, width, height+displayPadding);
        } else {
            el.style.position = 'absolute';
            el.style.top = '0';
            el.style.left = '0';
        }
        el.style.width = columns * r;
        // leave padding below for display
        el.style.height = (rows+displayPadding/r) * r;
        el.style.zIndex = `${i}`;
        body.prepend(el);
        layers[i] = obj;
    }
    
    /* PacMan data */
    var pac = {
        p: {x:r,y:r},
        v: pacVelocity,               // velocity in px/s
        d: 'r',
        tol: .45 * r,       // tolerance spatial object extension
        mouth: [.2,.5,.8,.9,.8,.5,.2,0],
        phase: {'r': 0, 'u': 1.5*Math.PI , 'l': Math.PI, 'd': Math.PI/2},
        points: 0,
        steps: 1,
        show: 1
    }

    /* Ghost data */
    // https://en.wikipedia.org/wiki/Ghosts_(Pac-Man)
    var ghost = {
        // main ghost object
        back: {'l':'r','r':'l','u':'d','d':'u'},
        spawn: {x: fl(columns/2)*r, y: fl(rows/2+1)*r},
        v: ghostVelocity,
        cage: null,
        chase: 0,
        door: null,
        list: [],
        r: .01,
        vul: 0
    };

    // instantiate wh
    const wh = [[0,columns-1], fl(rows/2)];

    /* Game data */
    var game = {
        lives: 3,
        up: 0,
        isOn: false,
        period: 15,
        coinPhase: 0,
        coinColor: ['#d6c78b', '#f2ed5a', '#cbcfc6', '#fcffcc']
    }

    // coin code
    function loadCoins (_grid, bigOnly=false) {
        for (i = 0; i < _grid.length; i++) {
            for (j = 0; j < _grid[0].length; j++) {
                if (_grid[i][j].c != 2 && !_grid[i][j].rigid && !isInCage(j*r,i*r)) {
                    if (u() < bigCoinRate) {
                        _grid[i][j].c = 2;
                    } else if (!bigOnly) {
                        _grid[i][j].c = 1;
                    }
                }
            }
        }
    }
    async function eatCoin (x,y,_grid) {
        c = getCell(x+r/2,y+r/2,_grid);
        if (c.c) {
            if (c.c > 1 && !ghost.vul) {vulnerableTimeout(5+u()*5)}
            c.c = 0;
            if (c.coin == 1) {
                pac.points+=10;
            } else {
                pac.points+=20;
            }
            await sound.eat.play()
        }
    }
    async function renderCoins (_grid, ctx) {
        var rad;
        const omega = 2*Math.PI*coinRotationRate;
        const dt = 1/maxFrameRate;
        const gcl = game.coinColor.length;
        while (1) {
            await sl(1e3*dt)
            ctx.clearRect(0, 0, width, height);
            ctx.restore();
            // ctx.save();
            if(!game.isOn){continue}
            for (i = 0; i < _grid.length; i++) {
                for (j = 0; j < _grid[0].length; j++) {
                    const c = _grid[i][j];
                    if (c.c) {

                        if (c.c == 1) {
                            rad = r/3/4;
                        } else {
                            rad = r/3/2;
                        }
                        
                        sine = .5*(Math.sin(game.coinPhase)+1);
                        
                        ctx.beginPath();
                        ctx.ellipse(c.x+fl(r/2), c.y+fl(r/2), rad, rad, 0, 0, 2 * Math.PI);
                        ctx.fillStyle = game.coinColor[fl(sine*gcl)];
                        ctx.closePath();
                        ctx.fill();
                        
                    }
                }
            }
            game.coinPhase = (game.coinPhase + omega * dt) % (2*Math.PI)
        } 
        
    }
    async function countCoins (_grid) {
        counter = 0;
        for (i = 0; i < _grid.length; i++) {
            for (j = 0; j < _grid[0].length; j++) {
                if (_grid[i][j].c) {
                    counter++
                }
            }
        }
        return counter
    }

    // game code
    function setText (text, ctx, x, y, fillColor, strokeColor, fontSize=fl(r/3), center=true) {
        
        // center text
        if (center) {x -= fl(ctx.measureText(text).width/2)}
        
        //x -= Math.max(0, (text.length) * fontSize / 2-40);
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        fontData = `${fontSize}px Arial Black`;
        ctx.font = fontData;
        ctx.fillText(text, x, y); 
        ctx.strokeText(text, x, y);

    }
    async function blinkText (text, x, y, ctx, sec, c1='#fff', c2='#000') {
        T = 60;
        for (i = 0; i < fl(1e3*sec/T); i++) {
            c = [c1,c2][i%2];
            setText (text, textCtx, x, y, c, c);
            await sl(T);
            cl(textCtx);
        }
    }
    async function newGame (_grid) {

        const   activeCtx = layers[3].ctx,
                textCtx = layers[4].ctx;

        // fill grid with coins 
        loadCoins(_grid);

        // define text location
        const gc = ghost.cage;
        const [xt, yt] = [fl(width/2+r/2), (gc[1][1]+.6)*r];
        await blinkText ('READY!', xt, yt, textCtx, 3);

        // switch on the game and give pacman 5 seconds advantage
        cl(textCtx);
        game.isOn = 1;

        // wait until ghosts left the cage, and close it
        await sl(2e3);
        releaseGhosts(_grid);

        // initiate ghost sound loop
        soundLoop();

        // iteratively switch between chase and random, raise the velocity
        const catchLimit = (.75*r)**2
        while (game.lives > 0) {
            
            await sl(30);
            
            for (g of ghost.list) {
                
                // if ghost was touched
                distance = distTo(g.p.x, g.p.y, pac.p.x, pac.p.y);
                if (distance < catchLimit) {

                    if (ghost.vul) { 
                        g.p = {x:ghost.spawn.x+(u()-.5)*r, y:ghost.spawn.y+(u()-.5)*r};
                        game.isOn = 0;
                        await sl(1e3);
                        game.isOn = 1;
                        pac.points += 200;
                        await sl(5e3);
                        releaseGhosts(_grid);
                        break
                    }

                    sound.die.play()
                    
                    game.isOn = 0;
                    await sl(3e3);
                    
                    pac.p = {x:r,y:r};
                    pac.d = 'r';
                    game.lives--;
                    

                    if (game.lives == 0) {
                        pac.show = 0;
                        game.isOn = 1;
                        pac.p = {x:0,y:0};
                        ghostVelocity = .1;
                        break
                    }

                    // generate a few new bigcoins coins 
                    //loadCoins(_grid, 1);

                    for (g of ghost.list) {
                        g.p = {x:ghost.spawn.x+(u()-.5)*r, y:ghost.spawn.y+(u()-.5)*r}
                    }

                    for (let i = 0; i < 12; i++) {
                        await renderDynamicLayer(layers[3].ctx);
                        pac.show = !pac.show;
                        await sl(100)
                    }
                    
                    
                    game.isOn = 1;
                    releaseGhosts(_grid);

                    break
                }
                
                
            }

            // check if coins are gone
            if (game.lives && !(await countCoins(_grid))) {
                const bgCtx = layers[1].ctx;
                game.isOn = 0;
                cl(dynamicCtx);
                cl(bgCtx);
                pac.p = {x:r,y:r};
                pac.d = 'r';
                for (g of ghost.list) {
                    g.p = {x:ghost.spawn.x+(u()-.5)*r, y:ghost.spawn.y+(u()-.5)*r}
                }
                for (i = 0; i < _grid.length; i++) {
                    for (j = 0; j < _grid[0].length; j++) {
                        _grid[i][j].rigid = 0
                    }
                }
                await maze(_grid, bgCtx, wallColor, snakes=mazeWallNumber, length=mazeWallLength, gaprate=0.1);
                await setText ('LEVEL UP!', textCtx, xt, yt, '#fff', '#fff');
                await sl(3e3);
                loadCoins(_grid);

                // raise ghost velocity
                ghostVelocity *= 1.1;

                await blinkText ('READY!', xt, yt, textCtx, 1);
                game.isOn = 1;

                await sl(2e3);
                await releaseGhosts(_grid);

            }
        }

        setText ('GAME OVER', textCtx, xt, yt, '#fff', '#fff')


    }
     
    // grid code
    function getCell (x, y, grid) {
        return grid[fl(y/r)][fl(x/r)]
    }
    function fillCell (x, y, color, grid, ctx) {
        const c = getCell(x, y, grid);
        ctx.fillStyle = color;
        ctx.fillRect(c.x, c.y, r, r);
    }
    async function grid (columns, rows, resolution) {
        let     mat = [];
        const   c = resolution;
        for (let i=0; i<rows; i++) {
            row = [];
            for (let j=0; j<columns; j++) {
                row.push({
                    x:j*c,
                    y:i*c,
                    rigid:0,
                    c:0,
                })
            } 
            mat.push(row)
        } 
        return mat;
    }
    function incrementCoord (x, y, d, i) {
        [xn,yn]=[x,y]
        if (d == '') {
            return [x,y]
        } else if (d == 'r') {
            xn += i
        } else if (d == 'l') {
            xn -= i
        } else if (d == 'u') {
            yn -= i
        } else if (d == 'd') {
            yn += i
        } return [xn,yn]
    }
    function isInCage (x, y) {
        const g = ghost;
        if (x<g.cage[0][0]*r||x>g.cage[0][1]*r||y<g.cage[1][0]*r||y>g.cage[1][1]*r) {
            return false
        } 
        return true
    }
    function isRigid (x, y, grid) {
        return getCell(x, y, grid).rigid
    }
    async function isSpaceForWallBlock (x, y, grid) {            
        for (i of [-1,0,1]) {
            for (j of [-1,0,1]) {
                const [xn,yn] = [x+j*r,y+i*r];
                if (isRigid(xn, yn, grid)) {
                    return false
                }
            }
        }
        return true
    }
    async function isSpaceToContinueWall (x, y, d, grid) {
        const [xn,yn] = incrementCoord(x,y,d,r);
        for (let i of [-1,0,1]) {
            for (let j of [-1,0,1]) {
                const [x_t,y_t] = [xn+j*r, yn+i*r];
                if (!(y_t==y||x_t==x) && isRigid(x_t, y_t, grid)) {
                    return false
                }
            }
        }
        return true
    }
    async function setWallBlock (ctx, col, row, res, grid, color, rigid=1) {
        fillCell(col*res, row*res, color, grid, ctx);
        grid[row][col].rigid = rigid;
    }
    
    // maze code (with grid code dependency)
    async function canMoveInDir (x, y, d, grid, inc=1) {
        bias = 2;
        b1 = r-bias;
        b2 = bias;
        if (d == 'r') {
            p1 = incrementCoord(x+r,y+b2,d,inc);
            p2 = incrementCoord(x+r,y+b1,d,inc);
        } else if (d == 'd') {
            p1 = incrementCoord(x+b2,y+r,d,inc);
            p2 = incrementCoord(x+b1,y+r,d,inc);
        } else if (d == 'l') {
            p1 = incrementCoord(x,y+b2,d,inc);
            p2 = incrementCoord(x,y+b1,d,inc);
        } else if (d == 'u') {
            p1 = incrementCoord(x+b2,y,d,inc);
            p2 = incrementCoord(x+b1,y,d,inc);
        }
        for (p of [p1,p2]) {
            if (p[0]<0||p[0]>=columns*r||p[1]<0||p[1]>=rows*r) {
                return false
            }
        }
        return !isRigid(p1[0],p1[1],grid) && !isRigid(p2[0],p2[1],grid)
    }
    async function maze (grid, ctx, color, snakes=100, length=100, gaprate=0) {
        
        const   g = grid;
        const   col = g[0].length,
                row = g.length;

        ctx.fillStyle = color;

        
        
        //create outter frame
        for (i=0; i<rows; i++) {
            for (j=0; j<col; j++) {
                if (!j||j==col-1||!i||i==rows-1) {
                    await setWallBlock(ctx, j, i, r, g, color);
                }
            }
        }

        

        // place the cage
        dim = [];
        for (ind of [0,1]) {
            d = [col, row][ind];
            dim[ind] = 3;
            if (d%2<1){
                dim[ind] = 4
            }
        }
        if (col>row && dim[1]>4){dim[1]--}
        start = [fl((col-dim[0])/2), fl((row-dim[1])/2)];
        for (x = 0; x < dim[0]+1; x++) {
            for (y = 0; y < dim[1]+1; y++) {
                if (!x||!y||x==dim[0]||y==dim[1]) {
                    await setWallBlock(ctx, start[0]+x, start[1]+y, r, g, color);
                }
            }
        }

        // denote ghost cage position
        ghost.cage = [[start[0],start[0]+dim[0]],[start[1],start[1]+dim[1]]];

        // install cage door
        ghost.door = {col: fl(start[0]+dim[0]/2), row: fl(start[1])} 
        await setWallBlock(ctx, ghost.door.col, ghost.door.row, r, g, retroBg);
        ctx.fillStyle = '#fff';
        ctx.fillRect(ghost.door.col*r, ghost.door.row*r+.4*r, r, .2*r);

        // fill internal space with snake method
        let p = {r:2,c:2},
            br = 0;
        for (let i = 0; i < snakes; i++) {

            // find new position, if search takes to long it ran out of space, then return
            const lim = row*col*100;
            for (let z = 0; z < lim; z++) {
                // sample new point
                const [c,_r] = [fl(u()*(col-4))+2, fl(u()*(row-4))+2];
                const [x,y] = [c*r, _r*r];
                if (!isInCage(x,y) && await isSpaceForWallBlock(x,y,g)) {
                    p.c = c;
                    p.r = _r;
                    break
                }
                if (z == lim-1) {
                    br = 1;
                    break
                }
            } 
            if (br) {break}
            
            // fill starting point
            await setWallBlock(ctx, p.c, p.r, r, g, color)
            
            v = '', v_old = '', p_old = [];
            count = 0;
            for (let i=0; i<length; i++) {

                // check directions
                let d = [];
                for (let direction of ['l', 'r', 'u', 'd']) {
                    if (await isSpaceToContinueWall(p.c*r, p.r*r, direction, g)) {
                        d.push(direction)
                    }
                }
                
                // throw a die with geom. decreasing probability to keep the same direction
                if (!(d.includes(v) && u() < 1/(1+count))) {
                    v = d[fl(u()*d.length)];
                    count = 0
                }

                // terminate snake if no direction is left
                if (!d.length) {break}

                // adjust position
                [x_override, y_override] = incrementCoord(p.c*r, p.r*r, v, 1);
                p.c = fl(x_override/r);
                p.r = fl(y_override/r);

                // increment the length
                count++;

                // set wall at former coord if direction hasn't chagned to leave sometimes a gap
                if (v == v_old && u() < gaprate) {
                    await setWallBlock(ctx, p_old[0], p_old[1], r, g, retroBg, 0)
                }
                await setWallBlock(ctx, p.c, p.r, r, g, color);

                v_old = v;
                p_old = [p.c, p.r]
            
            }
        }
    
        // fill free space
        count = 0;
        for (let repeat = 0; repeat < 10; repeat++) {
            for (let i = 3; i < row; i++) {
                for (let j = 3; j < col; j++) {
                    const cell = g[i][j];
                    if (isInCage(cell.x, cell.y)) {continue}
                    if (!cell.rigid) {
                        for (let [a,b] of [
                            [1,0],
                            [1,1],
                            [0,1],
                            [-1,1],
                            [-1,0],
                            [-1,-1],
                            [0,-1],
                            [1,-1]
                        ]) {
                            if (g[i+a][j+b].rigid) {
                                count++
                            }
                            if (count > 1) {
                                break
                            }
                        }
                        if (count == 1) {
                            await setWallBlock(ctx, j, i, r, g, color);
                            
                        }
                        count = 0;
                    }
                }
            }
        }
        
        // define worm hole pos
        
        for (hx of wh[0]) {
            g[wh[1]][hx].rigid = 0;
            fillCell(hx*r,wh[1]*r,retroBg,g,ctx);
        }

    }
    function openDoor (grid, v=0) {
        grid[ghost.door.row][ghost.door.col].rigid = v
    }
    async function releaseGhosts (_grid) {
        openDoor(_grid);
        allLeft=0;
        while (!allLeft) {
            allLeft=1;
            for (g of ghost.list) {
                if (isInCage(g.p.x,g.p.y)) {
                    allLeft=0
                }
            }
            await sl(10);
        }
        openDoor(_grid, 1);
    }
    function warp (obj) {
        if (obj.p.x < .3*r) {
            obj.p = {x:wh[0][1]*r-.3*r, y:wh[1]*r}
        } else if (pac.p.x+r >= (wh[0][1]+.8)*r) {
            obj.p = {x:(wh[0][0]+.4)*r,y:wh[1]*r}
        }
    }

    // pac-man code
    async function drawPacMan (ctx, x=pac.p.x,y=pac.p.y, fixedDir=null) {
        const rad = fl(r/2);
        const c = [x+rad, y+rad];
        if (fixedDir) {
            mouthIndex = 0;
        } else {
            mouthIndex = fl(2*pac.steps*pac.mouth.length/r);
        }
        const mouth_state = pac.mouth[mouthIndex % pac.mouth.length];
        ctx.save();
        ctx.beginPath();
        ctx.translate(c[0], c[1]);
        if (fixedDir) {
            ctx.rotate(pac.phase[fixedDir])
        } else {
            ctx.rotate(pac.phase[pac.d])
        }
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, rad, mouth_state, 2*Math.PI-mouth_state);
        ctx.fillStyle = ctx.strokeStyle = '#ffff00';
        ctx.lineTo(0, 0);
        ctx.lineTo(rad*Math.cos(mouth_state),rad*Math.sin(mouth_state));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    async function movePacMan (_grid) {
        [pac.p.x, pac.p.y]=incrementCoord(pac.p.x, pac.p.y, pac.d, increments);
        pac.steps++;
        eatCoin(pac.p.x, pac.p.y, _grid);
        // check if worm hole is reached
        warp(pac)
    }
    async function movePacManContinuously (grid) {
        var dir = pac.d;
        while (dir == pac.d) {
            await sl(increments/pac.v)
            if (!game.isOn) {continue}
            if (pac.reserve != '' && await canMoveInDir(pac.p.x, pac.p.y, pac.reserve, grid, increments)) {
                pac.d = pac.reserve;
                dir = pac.d;
                pac.reserve = '';
            } else if (!(await canMoveInDir(pac.p.x, pac.p.y, pac.d, grid, increments))) {
                return
            }
            movePacMan (grid)
            
        }
    }
    function bindKeyBoard (pacManObj, grid) {
        document.addEventListener('keydown', async(event) => {
            if (game.isOn) {
                var k = event.key, d;
                if ( k == 'w' || k == 'ArrowUp' ) {d = 'u'} 
                else if ( k == 'a' || k == 'ArrowLeft' ) {d = 'l'} 
                else if ( k == 's' || k == 'ArrowDown' ) {d = 'd'} 
                else if ( k == 'd' || k == 'ArrowRight' ) {d = 'r'}
                if (d == pacManObj.d) {
                    //
                } else if (await canMoveInDir(pacManObj.p.x, pacManObj.p.y, d, grid, increments) && pacManObj.d != d) {
                    pacManObj.d = d;
                    movePacManContinuously(grid);
                } else if (pacManObj.d != d) {
                    pacManObj.reserve = d;
                }
            }
            
        }, false);
        document.addEventListener('keyup', (event) => {
            pacManObj.reserve = '';
        }, false);
    }
    
    // ghost code
    function initGhost (x, y, color) {
        ghost.list.push({
            p: {
                x: x,
                y: y
            },
            c: color,
            d: 'r',          // direction
            s: 0,           // steps
            r: 1          // randomness
        })
    }
    function distTo (x, y, x_t, y_t) {
        return ((x_t-x)**2+(y_t-y)**2)
    }
    async function drawGhost (_ghost, ctx) {
        const   rad = fl(resolution/2);
        const c = [_ghost.p.x+rad, _ghost.p.y+rad];
        ctx.beginPath();
        ctx.arc(c[0], c[1], rad, -Math.PI, 0);

        // draw all blue if ghosts are vulnerable
        if (ghost.vul) {
            ctx.fillStyle = ctx.strokeStyle = '#0c1794';
        } else {
            ctx.fillStyle = ctx.strokeStyle = _ghost.c;
        }
        
        ctx.fillRect(_ghost.p.x, _ghost.p.y+rad, resolution, fl(rad/2));
        for ([dx,dy] of [[2,2],[1.75,1.75],[1.5,2],[1.25,1.75],[1,2],[.75,1.75],[.5,2],[.25,1.75],[0,2],[0,1.75]]) {
            ctx.lineTo(_ghost.p.x+dx*rad, _ghost.p.y+dy*rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        for (s of [-1,1]) {
            ctx.arc(c[0]+s*fl(rad/2.3), c[1]-fl(rad/3.5), fl(rad/3), 0, 2*Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();    
        }
        ctx.closePath();
        
        // eyes
        ctx.fillStyle = retroBg;
        ctx.beginPath();
        if (_ghost.d == 'u') {
            bias = [0,-.2]
        } else if (_ghost.d == 'd') {
            bias = [0,.2]
        } else if (_ghost.d == 'l') {
            bias = [-.2,0]
        } else if (_ghost.d == 'r') {
            bias = [.2,0]
        } else {
            bias = [0,0]
        }
        ctx.arc(c[0]+fl(rad/2.3)+bias[0]*rad, c[1]-fl(rad/3.5)+bias[1]*rad, fl(rad/4), 0, 2*Math.PI);
        ctx.arc(c[0]-fl(rad/2.3)+bias[0]*rad, c[1]-fl(rad/3.5)+bias[1]*rad, fl(rad/4), 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    async function sampleNewDir (pd) {
        return pd[fl(u()*pd.length)]
    }
    async function moveGhost (_ghost, grid) {
        
        var direction,t;
        const [x, y, g, G, I, backDir] = [_ghost.p.x, _ghost.p.y, _ghost, ghost, increments, ghost.back[_ghost.d]];
        
        // determine possible directions, 
        var pd = [], nd = []; 
        for (d of ['l','r','u','d']) {
            if (await canMoveInDir(x, y, d, grid, I)) {
                pd.push(d)
                if (![g.d,backDir].includes(d)) {
                    nd.push(d)
                }
            }
        }

        // if there is only one option choose it
        if (pd.length < 2) {
            direction = pd[0]
        }

        // run algorithm code if direction is not yet determined
        if (!direction) {

            // select moving parameters depending on case
            t = [pac.p.x, pac.p.y]
            if (isInCage(x,y)) {
                // cage movement code
                t = [G.door[0], G.door[1]-1]
            } else if (G.chase) {
                // code for chase
                [G.v, G.r] = [1.5*ghostVelocity, 0.02]
            } else {
                // random movement
                [G.v, G.r] = [0.8*ghostVelocity, 0.05]
            }

            // perform algorithm
            if (pd.includes(g.d)) {
                direction = g.d;
                if (nd.length > 0 && u() < G.r) {
                    direction = await sampleNewDir(nd);
                    g.s = 0
                }
            } else {
                // try to decrease distance when in chase mode
                // otherwise try to increase it when vulnerable
                let cond, min;
                if (G.vul) {min = 0}
                else {min = 1e6}
                for (d of pd) {
                    [xn, yn] = incrementCoord(x,y,d,I);
                    dist = distTo(xn, yn, t[0], t[1]);
                    if (G.vul) {
                        cond = dist > min
                    } else {
                        cond = dist < min
                    }
                    if (cond) {
                        min = dist;
                        direction = d
                    }
                }
                g.s = 0
            }

        }

        // update direction if determined
        if (direction) { g.d = direction }

        // apply increment in chosen direction
        [g.p.x, g.p.y] = incrementCoord(g.p.x, g.p.y, g.d, I);
        g.s++

        warp(_ghost)

    }
    async function moveGhostContinously (_ghost, grid) {
        while (1) {
            await sl(increments/ghost.v)
            if (!game.isOn) {continue}
            await moveGhost (_ghost, grid);
        }
    }
    async function vulnerableTimeout (t) {
        ghost.vul = 1;
        const v = ghostVelocity;
        ghostVelocity = .1;
        await sl(t*1e3);
        ghost.vul = 0;
        ghostVelocity = v;

    }
    async function soundLoop () {
        while (game.lives>0) {
            
            // design sound
            await sl(5);
            if (!game.isOn || sound.mute) {
                continue
            } else {
                sound.siren.mozPreservesPitch = false;
                sound.siren.playbackRate = 1 + 0.2*(3-game.lives);
                
                if (ghost.vul) {
                    await sound.vul.play();
                } else {
                    await sound.siren.play();
                }
            }
        }
    }
    
    // cherry code
    async function drawCherry (x, y, ctx) {
        // const R = fl(r/4);
        // ctx.save();
        // // for ([xoff, yoff] of [[-R,-fl(R/2)],[R,fl(R/2)]]) {
            
            
            
        // // }
        // ctx.beginPath();
        // ctx.translate(x+r+xoff, y+r+yoff);
        // ctx.moveTo(0, 0);
        // ctx.arc(0, 0, R, 0, 2*Math.PI);
        // ctx.fillStyle = ctx.strokeStyle = '#4f0725';
        
        // ctx.closePath();
        // ctx.fill();
        // //restore();
        // //ctx.save();
        // ctx.arc(0, 0, 0.8*R, 0, 2*Math.PI);
        // ctx.fillStyle = ctx.strokeStyle = '#bf0a34';
        
        // ctx.closePath();
        // ctx.fill();
        // ctx.restore();
        
    }

    // render code
    async function renderDisplay (ctx) {
        b = [[0, rows*r], [columns*r, (rows+2)*r]];
        while (1) {

            await sl(1e3/maxFrameRate);

            // display score in the lower center
            ctx.clearRect(b[0][0], b[0][1], b[1][0], 2*r);
            setText(`SCORE ${pac.points}`, ctx, fl(width/2), b[0][1]+fl(r), '#fff', '#fff', fl(r/2));

            // display lives left
            for (let i=0; i<game.lives; i++) {
                const x_coord = (i*1.2+1)*r;
                drawPacMan(ctx, x_coord, b[0][1]+fl(.5*r), 'l')
            } 

            // render ups
            drawCherry(b[1][0]-r, b[0][1]+fl(.5*r), ctx)
        }
    }
    async function renderDynamicLayer (dynCtx) {
        dynCtx.clearRect(0, 0, width, height);
        if (pac.show) {
            await drawPacMan(dynCtx);
        }
        for (g of ghost.list) {
            await drawGhost(g, dynCtx)
        }
    }
    async function renderEngine (dynCtx, interCtx, displayCtx) {
        
        // initialize asynchronous coin rendering 
        // on interactive layer
        renderCoins(_grid, interCtx);
        renderDisplay(displayCtx);

        // start rendering content on dynamic layer
        while (1) {
            try {
                await renderDynamicLayer(dynCtx, interCtx)
            } catch (error) {
                console.error(error)
            } finally {
                await sl(1e3/maxFrameRate)
            }
        }
    }

    /* -- instantiate -- */
    const staticCtx = layers[1].ctx;
    const interCtx = layers[2].ctx;
    const dynamicCtx = layers[3].ctx;
    const textCtx = layers[4].ctx;
    const displayCtx = layers[5].ctx;

    // load all ghosts to cage
    for (c of ['red', 'cyan', 'orange', 'pink']) {
        initGhost(ghost.spawn.x+(u()-.5)*r, ghost.spawn.y, c)
    }

    // instantiate grid
    const _grid = await grid(columns, rows, r);

    // initialize maze on background layer
    await maze(_grid, staticCtx, wallColor, snakes=mazeWallNumber, length=mazeWallLength, gaprate=0.1);
    
    for (gs of ghost.list) {
        moveGhostContinously(gs,_grid)
    }

    // bind keys to pacman
    bindKeyBoard(pac, _grid);

    // ignite asynchronous render engine
    renderEngine(dynamicCtx, interCtx, displayCtx);
    
    // start new game
    newGame(_grid);
})();    