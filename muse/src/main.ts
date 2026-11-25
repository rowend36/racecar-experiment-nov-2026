import './style.css';
import { Game } from './game/Game';

const canvas = document.createElement('canvas');
canvas.id = 'scene';
document.getElementById('app')!.appendChild(canvas);

new Game(canvas);
