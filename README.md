<h1 align=center> Pac-Man-Pico </h1> 

This project is dedicated to the original 1980's maze action video game Pac-Man with the aim to build a toy version in vanilla javascript in the most compact size possible.

Original game support on modern x86 architecture offers pacman in actronomically large sizes. Especially when it comes to emulation and booting on single board systems (e.g. for a DIY arcade machine) size begins to matter, in terms of storage and performance. The table below shows the comparison of minimum storage requirements accross different systems

|System|Distribution|Minimum Storage Size [Bytes]|
|-|-|-|
|Playstation 4 | [Playstation Store](https://store.playstation.com/en-us/product/UP0700-CUSA03955_00-PACMAN0000000000) | 1,000,000,000||
|PC|[Steam Store](https://store.steampowered.com/app/394160/ARCADE_GAME_SERIES_PACMAN/) | 1,500,000,000|
|`Pac-Man Nano`|github| 50,000|


## All Features within <strong>50 kB</strong>
- Supported by any browser
- Sound support
- Random Maze Generator using Monte Carlo sampling
- Adaptive pursuit algorithm for ghosts
- Infinite Maze size
- Custom graphics adjustments