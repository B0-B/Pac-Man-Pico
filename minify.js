(async() => {

    // graphics input
    const   height = 300,
            width = 600,
            delay = 0,
            resolution = 20,
            wallColor = '#060654';

    // general
    function u(){return Math.random()}
    function fl(x){return Math.floor(x)}
    function sl(t){return new Promise(r=>setTimeout(r,t))}

    // format body
    const body = document.body;
    body.style.margin = 0;
    body.style.overflow = 'hidden';

    // create canvas
    const   canvas = document.createElement('canvas');
    const   ctx = canvas.getContext('2d');
    const   ctxc = ctx.canvas;
    const   r = resolution;
    const   columns = fl(width/r),
            rows = fl(height/r);
            
    // format canvas and add to body
    ctxc.width = width;
    ctxc.height = height;
    ctx.fillStyle = "000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.style.width = columns*r;
    canvas.style.height = rows*r;
    canvas.style.zIndex = '1';
    body.prepend(canvas);

    // build grid
    async function grid (columns, rows, resolution=5) {
        let     mat = [];
        const   c = resolution;
        for (let i=0; i<rows; i++) {
            row = [];
            for (let j=0; j<columns; j++) {
                row.push({x:j*c,y:i*c,v:0})
            } mat.push(row)
        } return mat;
    }
    const _grid = await grid(columns, rows, r);

    // create maze
    // -- helper methods start --
    async function block (col, row, res, grid_obj, ctx, color, value=1) {
        ctx.fillStyle = color;
        ctx.fillRect(col*res, row*res, res, res);
        grid_obj[row][col].v = value;
        if (delay) {
            await sl(delay)
        }
    }
    function blockFromCoord (coord, grid) {
        return _grid[fl(coord.y/r)][fl(coord.x/r)]
    }
    async function clear (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    function coordIsFree (x,y) {
        return !blockFromCoord ({x:x,y:y}).v
    }
    function free (col, row, grid) {
        if (grid[row][col].v) {return false}
        return true
    }
    function space (col_old, row_old, col_new, row_new, grid, radius=1) {
        if (!free(col_new, row_new, grid)){return false}
        for (let i of [-radius,0,radius]) {
            for (let j of [-radius, 0, radius]) {
                if (i==0 && j==0){continue}
                if (row_new+i==row_old || col_new+j==col_old){continue} 
                if (grid[row_new+i][col_new+j].v) {
                    return false
                }
            }
        }
        return true
    }
    
    // -- helper methods end --
    async function maze (grid_obj, ctx, color, snakes=100, length=100, gaps=2) {
        
        const   g = grid_obj;
        const   res = g[0][1].x - g[0][0].x,
                col = g[0].length,
                row = g.length;

        ctx.fillStyle = color;
        
        // create outter frame
        for (let i=0; i<rows; i++) {
            await block(0, i, res, g, ctx, color);
            await block(col-1, i, res, g, ctx, color)
        }
        for (let i=0; i<col; i++) {
            await block(i, 0, res, g, ctx, color);
            await block(i, row-1, res, g, ctx, color)
        }

        // place the cage
        dim = [];
        for (ind of [0,1]) {
            d = [col, row][ind]
            if (d%2==0){
                dim[ind] = 4
            } else {
                dim[ind] = 3
            }
        }
        start = [(col-dim[0])/2, (row-dim[1])/2];
        await block(start[0], start[1], res, g, ctx, color)
        for (let x = 0; x < dim[0]+1; x++) {
            await block(start[0]+x, start[1], res, g, ctx, color);
            await block(start[0]+x, start[1]+dim[1], res, g, ctx, color);
            
        } for (let y = 0; y < dim[1]; y++) {
            await block(start[0], start[1]+y, res, g, ctx, color);
            await block(start[0]+dim[0], start[1]+y, res, g, ctx, color);
        }

        // fill internal space with snake method
        let p = {x:2,y:2},
            br = 0;
        for (let i = 0; i < snakes; i++) {

            // find new position, if search takes to long it ran out of space, then return
            const lim = row*col*100;
            for (let z = 0; z < lim; z++) {
                [x,y] = [fl(u()*col), fl(u()*row)]
                if (space(x,y,x,y,g)) {p.x=x;p.y=y;break}
                if (z == lim-1){br=1;break}
            }
            if(br){break}

            // fill starting point
            block(p.x, p.y, res, g, ctx, color)
            
            v = '';
            count = 0;
            for (let i=0; i<length; i++) {
                // check directions
                d=[];
                if (space(p.x, p.y, p.x-1, p.y, g)) {d.push('l')}
                if (space(p.x, p.y, p.x+1, p.y, g)) {d.push('r')}
                if (space(p.x, p.y, p.x, p.y+1, g)) {d.push('u')}
                if (space(p.x, p.y, p.x, p.y-1, g)) {d.push('d')}

                // throw a die with geom. decreasing probability to keep the same direction
                if (!(d.includes(v) && u() < 1/(1+count))) {
                    v = d[fl(u()*d.length)]
                    count = 0
                }

                // adjust position
                if (v == 'l') {p.x--}
                else if (v == 'r') {p.x++}
                else if (v == 'u') {p.y++}
                else if (v == 'd') {p.y--}
                else {break}

                await block(p.x, p.y, res, g, ctx, color)
                count++
            }
        }

        // cut out some gaps
        success = 0
        while (success < gaps) {
            [x,y] = [2+fl(u()*(col-4)),2+fl(u()*(row-4))];
            outside_cage = (x < start[0] || x > start[0]+dim[0]) || (y < start[1] || y > start[1]+dim[1])
            if (outside_cage && !free(x,y,g) && ((!free(x+1,y,g) && !free(x-1,y,g) && free(x,y+1,g) && free(x,y-1,g)) || (free(x+1,y,g) && free(x-1,y,g) && !free(x,y+1,g) && !free(x,y-1,g)))) {
                await block(x, y, res, g, ctx, '#000', 0);
                success++
            }
        }
    }
    maze(_grid, ctx, wallColor, snakes=30, length=100, gaps=5);

    /*  Active frame */
    const   canvas_active = document.createElement('canvas');   
    const   ctxa = canvas_active.getContext('2d');
    canvas_active.style.width = columns*r;
    canvas_active.style.height = rows*r;
    ctxa.canvas.width = width;
    ctxa.canvas.height = height;
    canvas_active.style.position = 'absolute';
    canvas_active.style.top = '0';
    canvas_active.style.left = '0';
    canvas_active.style.zIndex = '2';
    body.prepend(canvas_active)

    /* pacman data */
    let pac_v = '',
        pac_p = {x:0,y:0},
        pac_s = 0,
        pac_mouth_states = [.2,.5,.8,.9,.8,.5], 
        pac_direction_phase = {'r': 0, 'u':Math.PI/2, 'l': Math.PI, 'd': 1.5*Math.PI};
        increment = 4,
        tol = .45 * r;
    async function draw_pacman (coord, mouth_state, direction_phase, resolution, ctx) {
        
        rad = fl(resolution/2);
        const c = [coord.x+rad, coord.y+rad]
        ctx.beginPath();
        ctx.arc(c[0], c[1], rad, mouth_state, 2*Math.PI-mouth_state);
        ctx.fillStyle = ctx.strokeStyle = '#d9e312';
        ctx.lineTo(c[0],c[1]);
        ctx.lineTo(c[0]+rad*Math.cos(mouth_state),c[1]+rad*Math.sin(mouth_state));
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
        
        ctx.save()

        
        ctx.rotate(direction_phase)
        ctx.restore();
        // ctx.stroke();
        // ctx.closePath();
        // ctx.fill();
    }
    function set_pac (coord) {
        pac_p = coord
    }
    async function move_pac (direction) {
        if (direction== 'r') {
            pac_p.x += increment
        } else if (direction == 'l') {
            pac_p.x -= increment
        } else if (direction == 'u') {
            pac_p.y -= increment
        } else if (direction == 'd') {
            pac_p.y += increment
        }
        pac_s = (pac_s+1)%pac_mouth_states.length;
    }
    async function can_move_in_dir (direction) {
        const [x,y] = [pac_p.x+r/2,pac_p.y+r/2]; // center
        if (    (direction == 'r' && coordIsFree(x + tol + increment, y+tol) && coordIsFree(x + tol + increment, y-tol)) || 
                (direction == 'l' && coordIsFree(x - tol - increment, y+tol) && coordIsFree(x - tol - increment, y-tol)) ||
                (direction == 'u' && coordIsFree(x + tol, y - tol - increment) && coordIsFree(x - tol, y - tol - increment)) ||
                (direction == 'd' && coordIsFree(x + tol, y + tol + increment) && coordIsFree(x - tol, y + tol + increment)) ) {
                    return true
                }
        return false
    }
    async function keep_moving_pac (direction) {
        if (direction != pac_v && can_move_in_dir(direction)) {
            pac_v = direction;
        } else {
            return
        }
        while (direction == pac_v) {
            if (await can_move_in_dir(direction)) {
                move_pac(direction);
                clear(ctxa);
                draw_pacman(pac_p, pac_mouth_states[pac_s], pac_direction_phase[direction], r, ctxa);
                await sl(30);
            } else {
                return
            } 
        }
    }

    // init pacman at upper left corner
    set_pac(_grid[1][1]);

    // bind keys to pacman
    document.addEventListener('keydown', (event) => {
        var name = event.key,
            code = event.code,
            d;
        console.log(name, code)
        if (name == 'w' || name == 'ArrowUp') {d = 'u'} 
        else if (name == 'a' || name == 'ArrowLeft') {d = 'l'} 
        else if (name == 's' || name == 'ArrowDown') {d = 'd'} 
        else if (name == 'd' || name == 'ArrowRight') {d = 'r'}
        keep_moving_pac(d)
    }, false);



    /* Load ghosts */
    // https://en.wikipedia.org/wiki/Ghosts_(Pac-Man)
    ghosts = [
        {x:start[0]+2,y:start[1]+2,c:'red'},
        {x:start[0]+2,y:start[1]+2,c:'cyan'},
        {x:start[0]+2,y:start[1]+2,c:'orange'},
        {x:start[0]+2,y:start[1]+2,c:'pink'},
    ]

    async function draw_ghost (coord, direction, resolution, ctx) {
        const c = [coord.x+resolution/2, coord.y+resolution/2];
        
    }

})();

