<h1 align=center><strong> Pac-Man-Pico</strong> </h1> 



### [Play a demo](https://codepen.io/b0-b/pen/abjzZJQ) of the current stable version. 
---
## About
This project is dedicated to the original 1980's maze action video game Pac-Man with the aim to build a simulative toy engine in vanilla javascript in the most compact size possible. 

Original game support on modern x86 architecture offers pacman in actronomically large sizes. Especially when it comes to emulation and booting on single board systems (e.g. for a DIY arcade machine) size begins to matter, in terms of storage and performance. The table below shows the comparison of minimum storage requirements accross different systems

|System|Distribution|Minimum Storage Size [Bytes]|
|-|-|-|
|Playstation 4 | [Playstation Store](https://store.playstation.com/en-us/product/UP0700-CUSA03955_00-PACMAN0000000000) | 1,000,000,000||
|PC|[Steam Store](https://store.steampowered.com/app/394160/ARCADE_GAME_SERIES_PACMAN/) | 1,500,000,000|
|Pac-Man-Pico|github| 50,000|

The timeline is undefined and continuous. Developed with 💛

## All Features within <strong>50 kB</strong>
- Supported by any browser
- Sound support
- Random Maze Generator using Monte Carlo simulation
- Adaptive pursuit algorithm for ghosts
- Infinite Maze size
- Custom graphics adjustments


## Playground

If for instance one decreases the "resolution" variable which actually is the block size from 40 to 20 pixels, the maze can be densed down to a larger maze in total but in persistent bounds.
It might be necessary to adjust the velocities as well.

