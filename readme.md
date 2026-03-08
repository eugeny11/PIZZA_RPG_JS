# Pizza Legends – JavaScript RPG Demo

A small **Zelda-like 2D RPG demo** built with **vanilla JavaScript** and HTML5 Canvas.

This project demonstrates the core architecture of a simple RPG engine including:

* tile-based movement
* NPC interaction
* cutscenes
* dialogue system
* turn-based battles
* map transitions
* save/load system

The goal of this project was to explore **game engine architecture in JavaScript**, focusing on object-oriented design, event systems, and real-time game loops.

[Gameplay Screenshot](images/img_1.png)

---

# Features

### Overworld Exploration

The player can move freely across tile-based maps and interact with the environment.

![Overworld](./images/img_2.png)

Key features:

* grid-based movement system
* collision detection
* NPC interactions
* camera following system
* layered tile rendering

---

### Dialogue System

NPCs can trigger dialogue sequences and story events.

![Dialogue](./images/img_3.png)

The dialogue system supports:

* text messages
* character facing logic
* conditional events
* story flags

![Gameplay Screenshot](./images/img_2.png)

---

### Turn-Based Battle System

The game includes a simple turn-based combat system.

![Battle](./images/img_4.png)

Battle features:

* enemy encounters
* action selection
* health and status tracking
* event-driven battle logic

---

### Map Transitions

Players can move between different locations seamlessly.

![Map Transition](./images/img_5.png)

The map system supports:

* dynamic map loading
* spawn position control
* cutscene triggers
* layered rendering

![Gameplay Screenshot](./images/img_6.png)

---

### Save & Load System

Game progress is stored in **LocalStorage**, allowing the player to continue where they left off.

Saved data includes:

* current map
* player position
* player direction
* story progress flags

---

# Technical Architecture

The project is structured around several core systems:

### Game Loop

A **fixed timestep game loop** ensures consistent updates regardless of frame rate.

Key responsibilities:

* updating game objects
* processing player input
* rendering the scene

---

### Game Objects

All interactive elements inherit from a base `GameObject` class.

Examples:

* Player
* NPCs
* Map objects

Each object handles its own:

* update logic
* sprite rendering
* behavior events

---

### Event System

The engine uses an **event-driven architecture** for interactions.

Events include:

* dialogue
* battles
* map changes
* story progression

---

### Rendering Pipeline

The rendering order ensures proper depth sorting.

1. Lower map layer
2. Game objects
3. Upper map layer

Objects are sorted by **Y-position** to simulate depth.

---

# Technologies Used

* JavaScript (ES6)
* HTML5 Canvas
* CSS
* LocalStorage API

No external libraries or frameworks were used.

---

# Project Structure

Example structure of the project:

```
/images
/maps
/scripts
   Battle.js
   Overworld.js
   OverworldMap.js
   GameObject.js
   Person.js
   Progress.js
index.html
README.md
```

---

# Running the Project

To run the project locally:

### 1. Clone the repository

```
git clone https://github.com/yourusername/pizza-legends.git
```

### 2. Run a local server

Example using Node:

```
npx serve
```

Then open:

```
http://localhost:3000
```

---

# Learning Goals

This project was created to explore:

* game architecture in JavaScript
* canvas rendering
* event-driven systems
* object-oriented game design

It serves as a **practice project and technical prototype**, not a full game.

---

# Future Improvements

Possible extensions:

* larger world maps
* inventory system
* skill trees
* enemy AI
* sound and music
* save slots

---

# Author

Created by **Eugeny Iakovlev**

Portfolio
[https://nemeton-webportals.co.rs/portfolio/](https://nemeton-webportals.co.rs/portfolio/)

GitHub
[https://github.com/eugeny11](https://github.com/eugeny11)

---
